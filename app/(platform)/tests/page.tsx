import { withPublishedContent } from "@/lib/cms/server";
import LegacyTestHistory from "@/components/legacy-test-history";

import { getCopy } from "@/lib/cms/server";
import Link from "next/link";
import { ArrowRight, ClipboardList, History } from "lucide-react";
import { auth } from "@/lib/auth";
import { publishedTests } from "@/lib/cms/tests";
import { userAttempts } from "@/lib/cms/attempts";
import { getContent } from "@/lib/cms/server";
import { tests as originalTests } from "@/lib/mock-data";
const inlineDefault_originalTests = originalTests;

async function TestsPage() {
  const pageCopy = getCopy("copy.app.platform.tests.page");
  const session=await auth();
  const definitions=publishedTests();
  const attempts=session?.user.id?(await userAttempts(session.user.id)):[];
  const completed=new Set(attempts.map(a=>a.slug));
  const tests=getContent('mock-data.tests',inlineDefault_originalTests);
  return <div className="mx-auto max-w-5xl space-y-8"><div><p className="mb-2 text-xs tracking-widest text-violet-500 uppercase">{pageCopy("x001","Моя диагностика")}</p><h1 className="font-display text-3xl font-semibold tracking-tight">{pageCopy("x002","Тесты")}</h1><p className="mt-3 text-sm text-stone-500">{pageCopy("x003","Узнайте больше о своих навыках, интересах и профессиональных предпочтениях.")}</p></div><div className="rounded-3xl bg-violet-600 p-7 text-white flex flex-wrap items-center justify-between gap-5"><div><h2 className="text-lg font-semibold">{pageCopy("x004","Ваш следующий шаг к выбору профессии")}</h2><p className="mt-2 text-sm text-violet-100">{pageCopy("x005","Пройдено ")}{definitions.filter(t=>completed.has(t.slug)).length} {pageCopy("x006","из ")}{definitions.length} {pageCopy("x007","доступных тестов")}</p></div><Link href="/tests/report" className="rounded-xl border border-white/25 px-5 py-3 text-sm">{pageCopy("x008","Пример комплексного отчёта →")}</Link></div><div className="grid gap-5 md:grid-cols-2">{definitions.map((t,i)=><section key={t.slug} className={`rounded-3xl border bg-white p-7 ${i===0?'border-violet-200':'border-stone-200'}`}><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-500"><ClipboardList size={20}/></span>{completed.has(t.slug)&&<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{pageCopy("x009","Пройден")}</span>}</div><h2 className="mt-5 text-xl font-semibold">{t.name}</h2><p className="mt-2 text-xs text-stone-400">{t.method}</p><p className="mt-4 text-sm leading-relaxed text-stone-500">{t.tagline}</p><p className="mt-5 text-xs text-stone-400">{t.sections.reduce((n,s)=>n+s.questions.length,0)} {pageCopy("x010","вопросов · ")}{t.duration}</p><div className="mt-6 flex gap-4 items-center"><Link href={`/tests/${t.slug}`} className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white">{completed.has(t.slug)?pageCopy("x011","Пройти ещё раз"):pageCopy("x012","Начать тест")}<ArrowRight size={15}/></Link>{tests.some(x=>x.id===t.slug)&&<Link href={`/tests/${t.slug}/report`} className="text-xs text-stone-400 underline underline-offset-4">{pageCopy("x013","Пример отчёта")}</Link>}</div></section>)}</div>{!definitions.length&&<p className="rounded-2xl border border-stone-200 p-8 text-center text-stone-500">{pageCopy("x014","Сейчас нет доступных тестов. Загляните позже.")}</p>}<section className="rounded-3xl border border-stone-200 bg-white p-7"><h2 className="flex items-center gap-2 font-semibold"><History size={18}/>{pageCopy("x015","История прохождений")}</h2><p className="mt-2 text-xs text-stone-400">{pageCopy("x016","Каждая попытка хранится вместе с версией вопросов, на которые вы отвечали.")}</p>{attempts.length?<div className="mt-5 divide-y divide-stone-100">{attempts.map(a=><Link key={a.id} href={`/tests/attempts/${a.id}`} className="flex justify-between gap-5 py-4 text-sm"><div><p className="font-medium">{a.name}</p><p className="mt-1 text-xs text-stone-400">{a.summary}</p></div><span className="text-xs text-stone-400">{new Date(a.at).toLocaleString('ru-RU')} →</span></Link>)}</div>:<p className="py-8 text-sm text-stone-400">{pageCopy("x017","Здесь появятся ваши завершённые тесты.")}</p>}</section><LegacyTestHistory userId={session?.user.backendId}/></div>;
}

export default withPublishedContent(TestsPage);
