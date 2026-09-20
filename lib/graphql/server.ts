import "server-only";
import { cookies } from "next/headers";
import { auth } from "../auth";
import { backendToken } from "../backend-identity";
export class BackendError extends Error {
  constructor(
    message: string,
    public status: number,
    public requestId?: string,
  ) {
    super(message);
  }
}
export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
  identity?: { id: string; backendId?: number; credentialVersion?: number },
  anonymous = false,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (!anonymous) {
    identity ??= (await auth())?.user;
    const admin = (await cookies()).get("sb-admin");
    if (admin) headers.cookie = "sb-admin=" + admin.value;
  }
  if (identity)
    headers.authorization = await backendToken({
      subject: identity.id,
      userId: identity.backendId,
      credentialVersion: identity.credentialVersion,
    });
  let response: Response;
  try {
    response = await fetch(
      (process.env.API_URL ?? "http://127.0.0.1:3002/api") + "/graphql",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
        signal: AbortSignal.timeout(65000),
      },
    );
  } catch {
    throw new BackendError("Сервер контента недоступен. Повторите позже.", 503);
  }
  const body = await response.json();
  if (body.errors?.length) {
    const error = body.errors[0];
    throw new BackendError(
      error.message,
      error.extensions?.status ??
        (error.extensions?.code === "UNAUTHENTICATED" ? 401 : 500),
      error.extensions?.requestId,
    );
  }
  if (!response.ok || !body.data)
    throw new BackendError(
      body.error ?? "Не удалось загрузить контент",
      response.status || 502,
      body.requestId,
    );
  return body.data as T;
}
export function backendErrorResponse(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof BackendError
          ? error.message
          : "Не удалось выполнить запрос",
      requestId: error instanceof BackendError ? error.requestId : undefined,
    },
    { status: error instanceof BackendError ? error.status : 500 },
  );
}
