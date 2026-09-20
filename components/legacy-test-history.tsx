import { withPublishedContent } from "@/lib/cms/server";
import { apiSafe, type ApiAttempt } from "@/lib/api-server";
import { getCopy } from "@/lib/cms/server";
async function LegacyTestHistory({userId}:{userId?:number}) {
  const copy=getCopy('copy.components.legacy-test-history');
  if(!userId)return null;
  const attempts=await apiSafe<ApiAttempt[]>(`/users/${userId}/attempts`);
  if(!attempts?.length)return null;
  return <section className="rounded-3xl border border-stone-200 bg-white p-7"><h2 className="font-semibold">{copy('001','Предыдущие прохождения')}</h2><p className="mt-2 text-xs text-stone-400">{copy('002','Результаты, сохранённые в базе данных до подключения нового редактора.')}</p><div className="mt-5 divide-y divide-stone-100">{attempts.map(a=><div key={a.id} className="flex justify-between gap-5 py-4 text-sm"><div><p className="font-medium">{a.test?.name||a.test?.slug}</p><p className="mt-1 text-xs text-stone-400">{a.result?.summary||a.state}</p></div><span className="text-xs text-stone-400">{new Date(a.started).toLocaleString('ru-RU')}</span></div>)}</div></section>;
}

export default withPublishedContent(LegacyTestHistory);
