import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { createHash } from "node:crypto";
import { DataSource, Repository } from "typeorm";
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
export class MediaService {
  constructor(@InjectRepository(MediaFile) private repo: Repository<MediaFile>, @InjectDataSource() private db: DataSource) {}

  async save(buf: Buffer) {
    if (!buf?.length) throw new BadRequestException("No file received");
    if (buf.length > MAX_IMAGE_BYTES) throw new BadRequestException("The picture is larger than 3 MB");
    const mime = sniffImage(buf);
    if (!mime) throw new BadRequestException("Only JPEG, PNG or WebP pictures are allowed");
    const sha256 = createHash("sha256").update(buf).digest("hex");
    const existing = await this.repo.findOne({ where: { sha256 } });
    if (existing) return { id: existing.id, mime: existing.mime, size: existing.size };
    const row = await this.repo.save(this.repo.create({ mime, size: buf.length, sha256, data: buf }));
    return { id: row.id, mime, size: buf.length };
  }

  async get(id: string) {
    const row = await this.repo.findOne({ where: { id }, select: { id: true, mime: true, size: true, sha256: true, data: true } });
    if (!row) throw new NotFoundException("Not found");
    return row;
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
            OR EXISTS (SELECT 1 FROM posts WHERE cover = $1 OR content LIKE $3)`, [t, JSON.stringify([t]), like]);
      if (!used.length) await this.repo.delete({ id: m[1] });
    }
  }
}
