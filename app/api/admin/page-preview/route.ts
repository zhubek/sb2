import { sameOrigin, isAdmin } from '@/lib/cms/auth';
import { graphql, backendErrorResponse } from '@/lib/graphql/server';
import { contentOperations } from '@/features/content/graphql/operations';
import { createPagePreview } from '@/lib/cms/page-preview';
import { contentUsage } from '@/lib/cms/usage';
import type { ContentDocument } from '@/lib/cms/types';
import { isLocale } from '@/backend/src/modules/content/domain/localization';
import { validateDocument } from '@/backend/src/modules/content/domain/validation';
export async function POST(request:Request) {
  if (!sameOrigin(request) || !await isAdmin()) return Response.json({error:'Нет доступа'},{status:403});
  const raw=await request.text();
  if (Buffer.byteLength(raw)>3_000_000) return Response.json({error:'Материал больше 3 МБ'},{status:413});
  let input;
  try { input=JSON.parse(raw); } catch { return Response.json({error:'Некорректный JSON'},{status:400}); }
  if (!input || typeof input!=='object' || Array.isArray(input) || typeof input.id!=='string' || typeof input.route!=='string') return Response.json({error:'Укажите материал и страницу'},{status:400});
  if (!isLocale(input.locale)) return Response.json({error:'Неизвестный язык'},{status:400});
  try {
    const doc=(await graphql<{contentDocument:ContentDocument}>(contentOperations.document,{id:input.id,locale:input.locale})).contentDocument;
    const usage=contentUsage(doc);
    const route=usage.locations.find(l=>l.path===input.route)?.path;
    if (!route) return Response.json({error:'Этот экран не связан с материалом'},{status:422});
    const errors=validateDocument(doc,input.value);
    if (errors.length) return Response.json({error:errors.join('\n')},{status:422});
    const token=await createPagePreview({id:doc.id,value:input.value,locale:input.locale,route,focus:usage.focus});
    return Response.json({url:`/_cms-preview/${token}${route==='/'?'':route}`},{headers:{'Cache-Control':'no-store'}});
  } catch(error) { return backendErrorResponse(error); }
}
