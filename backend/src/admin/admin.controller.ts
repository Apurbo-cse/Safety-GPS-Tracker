import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Put, Query } from "@nestjs/common";
import { AdminProductsQuery, CategoryDto, DeviceDto, FaqDto, HeroSlideDto, PlanDto } from "../catalog/catalog.dto";
import { CatalogService } from "../catalog/catalog.service";
import { AnyPermission, CurrentUser, Permissions, Roles } from "../common/decorators";
import { SlugPipe } from "../common/slug.pipe";
import { AdminOrdersQuery, UpdateStatusDto } from "../orders/orders.dto";
import { OrdersService } from "../orders/orders.service";
import { AdminPostsQuery, PostDto } from "../posts/posts.dto";
import { PostsService } from "../posts/posts.service";
import { RolesService } from "../staff/roles.service";
import type { User } from "../users/user.entity";
import { AdminService, CustomersQuery } from "./admin.service";

/** Staff cost prices are only for people with "finance.view". */
const hideCost = <T extends { cost?: number | null }>(rows: T[]) => rows.map(({ cost: _c, ...rest }) => { void _c; return rest; });

/**
 * Everything under /admin needs a staff account (role "admin") AND the permission shown on each route.
 * Owners hold every permission; other roles hold what the owner gave them (Admin → Staff & roles).
 */
@Roles("admin") @Controller("admin")
export class AdminController {
  constructor(private orders: OrdersService, private catalog: CatalogService, private admin: AdminService, private posts: PostsService, private roles: RolesService) {}

  private async finance(user: User) { return (await this.roles.permissionsFor(user)).includes("finance.view"); }

  /* ---------------------------------------------------------- dashboard */
  @Permissions("orders.view") @Get("stats")
  async stats(@CurrentUser() me: User) {
    const p = await this.roles.permissionsFor(me);
    return this.admin.stats({ finance: p.includes("finance.view"), customers: p.includes("customers.view") });
  }

  @Permissions("customers.view") @Get("customers") customers(@Query() q: CustomersQuery) { return this.admin.customers(q); }

  /* ------------------------------------------------------------- orders */
  @Permissions("orders.view") @Get("orders")
  async listOrders(@CurrentUser() me: User, @Query() q: AdminOrdersQuery) { return this.orders.adminList(q, await this.finance(me)); }

  @Permissions("orders.manage") @Patch("orders/:id/status")
  setStatus(@Param("id") id: string, @Body() dto: UpdateStatusDto) { return this.orders.adminSetStatus(id, dto.status); }

  /* ----------------------------------------------------------- catalogue */
  /** `?slim=1` leaves the (potentially long) product list out — use GET /admin/products for that. */
  @AnyPermission("products.manage", "content.manage") @Get("catalog")
  async catalogAll(@CurrentUser() me: User, @Query("slim") slim?: string) {
    const c = await this.catalog.adminCatalog();
    const fin = await this.finance(me);
    return { ...c, devices: slim === "1" ? [] : fin ? c.devices : hideCost(c.devices), plans: fin ? c.plans : hideCost(c.plans) };
  }

  @Permissions("products.manage") @Get("products")
  async products(@CurrentUser() me: User, @Query() q: AdminProductsQuery) {
    const r = await this.catalog.adminProducts(q);
    return (await this.finance(me)) ? r : { ...r, items: hideCost(r.items) };
  }

  @Permissions("products.manage") @Put("catalog/categories/:id") putCategory(@Param("id", SlugPipe) id: string, @Body() dto: CategoryDto) { return this.catalog.upsertCategory(id, dto); }
  @Permissions("products.manage") @HttpCode(204) @Delete("catalog/categories/:id") delCategory(@Param("id", SlugPipe) id: string) { return this.catalog.removeCategory(id); }

  @Permissions("products.manage") @Put("catalog/plans/:id")
  async putPlan(@CurrentUser() me: User, @Param("id", SlugPipe) id: string, @Body() dto: PlanDto) { return this.catalog.upsertPlan(id, dto, !(await this.finance(me))); }
  @Permissions("products.manage") @HttpCode(204) @Delete("catalog/plans/:id") delPlan(@Param("id", SlugPipe) id: string) { return this.catalog.remove("plans", id); }

  @Permissions("products.manage") @Put("catalog/devices/:id")
  async putDevice(@CurrentUser() me: User, @Param("id", SlugPipe) id: string, @Body() dto: DeviceDto) { return this.catalog.upsertDevice(id, dto, !(await this.finance(me))); }
  @Permissions("products.manage") @HttpCode(204) @Delete("catalog/devices/:id") delDevice(@Param("id", SlugPipe) id: string) { return this.catalog.remove("devices", id); }

  @Permissions("content.manage") @Put("catalog/faqs/:id") putFaq(@Param("id", SlugPipe) id: string, @Body() dto: FaqDto) { return this.catalog.upsertFaq(id, dto); }
  @Permissions("content.manage") @HttpCode(204) @Delete("catalog/faqs/:id") delFaq(@Param("id", SlugPipe) id: string) { return this.catalog.remove("faqs", id); }

  @Permissions("content.manage") @Put("catalog/hero/:id") putSlide(@Param("id", SlugPipe) id: string, @Body() dto: HeroSlideDto) { return this.catalog.upsertSlide(id, dto); }
  @Permissions("content.manage") @HttpCode(204) @Delete("catalog/hero/:id") delSlide(@Param("id", SlugPipe) id: string) { return this.catalog.remove("slides", id); }

  /* --------------------------------------------------------------- news */
  @Permissions("content.manage") @Get("posts") listPosts(@Query() q: AdminPostsQuery) { return this.posts.adminList(q); }
  @Permissions("content.manage") @Get("posts/:id") getPost(@Param("id", SlugPipe) id: string) { return this.posts.adminGet(id); }
  @Permissions("content.manage") @Put("posts/:id") putPost(@Param("id", SlugPipe) id: string, @Body() dto: PostDto) { return this.posts.upsert(id, dto); }
  @Permissions("content.manage") @HttpCode(204) @Delete("posts/:id") delPost(@Param("id", SlugPipe) id: string) { return this.posts.remove(id); }
}
