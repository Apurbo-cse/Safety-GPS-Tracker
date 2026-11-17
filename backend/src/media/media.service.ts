import { BadRequestException, Injectable, Logger, NotFoundException, type OnModuleInit } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { createHash } from "node:crypto";
import { DataSource, Repository } from "typeorm";
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { storageDir } from "../common/storage";
import { MediaFile } from "./media.entity";

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const MEDIA_TOKEN = /^media:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

/** Detect the real image type from the first bytes — never trust the file name or the Content-Type the browser sent. SVG is refused on purpose (it can carry scripts). */
export function sniffImage(b: Buffer): "image/jpeg" | "image/png" | "image/webp" | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 12 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b.length > 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

@Injectable()
export class MediaService implements OnModuleInit {
  private logger = new Logger("Media");
  constructor(@InjectRepository(MediaFile) private repo: Repository<MediaFile>, @InjectDataSource() private db: DataSource) {}

  async save(buf: Buffer) {
    if (!buf?.length) throw new BadRequestException("No file received");
    if (buf.length > MAX_IMAGE_BYTES) throw new BadRequestException("The picture is larger than 3 MB");
    const mime = sniffImage(buf);
    if (!mime) throw new BadRequestException("Only JPEG, PNG or WebP pictures are allowed");
    const sha256 = createHash("sha256").update(buf).digest("hex");
    const existing = await this.repo.findOne({ where: { sha256 } });
    if (existing) {
      // the same picture again: reuse it — and put its file back if it has gone missing
      if (!(await stat(this.file(existing.id)).catch(() => null))) await this.write(existing.id, buf);
      return { id: existing.id, mime: existing.mime, size: existing.size };
    }
    const row = await this.repo.save(this.repo.create({ mime, size: buf.length, sha256, data: null }));
    try { await this.write(row.id, buf); }
    catch (e) { await this.repo.delete({ id: row.id }); await rm(this.file(row.id), { force: true }); throw e; } // no file, no row
    return { id: row.id, mime, size: buf.length };
  }

  /** Write via a temporary name and rename, so a half-written file is never served. */
  private async write(id: string, buf: Buffer) {
    await mkdir(this.dir(), { recursive: true });
    const tmp = `${this.file(id)}.tmp`;
    try { await writeFile(tmp, buf); await rename(tmp, this.file(id)); }
    catch (e) { await rm(tmp, { force: true }); throw e; }
  }

  onModuleInit() {
    // clean up now and then: files nobody saved, and rows whose file is gone
    const first = setTimeout(() => void this.sweep(), 60_000); first.unref();
    const every = setInterval(() => void this.sweep(), 6 * 3_600_000); every.unref();
  }

  /**
   * Undo uploads that never made it into a product, post or slide (the browser closed, the save failed…):
   * stray files with no row, rows with no file, and uploaded pictures nothing uses after a day.
   */
  async sweep() {
    try {
      const hour = 3_600_000;
      const rows: { id: string; hasData: boolean; old: boolean }[] = await this.db.query(`SELECT id, data IS NOT NULL AS "hasData", created_at < now() - interval '1 day' AS old FROM media`);
      const ids = new Set(rows.map((r) => r.id));
      let files: string[] = [];
      try { files = await readdir(this.dir()); } catch { /* no folder yet */ }
      for (const f of files) {
        const id = f.replace(/\.tmp$/, "");
        if (f.endsWith(".tmp") || !ids.has(id)) {
          const st = await stat(join(this.dir(), f)).catch(() => null);
          if (st && Date.now() - st.mtimeMs > hour) { await rm(join(this.dir(), f), { force: true }); this.logger.log(`Removed unsaved file ${f}`); }
        }
      }
      const have = new Set(files.filter((f) => !f.endsWith(".tmp")));
      for (const r of rows) {
        if (!r.hasData && !have.has(r.id) && r.old) { await this.repo.delete({ id: r.id }); this.logger.log(`Removed picture ${r.id} (its file is gone)`); }
        else if (r.old) await this.deleteOrphans([`media:${r.id}`]); // does nothing while something still uses it
      }
    } catch (e) { this.logger.warn(`Clean-up skipped: ${e instanceof Error ? e.message : e}`); }
  }

  private dir() { return join(storageDir(), "media"); }
  private file(id: string) { return join(this.dir(), id); }

  /** file id -> what the file looked like when it was last hashed, so an unchanged file is not read again on every request */
  private seen = new Map<string, { mtimeMs: number; size: number; sha256: string }>();

  /**
   * Details of a picture, checked against the real file: if the file was edited on the server, its new size and hash are
   * recorded (and the old ones dropped), so browsers are never told an edited file is still the old one.
   */
  async meta(id: string) {
    const row = await this.repo.findOne({ where: { id }, select: { id: true, mime: true, size: true, sha256: true } });
    if (!row) throw new NotFoundException("Not found");
    const st = await stat(this.file(id)).catch(() => null);
    if (!st) {
      // older uploads that still live in the database
      const legacy = await this.repo.createQueryBuilder("m").select("m.id").addSelect("m.data").where("m.id = :id", { id }).getOne();
      if (!legacy?.data) throw new NotFoundException("Not found");
      return { mime: row.mime, size: row.size, sha256: row.sha256, bytes: async () => legacy.data as Buffer };
    }
    let seen = this.seen.get(id);
    if (!seen || seen.mtimeMs !== st.mtimeMs || seen.size !== st.size) {
      const sha256 = createHash("sha256").update(await readFile(this.file(id))).digest("hex");
      seen = { mtimeMs: st.mtimeMs, size: st.size, sha256 };
      this.seen.set(id, seen);
    }
    if (seen.sha256 !== row.sha256 || st.size !== row.size) {
      const real = await readFile(this.file(id));
      if (!sniffImage(real)) throw new NotFoundException("Not found"); // an edit that is no longer a picture is never served
      this.logger.warn(`Picture ${id} was changed on disk — recording its new content`);
      await this.repo.update({ id }, { sha256: seen.sha256, size: st.size, mime: sniffImage(real)! });
      return { mime: sniffImage(real)!, size: st.size, sha256: seen.sha256, bytes: async () => real };
    }
    return { mime: row.mime, size: row.size, sha256: row.sha256, bytes: () => readFile(this.file(id)) };
  }

  /** Delete pictures that no product refers to any more. */
  async deleteOrphans(tokens: string[]) {
    for (const t of new Set(tokens)) {
      const m = MEDIA_TOKEN.exec(t);
      if (!m) continue;
      // a picture can be a product's picture, or sit inside any formatted text (descriptions, FAQ answers, news)
      const like = `%${t}%`;
      const used = await this.db.query(
        `SELECT 1 WHERE EXISTS (SELECT 1 FROM devices WHERE image = $1 OR images @> $2::jsonb OR description LIKE $3)
            OR EXISTS (SELECT 1 FROM plans WHERE description LIKE $3)
            OR EXISTS (SELECT 1 FROM faqs WHERE a LIKE $3)
            OR EXISTS (SELECT 1 FROM posts WHERE cover = $1 OR content LIKE $3)
            OR EXISTS (SELECT 1 FROM pages WHERE content LIKE $3)
            OR EXISTS (SELECT 1 FROM hero_slides WHERE bg_image = $1)
            OR EXISTS (SELECT 1 FROM plans WHERE image = $1)`, [t, JSON.stringify([t]), like]);
      if (!used.length) { await this.repo.delete({ id: m[1] }); await rm(this.file(m[1]), { force: true }); }
    }
  }
}
