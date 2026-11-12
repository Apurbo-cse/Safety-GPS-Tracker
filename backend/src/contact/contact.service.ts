import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { normalizePhone } from "../common/phone";
import { EventsGateway } from "../events/events.gateway";
import { ContactMessage } from "./contact.entity";
import type { ContactDto, MessagesQuery } from "./contact.dto";

@Injectable()
export class ContactService {
  constructor(@InjectRepository(ContactMessage) private repo: Repository<ContactMessage>, private events: EventsGateway) {}

  /** Save a message from the website and tell the staff who handle messages, live. */
  async create(dto: ContactDto) {
    const saved = await this.repo.save(this.repo.create({
      kind: dto.kind, department: dto.department ?? "sales", name: dto.name, email: dto.email ?? "", phone: normalizePhone(dto.phone)!,
      fleet: dto.fleet ?? "", subject: dto.subject ?? (dto.kind === "lead" ? "Call-back request" : ""), message: dto.message,
    }));
    this.events.toPermission("messages.manage", "message:created", { id: saved.id, kind: saved.kind, name: saved.name, subject: saved.subject, department: saved.department, createdAt: saved.createdAt });
    return { ok: true };
  }

  async list(q: MessagesQuery) {
    const page = q.page ?? 1, limit = q.limit ?? 20;
    const [items, total] = await this.repo.findAndCount({ where: q.status && q.status !== "all" ? { status: q.status } : {}, order: { createdAt: "DESC" }, skip: (page - 1) * limit, take: limit });
    const counts = await this.repo.createQueryBuilder("m").select("m.status", "status").addSelect("COUNT(*)::int", "n").groupBy("m.status").getRawMany<{ status: string; n: number }>();
    return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)), counts: Object.fromEntries(counts.map((c) => [c.status, c.n])) };
  }

  async unread() { return { new: await this.repo.count({ where: { status: "new" } }) }; }

  async setStatus(id: string, status: "new" | "handled") {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException("Message not found");
    m.status = status; m.handledAt = status === "handled" ? new Date() : null;
    const saved = await this.repo.save(m);
    this.events.toPermission("messages.manage", "message:updated", { id: saved.id, status: saved.status });
    return saved;
  }

  async remove(id: string) {
    const res = await this.repo.delete({ id });
    if (!res.affected) throw new NotFoundException("Message not found");
    this.events.toPermission("messages.manage", "message:updated", { id, status: "deleted" });
  }
}
