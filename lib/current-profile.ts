"use client";
import { api, backendUserId } from "./api";
export type CurrentProfile = { id: number; name: string; surname: string; email: string; grade: string | null; language: string; phone?: string | null; jobTitle?: string | null; organization?: { name: string; city?: {name:string;region?:{name:string}} | null } | null };
export async function currentProfile(): Promise<CurrentProfile> {
  const id = await backendUserId();
  if (!id) throw new Error("Войдите в аккаунт");
  return api<CurrentProfile>(`/users/${id}`);
}
