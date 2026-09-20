import { randomId } from "@/lib/random-id";
import type { TestAnswer } from "@/lib/cms/types";
// Клиент REST API бекенда (NestJS, backend/, порт 3002).
// Все интеграции построены на apiSafe: при недоступном API страницы
// откатываются на мок-данные и демо продолжает работать.

export const API_URL =
  (typeof window === "undefined"
    ? process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL) ?? "http://localhost:3002/api";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(5000),
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export async function apiSafe<T>(
  path: string,
  init?: RequestInit
): Promise<T | null> {
  try {
    return await api<T>(path, init);
  } catch {
    return null;
  }
}

// ── Типы ответов (минимально необходимые поля) ──────────────────────────────

export interface ApiTest {
  id: number;
  slug: string;
  name: string;
  duration: number;
  _count?: { questions: number };
}

export interface ApiAttempt {
  id: number;
  testId: number;
  started: string;
  finished: string | null;
  state: "STARTED" | "FINISHED";
  result: { summary?: string } | null;
  test?: { slug: string; name: string };
}

export interface ApiUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  organizationId: number | null;
}

export interface ApiDiploma {
  id: number;
  name: string;
  uploaded: string;
  type: "DIPLOMA" | "CERTIFICATE";
  fileUrl: string | null;
}

export interface ApiAchievement {
  id: number;
  name: string;
  order: number;
  isSuccess: boolean;
}

export interface ApiOrgLog {
  id: number;
  dateTime: string;
  text: string | null;
  orgLogType: { name: string; point: number; group: string };
}

export interface ApiOrgPoints {
  total: number;
  byGroup: Record<string, number>;
  entries: number;
}

// ── Сессия: id пользователя в БД бекенда ────────────────────────────────────

let cachedUid: number | null | undefined;

// Только для клиентских компонентов; на сервере брать из auth()
export async function backendUserId(): Promise<number | null> {
  if (cachedUid !== undefined) return cachedUid;
  try {
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    cachedUid = session?.user?.backendId ?? null;
  } catch {
    cachedUid = null;
  }
  return cachedUid ?? null;
}

// ── Запись прохождения теста ────────────────────────────────────────────────
// values — typed answers in question order (scale, option IDs, or free text).
// Снимок CMS сохраняется атомарно; при ошибке экран сохраняет ответы и предлагает повторить.
const pendingAttempts = new Map<string, { payload: string; requestKey: string }>();

export async function recordTestAttempt(
  slug: string,
  values: TestAnswer[],
  _result: Record<string, unknown>,
  snapshot: import("./cms/types").TestContent
) {
  const payload = JSON.stringify({ slug, values, snapshot });
  let pending = pendingAttempts.get(slug);
  if (!pending || pending.payload !== payload) {
    pending = { payload, requestKey: randomId() };
    pendingAttempts.set(slug, pending);
  }
  const res = await fetch("/api/test-attempts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, values, snapshot, requestKey: pending.requestKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Не удалось сохранить ответы. Повторите попытку.");
  if (pendingAttempts.get(slug) === pending) pendingAttempts.delete(slug);
  return data;
}
