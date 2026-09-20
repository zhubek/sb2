import { sameOrigin } from "@/lib/cms/auth";
import { graphql, backendErrorResponse } from "@/lib/graphql/server";
import { contentOperations } from "@/features/content/graphql/operations";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return new Response(
      JSON.stringify(
        (await graphql<{ contentBackup: unknown }>(contentOperations.backup))
          .contentBackup,
        null,
        2,
      ),
      {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition":
            'attachment; filename="smart-bolashaq-content-' +
            new Date().toISOString().slice(0, 10) +
            '.json"',
        },
      },
    );
  } catch (error) {
    return backendErrorResponse(error);
  }
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Нет доступа" }, { status: 403 });
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 25000000)
    return Response.json({ error: "Файл больше 25 МБ" }, { status: 413 });
  let backup;
  try {
    backup = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Некорректный JSON-файл" }, { status: 400 });
  }
  try {
    return Response.json(
      (
        await graphql<{ importContentBackup: unknown }>(
          contentOperations.import,
          { backup },
        )
      ).importContentBackup,
    );
  } catch (error) {
    return backendErrorResponse(error);
  }
}
