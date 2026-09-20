import { contentUsage } from "@/lib/cms/usage";
import type { ContentDocument } from "@/lib/cms/types";
import { documentId } from "@/lib/cms/document-id";
import { sameOrigin } from "@/lib/cms/auth";
import { graphql, backendErrorResponse } from "@/lib/graphql/server";
import { contentOperations } from "@/features/content/graphql/operations";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const doc=(await graphql<{contentDocument:ContentDocument}>(contentOperations.document,{id:documentId((await params).id),locale:new URL(request.url).searchParams.get('locale')??'ru'})).contentDocument;
    return Response.json({...doc,usage:contentUsage(doc)});
  } catch (error) {
    return backendErrorResponse(error);
  }
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request))
    return Response.json({ error: "Нет доступа" }, { status: 403 });
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 3000000)
    return Response.json({ error: "Материал больше 3 МБ" }, { status: 413 });
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  try {
    return Response.json({
      entry: (
        await graphql<{ editContent: unknown }>(contentOperations.edit, {
          input: { ...body, id: documentId((await params).id) },
        })
      ).editContent,
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
