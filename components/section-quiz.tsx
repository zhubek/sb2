"use client";

import { CompassArt } from "@/components/brand-art";
import { IconAI } from "@/components/compass-marks";
import { useEffect, useState } from "react";
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
  onFinish: () => void;
}) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [processing, setProcessing] = useState(false);
  const [starting, setStarting] = useState(true);

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
      setTimeout(onFinish, 2500);
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

      {/* Навигация по разделам — текстовые вкладки без иконок */}
      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-0 border-b border-stone-200">
        {sections.map((s, i) => {
          const done = sectionAnswered(i);
          const current = i === sectionIdx;
          return (
            <button
              key={s.id}
              onClick={() => setSectionIdx(i)}
              className={`-mb-px flex shrink-0 items-baseline gap-1.5 border-b-2 pb-2.5 text-sm transition ${
                current
                  ? "border-violet-600 font-medium text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              <span className="font-mono text-[11px]">
                {done && !current ? "✓" : String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Раздел: заголовок */}
      <div className="mt-9">
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
