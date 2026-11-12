import { Controller, Get, Header, Param, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { baseUrl } from "../common/base-url";
import { Public } from "../common/decorators";
import { SlugPipe } from "../common/slug.pipe";
import { PostsQuery } from "./posts.dto";
import { PostsService } from "./posts.service";

const CACHE = "public, max-age=0, s-maxage=30, stale-while-revalidate=30";

@Controller("posts")
export class PostsController {
  constructor(private posts: PostsService) {}

  @Public() @Get() @Header("Cache-Control", CACHE)
  list(@Query() q: PostsQuery, @Req() req: Request) { return this.posts.listPublic(q, baseUrl(req)); }

  @Public() @Get(":id") @Header("Cache-Control", CACHE)
  one(@Param("id", SlugPipe) id: string, @Req() req: Request) { return this.posts.getPublic(id, baseUrl(req)); }
}
