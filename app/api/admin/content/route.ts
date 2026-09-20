import { graphql, backendErrorResponse } from "@/lib/graphql/server";
import { contentOperations } from "@/features/content/graphql/operations";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const filter = {
    ...Object.fromEntries(
      ["q", "group", "category", "pageCategory", "institutionId", "filter"].map((key) => [
        key,
        params.get(key) || undefined,
      ]),
    ),
    page: Number(params.get("page")) || 1,
  };
  try {
    return Response.json(
      (
        await graphql<{ contentLibrary: unknown }>(contentOperations.library, {
          filter,
        })
      ).contentLibrary,
    );
  } catch (error) {
    return backendErrorResponse(error);
  }
}
export async function POST() {
  return Response.json(
    {
      error:
        "На платформе предусмотрены только DeBruce, MBTI и Голланд. Добавление тестов отключено.",
    },
    { status: 405, headers: { Allow: "GET" } },
  );
}
