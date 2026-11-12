import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { mediaTokensIn, resolveMedia } from "../common/html";
import { MediaService } from "../media/media.service";
import type { PageDto, SiteDto } from "./content.dto";
import { Page, SiteContent } from "./content.entities";
import { DEFAULT_SITE, SYSTEM_PAGES, type SiteDetails } from "./site.defaults";

@Injectable()
export class ContentService {
  constructor(@InjectRepository(SiteContent) private site: Repository<SiteContent>, @InjectRepository(Page) private pages: Repository<Page>, private media: MediaService) {}

  /** Saved company details over the built-in defaults, so a missing field never leaves a hole on the website. */
  async details(): Promise<SiteDetails> {
    const row = await this.site.findOne({ where: { key: "site" } });
    return { ...DEFAULT_SITE, ...((row?.data ?? {}) as Partial<SiteDetails>) };
  }

  async saveDetails(dto: SiteDto) {
    const data = { ...DEFAULT_SITE, ...dto, tagline: dto.tagline ?? "", hours: dto.hours ?? "", facebook: dto.facebook ?? "", youtube: dto.youtube ?? "", linkedin: dto.linkedin ?? "", instagram: dto.instagram ?? "" };
    await this.site.save(this.site.create({ key: "site", data }));
    return this.details();
  }

  /** What the website needs on every page: the company details and links to the extra pages (Privacy and Terms have fixed places). */
  async publicSite() {
    const extra = await this.pages.find({ where: { published: true }, order: { sort: "ASC", title: "ASC" }, select: { id: true, title: true } });
    return { ...(await this.details()), pages: extra.filter((p) => !(SYSTEM_PAGES as readonly string[]).includes(p.id)).map((p) => ({ id: p.id, title: p.title })) };
  }

  async getPublicPage(id: string, base: string) {
    const p = await this.pages.findOne({ where: { id, published: true } });
    if (!p) throw new NotFoundException("Page not found");
    return { id: p.id, title: p.title, content: resolveMedia(p.content, base), updatedAt: p.updatedAt };
  }

  /* ------------------------------------------------------------- admin */
  async adminPages() {
    const rows = await this.pages.find({ order: { sort: "ASC", title: "ASC" }, select: { id: true, title: true, published: true, sort: true, updatedAt: true } });
    return rows.map((p) => ({ ...p, system: (SYSTEM_PAGES as readonly string[]).includes(p.id) }));
  }

  async adminPage(id: string) {
    const p = await this.pages.findOne({ where: { id } });
    if (!p) throw new NotFoundException("Page not found");
    return { ...p, system: (SYSTEM_PAGES as readonly string[]).includes(p.id) };
  }

  async upsertPage(id: string, dto: PageDto) {
    const prev = await this.pages.findOne({ where: { id } });
    if (prev && (SYSTEM_PAGES as readonly string[]).includes(id) && !dto.published) throw new BadRequestException("Privacy and Terms must stay published — they are linked from sign-up and checkout");
    const saved = await this.pages.save(this.pages.create({ id, title: dto.title, content: dto.content, published: dto.published, sort: dto.sort ?? prev?.sort ?? 0 }));
    const kept = new Set(mediaTokensIn(saved.content));
    await this.media.deleteOrphans(mediaTokensIn(prev?.content).filter((t) => !kept.has(t)));
    return this.adminPage(id);
  }

  async removePage(id: string) {
    if ((SYSTEM_PAGES as readonly string[]).includes(id)) throw new BadRequestException("Privacy and Terms can be edited but not deleted");
    const prev = await this.pages.findOne({ where: { id } });
    if (!prev) throw new NotFoundException("Page not found");
    await this.pages.delete({ id });
    await this.media.deleteOrphans(mediaTokensIn(prev.content));
  }
}
