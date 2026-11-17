import { Controller, Delete, Get, Headers, HttpCode, Param, ParseUUIDPipe, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { memoryStorage } from "multer";
import { AnyPermission, Public, Roles } from "../common/decorators";
import { MAX_IMAGE_BYTES, MediaService } from "./media.service";

@Controller()
export class MediaController {
  constructor(private media: MediaService) {}

  /** Admin upload: one picture per request, JPEG/PNG/WebP up to 3 MB. Returns the token to store on a product. */
  @Roles("admin") @AnyPermission("products.manage", "content.manage") @Post("admin/media")
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage(), limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 0 } }))
  async upload(@UploadedFile() file?: Express.Multer.File) {
    const r = await this.media.save(file?.buffer as Buffer);
    return { ...r, token: `media:${r.id}` };
  }

  /** Throw away a picture that was uploaded but never attached to a product. A picture a product still uses is left alone. */
  @Roles("admin") @AnyPermission("products.manage", "content.manage") @HttpCode(204) @Delete("admin/media/:id")
  async discard(@Param("id", ParseUUIDPipe) id: string) { await this.media.deleteOrphans([`media:${id}`]); }

  /** Public. The ETag is the picture's hash, so browsers keep their copy until the file really changes. */
  @Public() @Get("media/:id")
  async get(@Param("id", ParseUUIDPipe) id: string, @Headers("if-none-match") inm: string | undefined, @Res() res: Response) {
    const f = await this.media.meta(id);
    const etag = `"${f.sha256}"`;
    res.set({
      "Content-Type": f.mime,
      "Cache-Control": "public, no-cache", // always checked with the ETag (a cheap 304), so an edited file shows up at once
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      // the website lives on another origin and must be allowed to embed these pictures
      "Cross-Origin-Resource-Policy": "cross-origin",
    });
    if (inm === etag) { res.status(304).end(); return; }
    res.send(await f.bytes());
  }
}
