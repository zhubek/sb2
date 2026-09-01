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
// values — ответы по шкале Ликерта (1–5) в порядке вопросов теста.
// Fire-and-forget: сбой API не должен ломать сценарий прохождения.

export async function recordTestAttempt(
  slug: string,
  values: number[],
  result: Record<string, unknown>
) {
  try {
    const uid = await backendUserId();
    if (!uid) return;
    const tests = await api<ApiTest[]>("/tests");
    const meta = tests.find((t) => t.slug === slug);
    if (!meta) return;
    const test = await api<{
      questions: { id: number; answers: { id: number }[] }[];
    }>(`/tests/${meta.id}`);
    const attempt = await api<{ id: number }>(`/tests/${meta.id}/attempts`, {
      method: "POST",
      body: JSON.stringify({ userId: uid }),
    });
    for (let i = 0; i < test.questions.length; i++) {
      const value = values[i];
      const question = test.questions[i];
      const answer = question?.answers[value - 1];
      if (!answer) continue;
      await api(`/attempts/${attempt.id}/answers`, {
        method: "POST",
        body: JSON.stringify({
          questionId: question.id,
          answerIds: [answer.id],
        }),
      });
    }
    await api(`/attempts/${attempt.id}`, {
      method: "PATCH",
      body: JSON.stringify({ state: "FINISHED", result }),
    });
  } catch (e) {
    console.warn("recordTestAttempt:", e);
  }
}
