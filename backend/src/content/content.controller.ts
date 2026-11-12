import { Controller, Get, Header, Param, Req } from "@nestjs/common";
import type { Request } from "express";
import { baseUrl } from "../common/base-url";
import { Public } from "../common/decorators";
import { SlugPipe } from "../common/slug.pipe";
import { ContentService } from "./content.service";

const CACHE = "public, max-age=0, s-maxage=30, stale-while-revalidate=30";

@Controller()
export class ContentController {
  constructor(private content: ContentService) {}

  @Public() @Get("site") @Header("Cache-Control", CACHE)
  site() { return this.content.publicSite(); }

  @Public() @Get("pages/:id") @Header("Cache-Control", CACHE)
  page(@Param("id", SlugPipe) id: string, @Req() req: Request) { return this.content.getPublicPage(id, baseUrl(req)); }
}
