"use client";

import { CompassArt } from "@/components/brand-art";
import { IconAI } from "@/components/compass-marks";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { QuizSection } from "@/lib/mock-data";

const scale = [
  { value: 1, label: "Совсем не про меня" },
  { value: 2, label: "Скорее нет" },
  { value: 3, label: "Нейтрально" },
  { value: 4, label: "Скорее да" },
  { value: 5, label: "Точно про меня" },
];

// Тест из разделов: страница = раздел, сверху текстовая навигация по разделам.
// Без иконок — минималистичный редакционный стиль.
export default function SectionQuiz({
  title,
  sections,
  onFinish,
}: {
  title: string;
  sections: QuizSection[];
  // values — ответы 1–5 в сквозном порядке вопросов (для записи в бекенд)
  onFinish: (values: number[]) => void;
}) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [processing, setProcessing] = useState(false);
  const [starting, setStarting] = useState(true);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Активный раздел всегда виден в горизонтальной ленте
  useEffect(() => {
    tabRefs.current[sectionIdx]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [sectionIdx]);

  // Короткая заставка «тест начинается»
  useEffect(() => {
    const t = setTimeout(() => setStarting(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const totalQuestions = sections.reduce((n, s) => n + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const section = sections[sectionIdx];
  const last = sectionIdx === sections.length - 1;

  function key(si: number, qi: number) {
    return `${si}-${qi}`;
  }

  function sectionAnswered(si: number) {
    return sections[si].questions.every(
      (_, qi) => answers[key(si, qi)] !== undefined
    );
  }

  function next() {
    if (!sectionAnswered(sectionIdx)) return;
    if (last) {
      setProcessing(true);
      const values = sections.flatMap((s, si) =>
        s.questions.map((_, qi) => answers[key(si, qi)])
      );
      setTimeout(() => onFinish(values), 2500);
    } else {
      setSectionIdx(sectionIdx + 1);
      window.scrollTo({ top: 0 });
    }
  }

  if (starting) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <CompassArt className="mx-auto h-36 w-36" />
        <p className="font-display mt-3 font-medium">Тест начинается…</p>
        <p className="mt-1 text-sm text-stone-500">Готовим вопросы · {title}</p>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <IconAI className="mx-auto h-28 w-28" />
        <p className="font-display mt-2 font-medium">
          Обрабатываем ваши ответы…
        </p>
        <p className="mt-1 text-sm text-stone-500">
          ИИ анализирует результаты и готовит персональный отчёт
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Заголовок и общий прогресс */}
      <div className="flex items-baseline justify-between">
        <span className="font-display text-sm font-medium">{title}</span>
        <span className="font-mono text-xs text-stone-400">
          {answeredCount}/{totalQuestions} ответов
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-violet-600 transition-all"
          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Навигация по разделам — горизонтальная лента «пилюль», листается пальцем */}
      <div className="relative mt-6 -mx-4 sm:mx-0">
        <div className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-4 py-1 sm:px-0">
          {sections.map((s, i) => {
            const done = sectionAnswered(i);
            const current = i === sectionIdx;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                onClick={() => setSectionIdx(i)}
                className={`flex shrink-0 snap-start items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 text-sm whitespace-nowrap transition ${
                  current
                    ? "border-violet-500 bg-violet-500 font-medium text-white shadow-[0_8px_20px_rgba(90,95,232,0.28)]"
                    : done
                      ? "border-teal-200 bg-teal-100 text-teal-800 hover:border-teal-300"
                      : "border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-800"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${
                    current
                      ? "bg-white/20 text-white"
                      : done
                        ? "bg-teal-500 text-white"
                        : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {done && !current ? <Check size={12} strokeWidth={3} /> : i + 1}
                </span>
                {s.title}
              </button>
            );
          })}
        </div>
        {/* Мягкие края — подсказка, что лента листается */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent sm:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent sm:hidden" />
      </div>

      {/* Раздел: заголовок */}
      <div className="mt-7">
        <p className="font-mono text-xs text-stone-400">
          Раздел {sectionIdx + 1} из {sections.length}
        </p>
        <h2 className="font-display mt-2 text-xl font-semibold tracking-tight">
          {section.title}
        </h2>
        <p className="mt-1.5 text-sm text-stone-500">{section.description}</p>
      </div>

      {/* Вопросы раздела */}
      <div className="mt-7 space-y-4">
        {section.questions.map((q, qi) => {
          const k = key(sectionIdx, qi);
          const selected = answers[k];
          return (
            <div
              key={k}
              className="rounded-2xl border border-stone-200 bg-white p-6"
            >
              <p className="font-medium leading-relaxed">{q}</p>
              <div className="mt-5 flex items-center justify-between gap-2">
                {scale.map((o) => (
                  <button
                    key={o.value}
                    title={o.label}
                    onClick={() => setAnswers({ ...answers, [k]: o.value })}
                    className={`flex h-10 flex-1 items-center justify-center rounded-lg border font-mono text-sm transition ${
                      selected === o.value
                        ? "border-violet-500 bg-violet-500 text-white"
                        : "border-stone-200 text-stone-400 hover:border-stone-400 hover:text-stone-700"
                    }`}
                  >
                    {o.value}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-stone-400">
                <span>{scale[0].label}</span>
                <span>{scale[4].label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Навигация */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => sectionIdx > 0 && setSectionIdx(sectionIdx - 1)}
          className={`text-sm underline decoration-stone-300 underline-offset-4 ${
            sectionIdx > 0
              ? "text-stone-500 hover:text-stone-900"
              : "invisible"
          }`}
        >
          Назад
        </button>
        <button
          onClick={next}
          disabled={!sectionAnswered(sectionIdx)}
          className="rounded-2xl bg-violet-500 px-8 py-3 text-sm font-medium text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {last ? "Завершить тест" : "Следующий раздел"}
        </button>
      </div>
    </div>
  );
}
