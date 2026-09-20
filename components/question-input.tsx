"use client";
import { questionOf } from "@/lib/cms/questions";
import type { TestAnswer, TestContent, TestQuestion } from "@/lib/cms/types";

export default function QuestionInput({ question, value, scale, onChange }: { question: string | TestQuestion; value?: TestAnswer; scale: TestContent["scale"]; onChange: (v: TestAnswer) => void }) {
  const q = questionOf(question);
  if (q.type === "text") return <textarea aria-label="Ваш ответ" className="mt-4 w-full rounded-xl border border-stone-200 p-3 text-sm" rows={4} maxLength={5000} placeholder="Напишите свой ответ…" value={typeof value === "string" ? value : ""} onChange={e => onChange(e.target.value)} />;
  if (q.type === "single" || q.type === "multiple") return <div className="mt-4 space-y-2" role="group" aria-label={q.text}>{q.options?.map(o => {
    const checked = q.type === "single" ? value === o.id : Array.isArray(value) && value.includes(o.id);
    return <label key={o.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${checked ? "border-violet-400 bg-violet-50" : "border-stone-200"}`}><input className="mt-1 accent-violet-600" type={q.type === "single" ? "radio" : "checkbox"} name={q.id} checked={checked} onChange={() => onChange(q.type === "single" ? o.id : checked ? (value as string[]).filter(a => a !== o.id) : [...(Array.isArray(value) ? value : []), o.id])} /><span>{o.label}</span></label>;
  })}</div>;
  return <><div className="mt-5 flex gap-2">{scale.map(o => <button key={o.value} type="button" title={o.label} aria-label={o.label} aria-pressed={value === o.value} onClick={() => onChange(o.value)} className={`h-10 min-w-0 flex-1 rounded-lg border text-sm ${value === o.value ? "border-violet-500 bg-violet-500 text-white" : "border-stone-200 text-stone-500"}`}>{o.value}</button>)}</div><div className="mt-2 flex justify-between gap-4 text-[11px] text-stone-400"><span>{scale[0]?.label}</span><span>{scale.at(-1)?.label}</span></div></>;
}
