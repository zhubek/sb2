import { publishedValues } from "@/lib/cms/store";
export const dynamic="force-dynamic";
export async function GET(request: Request) { return Response.json(await publishedValues(new URL(request.url).searchParams.get("locale") ?? undefined),{headers:{"Cache-Control":"no-store"}}); }
