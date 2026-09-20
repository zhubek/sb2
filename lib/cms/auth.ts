import { SignJWT } from "jose";
import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

const cookieName = "sb-admin";
function secret() { return process.env.AUTH_SECRET || (process.env.NODE_ENV === "development" ? "sb-local-development-only" : ""); }
function sign(value: string) { return createHmac("sha256",secret()).update(value).digest("hex"); }
export function equal(a: string,b: string) { return timingSafeEqual(createHash("sha256").update(a).digest(),createHash("sha256").update(b).digest()); }
export async function isLocalAdminMode() {
  const host=(await headers()).get('host') || '';
  return process.env.NODE_ENV === "development" && !process.env.ADMIN_PASSWORD && /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
}
export async function isAdmin() {
  if (!secret()) return false;
  try {
    // The backend rechecks the account and content grant, including revocation.
    const { graphql } = await import("../graphql/server");
    const result = await graphql<{ contentLibrary: unknown }>("{ contentLibrary(filter: {pageSize: 1}) }");
    return !!result.contentLibrary;
  } catch { return false; }
}
export async function createAdminSession() {
  if (!secret()) throw new Error("Настройте AUTH_SECRET на сервере");
  const value = await new SignJWT({}).setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer("sb2-web").setAudience("sb2-admin").setSubject("primary")
    .setIssuedAt().setExpirationTime("8h").sign(new TextEncoder().encode(secret()));
  (await cookies()).set(cookieName, value, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 8*60*60 });
}
export async function endAdminSession() { (await cookies()).delete(cookieName); }
export function sameOrigin(request: Request) {
  const origin=request.headers.get('origin');
  return !!origin && new URL(origin).host === request.headers.get('host') && /^https?:$/.test(new URL(origin).protocol);
}
