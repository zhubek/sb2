import { auth } from "@/lib/auth";
import { sameOrigin } from "@/lib/cms/auth";
import { graphql, backendErrorResponse } from "@/lib/graphql/server";
import { attemptOperations } from "@/features/tests/graphql/operations";
export const dynamic = "force-dynamic";
export async function GET() {
  const session = await auth();
  if (!session?.user.id)
    return Response.json({ error: "Войдите в аккаунт" }, { status: 401 });
  try {
    return Response.json(
      (
        await graphql<{ contentTestAttempts: unknown }>(
          attemptOperations.list,
          {},
          session.user,
        )
      ).contentTestAttempts,
    );
  } catch (error) {
    return backendErrorResponse(error);
  }
}
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user.id)
    return Response.json({ error: "Войдите в аккаунт" }, { status: 401 });
  if (!sameOrigin(request))
    return Response.json({ error: "Нет доступа" }, { status: 403 });
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 500000)
    return Response.json({ error: "Слишком большой запрос" }, { status: 413 });
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Некорректные ответы" }, { status: 400 });
  }
  try {
    return Response.json(
      (
        await graphql<{ saveContentTestAttempt: unknown }>(
          attemptOperations.save,
          { input },
          session.user,
        )
      ).saveContentTestAttempt,
      { status: 201 },
    );
  } catch (error) {
    return backendErrorResponse(error);
  }
}
