import "server-only";
export * from "./api";
import { auth } from "./auth";
import { cookies } from "next/headers";
import { backendToken } from "./backend-identity";
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...Object.fromEntries(new Headers(init?.headers)),
  };
  const admin = (await cookies()).get("sb-admin");
  if (admin) headers.cookie = "sb-admin=" + admin.value;
  const session = await auth();
  if (session?.user.backendId)
    headers.authorization = await backendToken({
      subject: session.user.id,
      userId: session.user.backendId,
      credentialVersion: session.user.credentialVersion,
    });
  const response = await fetch(
    (process.env.API_URL ?? "http://127.0.0.1:3002/api") + path,
    {
      ...init,
      headers,
      cache: "no-store",
      signal: init?.signal ?? AbortSignal.timeout(5000),
    },
  );
  if (!response.ok) throw new Error("API " + response.status);
  return response.json();
}
export async function apiSafe<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    return await api<T>(path, init);
  } catch {
    return null;
  }
}
