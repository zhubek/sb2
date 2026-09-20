import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { sameOrigin } from "@/lib/cms/auth";
import { backendToken } from "@/lib/backend-identity";
export const dynamic = "force-dynamic";
async function proxy(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (!["GET", "HEAD"].includes(request.method) && !sameOrigin(request))
    return Response.json({ error: "Нет доступа" }, { status: 403 });
  const path = (await params).path;
  if (
    path.some(
      (p) => p === "." || p === ".." || p.includes("/") || p.includes("\\"),
    )
  )
    return new Response(null, { status: 400 });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
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
  try {
    const response = await fetch(
      (process.env.API_URL ?? "http://127.0.0.1:3002/api") +
        "/" +
        path.map(encodeURIComponent).join("/") +
        new URL(request.url).search,
      {
        method: request.method,
        headers,
        body: ["GET", "HEAD"].includes(request.method)
          ? undefined
          : await request.text(),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store",
        "X-Request-Id": response.headers.get("X-Request-Id") ?? "",
      },
    });
  } catch {
    return Response.json({ error: "Сервер недоступен" }, { status: 503 });
  }
}
export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
};
