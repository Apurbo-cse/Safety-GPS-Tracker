import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, Repository } from "typeorm";
import { mediaTokensIn, plainText, resolveMedia } from "../common/html";
import { MEDIA_TOKEN, MediaService } from "../media/media.service";
import type { AdminPostsQuery, PostDto, PostsQuery } from "./posts.dto";
import { Post } from "./post.entity";

const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");
const refsOf = (p: Pick<Post, "cover" | "content"> | null | undefined) => [...(p?.cover ? [p.cover] : []), ...mediaTokensIn(p?.content)];

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private posts: Repository<Post>, private media: MediaService) {}

  private url(ref: string | null, base: string) { const m = ref ? MEDIA_TOKEN.exec(ref) : null; return m ? `${base}/api/v1/media/${m[1]}` : ref ?? undefined; }

  /** Published posts only (and only once their publish time has come). */
  private live() { return { published: true, publishedAt: LessThanOrEqual(new Date()) }; }

  async listPublic(q: PostsQuery, base: string) {
    const page = q.page ?? 1, limit = q.limit ?? 9;
    const [rows, total] = await this.posts.findAndCount({ where: this.live(), order: { publishedAt: "DESC", id: "ASC" }, skip: (page - 1) * limit, take: limit, select: { id: true, title: true, excerpt: true, cover: true, publishedAt: true } });
    return { items: rows.map((p) => ({ id: p.id, title: p.title, excerpt: p.excerpt, cover: this.url(p.cover, base), publishedAt: p.publishedAt })), total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
  }

  async getPublic(id: string, base: string) {
    const p = await this.posts.findOne({ where: { id, ...this.live() } });
    if (!p) throw new NotFoundException("Post not found");
    return { id: p.id, title: p.title, excerpt: p.excerpt, cover: this.url(p.cover, base), content: resolveMedia(p.content, base), publishedAt: p.publishedAt, updatedAt: p.updatedAt };
  }

  /* ------------------------------------------------------------- admin */
  async adminList(q: AdminPostsQuery) {
    const page = q.page ?? 1, limit = q.limit ?? 20;
    const qb = this.posts.createQueryBuilder("p").select(["p.id", "p.title", "p.excerpt", "p.cover", "p.published", "p.publishedAt", "p.updatedAt"]);
    if (q.status === "published") qb.andWhere("p.published = true");
    if (q.status === "draft") qb.andWhere("p.published = false");
    if (q.q) qb.andWhere("(p.title ILIKE :t OR p.id ILIKE :t)", { t: `%${escapeLike(q.q)}%` });
    const [items, total] = await qb.orderBy("p.updatedAt", "DESC").skip((page - 1) * limit).take(limit).getManyAndCount();
    return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
  }

  async adminGet(id: string) {
    const p = await this.posts.findOne({ where: { id } });
    if (!p) throw new NotFoundException("Post not found");
    return p;
  }

  async upsert(id: string, dto: PostDto) {
    const prev = await this.posts.findOne({ where: { id } });
    const publishedAt = dto.published ? (dto.publishedAt ? new Date(dto.publishedAt) : prev?.publishedAt ?? new Date()) : prev?.publishedAt ?? null;
    const excerpt = dto.excerpt || plainText(dto.content).slice(0, 160);
    const saved = await this.posts.save(this.posts.create({ id, title: dto.title, excerpt, cover: dto.cover ?? null, content: dto.content, published: dto.published, publishedAt }));
    const kept = new Set(refsOf(saved));
    await this.media.deleteOrphans(refsOf(prev).filter((r) => !kept.has(r)));
    return saved;
  }

  async remove(id: string) {
    const prev = await this.posts.findOne({ where: { id } });
    if (!prev) throw new NotFoundException("Post not found");
    await this.posts.delete({ id });
    await this.media.deleteOrphans(refsOf(prev));
  }
}
