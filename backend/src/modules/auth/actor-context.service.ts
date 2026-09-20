import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHash } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { jwtVerify, errors } from "jose";
import { PrismaService } from "../../platform/database/prisma.service";
export type Actor = {
  id: string; contentAdmin: boolean; userId?: number; role?: string;
  organizationId?: number | null; ownerKey?: string; provisionEmail?: string;
};
export type RequestContext = { actor: Actor | null; requestId: string };
export const requestContext = new AsyncLocalStorage<RequestContext>();
@Injectable()
export class ActorContextService {
  constructor(private readonly prisma: PrismaService) {}
  async resolve(headers: Record<string, unknown>): Promise<Actor | null> {
    const secret = process.env.CMS_AUTH_SECRET;
    if (!secret) throw new Error("CMS_AUTH_SECRET is required");
    const key = new TextEncoder().encode(secret);
    let actor: Actor | null = null;
    const adminToken = String(headers.cookie || "").split(";").map(p => p.trim())
      .find(p => p.startsWith("sb-admin="))?.slice(9);
    if (adminToken) {
      try {
        const { payload } = await jwtVerify(adminToken, key, {
          issuer: "sb2-web", audience: "sb2-admin", algorithms: ["HS256"], maxTokenAge: "8h", requiredClaims: ["exp", "iat", "sub"],
        });
        if (payload.sub === "primary") {
          const admin = await this.prisma.contentAdministrator.findUnique({ where: { id: "primary" } });
          if (admin?.enabled) actor = { id: "admin:primary", contentAdmin: true };
        }
      } catch (error) { if (!(error instanceof errors.JOSEError)) throw error; }
    }
    const authorization = String(headers.authorization || "");
    if (!authorization) return actor;
    if (!authorization.startsWith("Bearer ")) throw new UnauthorizedException("Недействительная сессия");
    let claims;
    try {
      claims = (await jwtVerify(authorization.slice(7), key, {
        issuer: "sb2-web", audience: "sb2-api", algorithms: ["HS256"], maxTokenAge: "120s", requiredClaims: ["exp", "iat"],
      })).payload;
      if (claims.exp! - claims.iat! > 120) throw new Error("Invalid lifetime");
    } catch { throw new UnauthorizedException("Недействительная или истекшая сессия"); }
    if (claims.scope === "identity:provision" && typeof claims.email === "string")
      return { id: "identity-provider", contentAdmin: false, provisionEmail: claims.email };
    const user = Number.isSafeInteger(claims.userId)
      ? await this.prisma.user.findUnique({ where: { id: claims.userId as number }, include: { credential: true } }) : null;
    if (!user || typeof claims.subject !== "string" || claims.subject !== user.email)
      throw new UnauthorizedException("Пользователь не найден");
    if (user.role !== "STUDENT" && !user.credential)
      throw new UnauthorizedException("Для этой учётной записи требуется вход по паролю");
    if (user.credential && (!user.credential.enabled || claims.credentialVersion !== user.credential.version))
      throw new UnauthorizedException("Войдите в аккаунт повторно");
    return { id: actor?.id ?? `user:${user.id}`, contentAdmin: !!actor?.contentAdmin || !!user.credential?.contentAdmin || user.role === "ADMIN",
      userId: user.id, role: user.role, organizationId: user.organizationId,
      ownerKey: createHash("sha256").update(user.email).digest("hex") };
  }
  current() { return requestContext.getStore()?.actor ?? null; }
}
