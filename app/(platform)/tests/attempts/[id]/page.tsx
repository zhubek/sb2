import { withPublishedContent } from "@/lib/cms/server";
import { questionOf, answerLabel } from "@/lib/cms/questions";

import { getCopy } from "@/lib/cms/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { userAttempts } from "@/lib/cms/attempts";
async function Page({params}:{params:Promise<{id:string}>}) {
  const pageCopy = getCopy("copy.app.platform.tests.attempts.id.page");
  const session=await auth(),{id}=await params;
  const attempt=session?.user.id?(await userAttempts(session.user.id)).find(a=>a.id===id):null;
  if(!attempt)notFound();let offset=0;
  return <div className="mx-auto max-w-3xl"><Link href="/tests" className="text-sm text-violet-500">{pageCopy("x001","← Все тесты")}</Link><h1 className="mt-6 text-2xl font-semibold">{attempt.name}</h1><p className="mt-2 text-sm text-stone-400">{new Date(attempt.at).toLocaleString('ru-RU')} {pageCopy("x002","· сохранённая версия вопросов")}</p>{attempt.snapshot.sections.map(section=><section key={section.id} className="mt-7 rounded-2xl border border-stone-200 bg-white p-6"><h2 className="text-lg font-medium">{section.title}</h2>{section.questions.map((question,i)=>{const value=attempt.values[offset++];return <div key={i} className="mt-5 border-t border-stone-100 pt-4"><p className="text-sm">{questionOf(question).text}</p><p className="mt-2 text-sm text-violet-600">{answerLabel(question,value,attempt.snapshot.scale)}</p></div>;})}</section>)}</div>;
}

export default withPublishedContent(Page);
