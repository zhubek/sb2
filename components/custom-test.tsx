"use client";
import { useCopy } from "@/lib/cms/client";

import { useState } from "react";
import Link from "next/link";
import SectionQuiz from "./section-quiz";
import type { TestContent } from "@/lib/cms/types";
import { recordTestAttempt } from "@/lib/api";
export default function CustomTest({test}:{test:TestContent}) {
  const pageCopy = useCopy("copy.components.custom-test");
  const [stage,setStage]=useState('intro'),[attempt,setAttempt]=useState('');
  if(stage==='quiz')return <SectionQuiz title={test.name} sections={test.sections} scale={test.scale} onFinish={async values=>{const saved=await recordTestAttempt(test.slug,values,{},test);setAttempt(saved.id);setStage('result');}}/>;
  if(stage==='result')return <div className="mx-auto max-w-xl py-12 text-center"><h1 className="text-2xl font-semibold">{pageCopy("x001","Ответы сохранены")}</h1><p className="mt-4 text-stone-500">{pageCopy("x002","Вы завершили тест «")}{test.name}{pageCopy("x003","». Ответы доступны в истории прохождений.")}</p><Link href={`/tests/attempts/${attempt}`} className="mt-7 inline-block rounded-xl bg-violet-500 px-6 py-3 text-white">{pageCopy("x004","Посмотреть ответы →")}</Link></div>;
  return <div className="mx-auto max-w-xl py-10 text-center"><p className="text-sm text-violet-500">{test.method}</p><h1 className="mt-4 text-3xl font-semibold">{test.name}</h1><p className="mt-5 leading-relaxed text-stone-500">{test.tagline}</p><p className="mt-6 text-sm text-stone-400">{test.sections.reduce((n,s)=>n+s.questions.length,0)} {pageCopy("x005","вопросов ·")}{test.duration}</p><button className="mt-7 rounded-xl bg-violet-500 px-7 py-3 text-white" onClick={()=>setStage('quiz')}>{pageCopy("x006","Начать тест")}</button></div>;
}
