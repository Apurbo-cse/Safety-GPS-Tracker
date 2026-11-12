import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "node:path";
import { AdminController } from "./admin/admin.controller";
import { AdminService } from "./admin/admin.service";
import { AuthController } from "./auth/auth.controller";
import { AuthGuard } from "./auth/auth.guard";
import { AuthService } from "./auth/auth.service";
import { CatalogController } from "./catalog/catalog.controller";
import { Category, Device, Faq, HeroSlide, Plan } from "./catalog/catalog.entities";
import { CatalogService } from "./catalog/catalog.service";
import { validateEnv, type Env } from "./config/env";
import { HealthController } from "./health/health.controller";
import { MediaController } from "./media/media.controller";
import { Post } from "./posts/post.entity";
import { PostsController } from "./posts/posts.controller";
import { PostsService } from "./posts/posts.service";
import { StaffRole } from "./staff/role.entity";
import { StaffController } from "./staff/staff.controller";
import { StaffService } from "./staff/staff.service";
import { RolesService } from "./staff/roles.service";
import { MediaFile } from "./media/media.entity";
import { MediaService } from "./media/media.service";
import { ProductsController } from "./catalog/products.controller";
import { Order, OrderItem } from "./orders/order.entities";
import { OrdersController } from "./orders/orders.controller";
import { OrdersService } from "./orders/orders.service";
import { User } from "./users/user.entity";
import { MeController } from "./users/me.controller";
import { UsersService } from "./users/users.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService<Env, true>) => ({
        type: "postgres" as const,
        url: c.get("DATABASE_URL", { infer: true }),
        installExtensions: false,
        ssl: c.get("DB_SSL", { infer: true }) ? true : false,
        autoLoadEntities: true,
        synchronize: false, // schema changes go through migrations only
        migrationsRun: true,
        migrations: [join(__dirname, "database", "migrations", "*.{js,ts}")],
      }),
    }),
    TypeOrmModule.forFeature([User, Plan, Device, Faq, Category, HeroSlide, MediaFile, Post, StaffRole, Order, OrderItem]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (c: ConfigService<Env, true>) => ({
        secret: c.get("JWT_SECRET", { infer: true }),
        signOptions: { expiresIn: c.get("JWT_EXPIRES_IN", { infer: true }) as never, algorithm: "HS256" },
        verifyOptions: { algorithms: ["HS256"] },
      }),
    }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 120 }] }),
  ],
  controllers: [StaffController, PostsController, AuthController, MeController, CatalogController, ProductsController, MediaController, OrdersController, AdminController, HealthController],
  providers: [
    UsersService, AuthService, CatalogService, OrdersService, AdminService, MediaService, RolesService, StaffService, PostsService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
