import "server-only";
import { SignJWT } from "jose/jwt/sign";
// Created only on the Next.js server. Browser code never receives this bearer token.
export async function backendToken(claims: Record<string, unknown>) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters");
  return "Bearer " + await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer("sb2-web").setAudience("sb2-api")
    .setIssuedAt().setExpirationTime("60s")
    .sign(new TextEncoder().encode(secret));
}
