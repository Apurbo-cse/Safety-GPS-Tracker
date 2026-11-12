import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Public } from "../common/decorators";

@Controller("health")
export class HealthController {
  constructor(@InjectDataSource() private db: DataSource) {}

  @Public() @Get()
  async check() {
    try { await this.db.query("SELECT 1"); } catch { throw new ServiceUnavailableException({ status: "error", db: "down" }); }
    return { status: "ok", db: "up", time: new Date().toISOString() };
  }
}
