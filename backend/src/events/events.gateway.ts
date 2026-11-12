import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import type { JwtPayload } from "../auth/auth.guard";
import type { Permission } from "../common/permissions";
import { RolesService } from "../staff/roles.service";
import { UsersService } from "../users/users.service";

/** Origins allowed to open a socket: same list as the REST API's CORS (read when a client connects, after .env is loaded). */
const allowedOrigins = () => String(process.env.FRONTEND_ORIGINS ?? "http://localhost:3000").split(",").map((s) => s.trim()).filter(Boolean);

/**
 * Live updates over Socket.IO. A client connects with its log-in token (`auth: { token }`):
 *   - everyone joins `user:<id>`  → their own order status changes
 *   - staff also join `perm:<permission>` for each permission they hold → new orders, contact messages…
 * Events carry only a small summary; the website refetches details through the normal (permission-checked) API.
 */
@Injectable()
@WebSocketGateway({ cors: { origin: (o: string | undefined, cb: (e: Error | null, ok?: boolean) => void) => cb(null, !o || allowedOrigins().includes(o)) } })
export class EventsGateway implements OnGatewayConnection {
  private log = new Logger("Events");
  @WebSocketServer() server: Server;

  constructor(private jwt: JwtService, private users: UsersService, private roles: RolesService) {}

  async handleConnection(client: Socket) {
    try {
      const token = typeof client.handshake.auth?.token === "string" ? client.handshake.auth.token : "";
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      const user = await this.users.findById(payload.sub);
      if (!user || user.disabled) throw new Error("no such active user");
      const perms = await this.roles.permissionsFor(user);
      await client.join([`user:${user.id}`, ...perms.map((p) => `perm:${p}`)]);
      client.data.userId = user.id;
      client.data.staff = perms.length > 0;
    } catch {
      client.disconnect(true); // not logged in (or token expired): no live updates
    }
  }

  /** Tell one person (all their open tabs). */
  toUser(userId: string, event: string, payload: unknown) { this.server?.to(`user:${userId}`).emit(event, payload); }

  /** Tell every staff member who holds `permission`. */
  toPermission(permission: Permission, event: string, payload: unknown) { this.server?.to(`perm:${permission}`).emit(event, payload); }

  /** Drop staff connections so they reconnect and pick up changed roles or a blocked account straight away. */
  async refreshStaff(userId?: string) {
    if (!this.server) return;
    for (const s of await this.server.fetchSockets()) {
      if (userId ? s.data.userId === userId : s.data.staff) s.disconnect(true);
    }
    this.log.debug(`staff connections refreshed${userId ? ` for ${userId}` : ""}`);
  }
}
