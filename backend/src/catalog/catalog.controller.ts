import { Controller, Get, Header, Req } from "@nestjs/common";
import type { Request } from "express";
import { baseUrl } from "../common/base-url";
import { Public } from "../common/decorators";
import { CatalogService } from "./catalog.service";

@Controller("catalog")
export class CatalogController {
  constructor(private catalog: CatalogService) {}

  /** Products, plans and FAQs for the website. Cacheable for a minute (CDN) — edits show up shortly after saving. */
  @Public() @Get() @Header("Cache-Control", "public, max-age=30, s-maxage=60, stale-while-revalidate=300")
  get(@Req() req: Request) { return this.catalog.publicCatalog(baseUrl(req)); }
}
