import { Controller, Get, Header, Param, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { baseUrl } from "../common/base-url";
import { Public } from "../common/decorators";
import { SlugPipe } from "../common/slug.pipe";
import { ProductsQuery } from "./catalog.dto";
import { CatalogService } from "./catalog.service";

const CACHE = "public, max-age=0, s-maxage=30, stale-while-revalidate=30";

@Controller("products")
export class ProductsController {
  constructor(private catalog: CatalogService) {}

  /**
   * Paged shop listing: filters, sort and paging all happen in the database.
   * Browsers re-check every time (a 304 is cheap); a CDN may keep a copy for 30 seconds.
   */
  @Public() @Get() @Header("Cache-Control", CACHE)
  list(@Query() q: ProductsQuery, @Req() req: Request) { return this.catalog.listProducts(q, baseUrl(req)); }

  /** One product with its long description. */
  @Public() @Get(":id") @Header("Cache-Control", CACHE)
  one(@Param("id", SlugPipe) id: string, @Req() req: Request) { return this.catalog.publicProduct(id, baseUrl(req)); }
}
