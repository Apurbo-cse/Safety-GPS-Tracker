import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { Category, Device, Faq, HeroSlide, Plan } from "./catalog.entities";
import type { AdminProductsQuery, CategoryDto, DeviceDto, FaqDto, HeroSlideDto, PlanDto, ProductsQuery } from "./catalog.dto";
import { MEDIA_TOKEN, MediaService } from "../media/media.service";
import { mediaTokensIn, resolveMedia } from "../common/html";

/** Drop nulls so the JSON matches the website's optional-field types (`price?: number`). */
const clean = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined)) as Partial<T>;
const strip = <T extends { sort: number; active: boolean; createdAt: Date; updatedAt: Date }>(e: T) => {
  const { sort: _s, active: _a, createdAt: _c, updatedAt: _u, ...rest } = e; void _s; void _a; void _c; void _u;
  return clean(rest);
};

const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");
/** Every picture reference a product carries (gallery + main). */
const refsOf = (d: Pick<Device, "image" | "images" | "description"> | null | undefined) => [...(d?.images ?? []), ...(d?.image ? [d.image] : []), ...mediaTokensIn(d?.description)];

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Plan) private plans: Repository<Plan>,
    @InjectRepository(Device) private devices: Repository<Device>,
    @InjectRepository(Faq) private faqs: Repository<Faq>,
    @InjectRepository(Category) private categories: Repository<Category>,
    @InjectRepository(HeroSlide) private slides: Repository<HeroSlide>,
    @InjectDataSource() private db: DataSource,
    private media: MediaService,
  ) {}

  /** "media:<id>" tokens become absolute URLs on this API; "/img/…" files stay as they are (the website serves them). */
  private publicDevice(d: Device, base: string, full = false) {
    const url = (ref: string) => { const m = MEDIA_TOKEN.exec(ref); return m ? `${base}/api/v1/media/${m[1]}` : ref; };
    const images = (d.images?.length ? d.images : d.image ? [d.image] : []).map(url);
    // cost never leaves the server; the long description is only sent with a single product
    const { image: _i, images: _is, cost: _c, description, ...rest } = strip(d) as Partial<Device>; void _i; void _is; void _c;
    return { ...rest, ...(images.length ? { image: images[0], images } : {}), ...(full && description ? { description: resolveMedia(description, base) } : {}) };
  }

  private publicPlan(p: Plan, base: string) {
    const { cost: _c, description, ...rest } = strip(p) as Partial<Plan>; void _c;
    return { ...rest, ...(description ? { description: resolveMedia(description, base) } : {}) };
  }

  /**
   * What the public website renders: active rows only, in display order.
   * A hidden category (or sub-category) hides its products too.
   */
  async publicCatalog(base: string) {
    const where = { active: true };
    const order = { sort: "ASC", id: "ASC" } as const;
    const [plans, devices, faqs, cats, heroSlides] = await Promise.all([
      this.plans.find({ where, order }), this.devices.find({ where, order }), this.faqs.find({ where, order }), this.categories.find({ order }), this.slides.find({ where, order }),
    ]);
    const top = cats.filter((c) => !c.parentId && c.active);
    const subs = cats.filter((c) => c.parentId && c.active && top.some((t) => t.id === c.parentId));
    const visible = devices.filter((d) => {
      const t = top.find((c) => c.name === d.category);
      return !!t && subs.some((s) => s.parentId === t.id && s.name === d.subcategory);
    });
    return {
      plans: plans.map((p) => this.publicPlan(p, base)),
      devices: visible.map((d) => this.publicDevice(d, base)),
      faqs: faqs.map((f) => { const x = strip(f) as Partial<Faq>; return { ...x, a: resolveMedia(x.a, base) }; }),
      categories: [...top, ...subs].map((c) => ({ id: c.id, name: c.name, parentId: c.parentId ?? undefined, sort: c.sort })),
      heroSlides: heroSlides.map(strip),
    };
  }

  /** Admin view: everything, including hidden rows. */
  async adminCatalog() {
    const order = { sort: "ASC", id: "ASC" } as const;
    const [plans, devices, faqs, categories, heroSlides] = await Promise.all([this.plans.find({ order }), this.devices.find({ order }), this.faqs.find({ order }), this.categories.find({ order }), this.slides.find({ order })]);
    return { plans, devices, faqs, categories, heroSlides };
  }

  /** `keepCost`: the editor can't see cost prices, so a save from them must not wipe the stored one. */
  async upsertPlan(id: string, dto: PlanDto, keepCost = false) {
    const prev = await this.plans.findOne({ where: { id } });
    const saved = await this.plans.save(this.plans.create({ sort: 0, active: true, highlight: null, image: null, siteTitle: null, sourceNo: 0, description: "", vehicles: prev?.vehicles ?? [], ...dto, cost: keepCost ? prev?.cost ?? null : dto.cost ?? null, id }));
    const kept = new Set(mediaTokensIn(saved.description));
    await this.media.deleteOrphans(mediaTokensIn(prev?.description).filter((t) => !kept.has(t)));
    return saved;
  }
  async upsertDevice(id: string, dto: DeviceDto, keepCost = false) {
    await this.assertCategoryExists(dto.category, dto.subcategory);
    const prev = await this.devices.findOne({ where: { id } });
    // the gallery wins; `image` always mirrors its first picture
    const images = dto.images ?? prev?.images ?? [];
    const image = images.length ? images[0] : dto.image ?? null;
    const saved = await this.devices.save(this.devices.create({ sort: 0, active: true, siteTitle: null, price: null, monthly: null, planId: null, priceNote: "", description: "", ...dto, cost: keepCost ? prev?.cost ?? null : dto.cost ?? null, stock: dto.stock ?? null, images, image, id }));
    // pictures this product no longer uses are deleted when nothing else refers to them
    const kept = new Set(refsOf(saved));
    await this.media.deleteOrphans(refsOf(prev).filter((r) => !kept.has(r)));
    return saved;
  }
  async upsertSlide(id: string, dto: HeroSlideDto) { return this.slides.save(this.slides.create({ sort: 0, active: true, ...dto, id } as HeroSlide)); }
  async upsertFaq(id: string, dto: FaqDto) {
    const prev = await this.faqs.findOne({ where: { id } });
    const saved = await this.faqs.save(this.faqs.create({ sort: 0, active: true, tag: "", ...dto, id }));
    const kept = new Set(mediaTokensIn(saved.a));
    await this.media.deleteOrphans(mediaTokensIn(prev?.a).filter((t) => !kept.has(t)));
    return saved;
  }

  /** A product must use a category and sub-category that exist (create them first). */
  private async assertCategoryExists(category: string, subcategory: string) {
    const cat = await this.categories.createQueryBuilder("c").where("c.name = :n AND c.parent_id IS NULL", { n: category }).getOne();
    if (!cat) throw new BadRequestException(`Category “${category}” doesn't exist — create it first`);
    const sub = await this.categories.findOne({ where: { name: subcategory, parentId: cat.id } });
    if (!sub) throw new BadRequestException(`Sub-category “${subcategory}” doesn't exist under “${category}” — create it first`);
  }

  async upsertCategory(id: string, dto: CategoryDto) {
    const existing = await this.categories.findOne({ where: { id } });
    const parentId = dto.parentId ?? null;
    let parent: Category | null = null;

    if (existing && existing.parentId !== parentId) throw new BadRequestException("A category can't be moved. Create a new one instead.");
    if (parentId) {
      if (parentId === id) throw new BadRequestException("A category can't be its own parent");
      parent = await this.categories.findOne({ where: { id: parentId } });
      if (!parent) throw new BadRequestException("The parent category doesn't exist");
      if (parent.parentId) throw new BadRequestException("Sub-categories can't have their own sub-categories");
    }

    // names must be unique among siblings (ignoring upper/lower case)
    const dup = await this.categories.createQueryBuilder("c")
      .where("lower(c.name) = lower(:n) AND c.id <> :id", { n: dto.name, id })
      .andWhere(parentId ? "c.parent_id = :p" : "c.parent_id IS NULL", { p: parentId })
      .getExists();
    if (dup) throw new ConflictException(parentId ? "That sub-category name is already used in this category" : "That category name already exists");

    return this.db.transaction(async (m) => {
      const saved = await m.getRepository(Category).save(m.getRepository(Category).create({ sort: 0, active: true, ...dto, parentId, id }));
      // products store the names, so a rename must follow through
      if (existing && existing.name !== dto.name) {
        if (!parent) await m.getRepository(Device).update({ category: existing.name }, { category: dto.name });
        else await m.getRepository(Device).update({ category: parent.name, subcategory: existing.name }, { subcategory: dto.name });
      }
      return saved;
    });
  }

  async removeCategory(id: string) {
    const cat = await this.categories.findOne({ where: { id } });
    if (!cat) throw new NotFoundException("Not found");
    if (!cat.parentId) {
      const children = await this.categories.count({ where: { parentId: id } });
      if (children) throw new ConflictException(`Delete its ${children} sub-categor${children === 1 ? "y" : "ies"} first`);
    }
    const parent = cat.parentId ? await this.categories.findOne({ where: { id: cat.parentId } }) : null;
    const used = await this.devices.count({ where: parent ? { category: parent.name, subcategory: cat.name } : { category: cat.name } });
    if (used) throw new ConflictException(`${used} product${used === 1 ? " uses" : "s use"} it — move or delete ${used === 1 ? "it" : "them"} first (or hide the category instead)`);
    await this.categories.delete({ id });
  }

  async remove(kind: "plans" | "devices" | "faqs" | "slides", id: string) {
    const repo = (kind === "plans" ? this.plans : kind === "devices" ? this.devices : kind === "slides" ? this.slides : this.faqs) as Repository<{ id: string }>;
    const prevDevice = kind === "devices" ? await this.devices.findOne({ where: { id } }) : null;
    const prevText = kind === "plans" ? (await this.plans.findOne({ where: { id } }))?.description : kind === "faqs" ? (await this.faqs.findOne({ where: { id } }))?.a : null;
    const res = await repo.delete({ id });
    if (!res.affected) throw new NotFoundException("Not found");
    if (prevDevice) await this.media.deleteOrphans(refsOf(prevDevice));
    if (prevText) await this.media.deleteOrphans(mediaTokensIn(prevText));
  }

  /** Same rule as the public catalogue: the product, its category and its sub-category must all be visible. */
  private visibleProducts() {
    return this.devices.createQueryBuilder("d").where("d.active = true").andWhere(
      `EXISTS (SELECT 1 FROM categories s JOIN categories c ON c.id = s.parent_id
                WHERE c.parent_id IS NULL AND c.active AND s.active AND c.name = d.category AND s.name = d.subcategory)`);
  }

  /** One visible product with its long description. */
  async publicProduct(id: string, base: string) {
    const d = await this.visibleProducts().andWhere("d.id = :id", { id }).getOne();
    if (!d) throw new NotFoundException("Product not found");
    return this.publicDevice(d, base, true);
  }

  /** Shop listing — filtered, sorted and paged in the database. */
  async listProducts(q: ProductsQuery, base: string) {
    const page = q.page ?? 1, limit = q.limit ?? 12;
    const qb = this.visibleProducts();
    if (q.category) qb.andWhere("d.category = :cat", { cat: q.category });
    if (q.sub) qb.andWhere("d.subcategory = :sub", { sub: q.sub });
    if (q.q) qb.andWhere("(d.name ILIKE :term OR d.summary ILIKE :term)", { term: `%${escapeLike(q.q)}%` });
    if (q.maxPrice !== undefined) qb.andWhere("(d.price IS NULL OR d.price <= :max)", { max: q.maxPrice });
    if (q.priced && !q.call) qb.andWhere("d.price IS NOT NULL");
    if (q.call && !q.priced) qb.andWhere("d.price IS NULL");
    if (q.ids) qb.andWhere(q.ids.length ? "d.id IN (:...ids)" : "1 = 0", { ids: q.ids });
    if (q.sort === "price-asc") qb.orderBy("d.price", "ASC", "NULLS LAST");
    else if (q.sort === "price-desc") qb.orderBy("d.price", "DESC", "NULLS LAST");
    else if (q.sort === "name") qb.orderBy("d.name", "ASC");
    else qb.orderBy("d.sort", "ASC");
    qb.addOrderBy("d.id", "ASC");
    const [rows, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { items: rows.map((d) => this.publicDevice(d, base)), total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
  }

  /** Admin product list: includes hidden products and the raw picture tokens. */
  async adminProducts(q: AdminProductsQuery) {
    const page = q.page ?? 1, limit = q.limit ?? 20;
    const qb = this.devices.createQueryBuilder("d").where("1 = 1");
    if (q.status === "visible") qb.andWhere("d.active = true");
    if (q.status === "hidden") qb.andWhere("d.active = false");
    if (q.category) qb.andWhere("d.category = :cat", { cat: q.category });
    if (q.q) qb.andWhere("(d.name ILIKE :term OR d.id ILIKE :term)", { term: `%${escapeLike(q.q)}%` });
    qb.orderBy("d.sort", "ASC").addOrderBy("d.id", "ASC");
    const [items, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
  }
}
