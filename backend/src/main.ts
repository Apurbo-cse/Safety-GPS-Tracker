import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import compression from "compression";
import helmet from "helmet";
import { join } from "node:path";
import { storageDir } from "./common/storage";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import type { Env } from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  if (config.get("TRUST_PROXY", { infer: true })) app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); // pictures are embedded by the website on another origin
  app.use(compression()); // JSON compresses ~5x; the catalogue is fetched on every page build and refresh
  app.setGlobalPrefix("api/v1");
  // site pictures: files in <STORAGE_DIR>/img  ->  /api/v1/assets/img/...
  app.useStaticAssets(join(storageDir(), "img"), { prefix: "/api/v1/assets/img", index: false, fallthrough: false, setHeaders: (res) => { res.setHeader("Cache-Control", "public, no-cache"); res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); } });

  const origins = config.get("FRONTEND_ORIGINS", { infer: true });
  app.enableCors({
    origin: (origin, cb) => cb(null, !origin || origins.includes(origin)), // no Origin header = curl/server-to-server
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  });

  // Unknown fields are rejected, types are coerced, and every DTO rule is enforced.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableShutdownHooks();

  const port = config.get("PORT", { infer: true });
  await app.listen(port);
  Logger.log(`API listening on :${port} (CORS: ${origins.join(", ")})`, "Bootstrap");
}
void bootstrap();
