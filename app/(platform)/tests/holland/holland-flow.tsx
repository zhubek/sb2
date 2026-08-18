"use client";

import Link from "next/link";
import { useState } from "react";
import { hollandScales, hollandSections } from "@/lib/mock-data";
import SectionQuiz from "@/components/section-quiz";
import { CertificateArt, InterestsArt } from "@/components/brand-art";
import { completeChecklistStep } from "@/lib/checklist-events";

type Stage = "intro" | "quiz" | "result";

export default function HollandFlow({ initialStage }: { initialStage: Stage }) {
  const [stage, setStage] = useState<Stage>(initialStage);

  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <InterestsArt className="mx-auto h-44 w-56" />
        <span className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          Дополнительная диагностика
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Тест Голланда</h1>
        <p className="mt-4 leading-relaxed text-stone-600">
          Определит ваши профессиональные интересы по 6 типам направленности:
          реалистичный, исследовательский, артистичный, социальный,
          предприимчивый и конвенциональный. Это последний тест до вашего
          комплексного отчёта ИИ!
        </p>
        <div className="mt-6 flex justify-center gap-6 text-sm text-stone-500">
          <span>≈ 8 минут</span>
          <span>·</span>
          <span>
            {hollandSections.length} раздела ·{" "}
            {hollandSections.reduce((n, s) => n + s.questions.length, 0)}{" "}
            вопросов (демо)
          </span>
        </div>
        <button
          onClick={() => setStage("quiz")}
          className="mt-8 rounded-2xl bg-violet-500 px-8 py-3 font-medium text-white transition hover:bg-violet-600"
        >
          Начать тест
        </button>
      </div>
    );
  }

  if (stage === "quiz") {
    return (
      <SectionQuiz
        title="Тест Голланда"
        sections={hollandSections}
        onFinish={() => { setStage("result"); completeChecklistStep("c6"); }}
      />
    );
  }

  const sorted = [...hollandScales].sort((a, b) => b.score - a.score);
  const top = sorted.slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="text-sm font-medium text-violet-600">
          Результат теста Голланда
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          {top.map((t) => t.name).join(" + ")} тип
        </h1>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700">
          Код RIASEC:
          <span className="font-mono text-base font-bold tracking-[0.2em] text-violet-800">
            {sorted
              .slice(0, 3)
              .map((s) => s.code)
              .join("")}
          </span>
        </p>
        <p className="mx-auto mt-3 max-w-lg text-stone-600">
          Ваши ведущие интересы — творчество и работа с людьми. Вам подходят
          профессии, где можно создавать новое и напрямую взаимодействовать с
          аудиторией: медиа, образование, культура, коммуникации.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold">Профиль интересов (RIASEC)</h2>
        <div className="mt-5 space-y-4">
          {sorted.map((s, i) => (
            <div key={s.code}>
              <div className="flex justify-between text-sm">
                <span className={i < 2 ? "font-medium" : "text-stone-600"}>
                  {s.code} · {s.name}
                </span>
                <span className="font-semibold text-stone-600">{s.score}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full ${i < 2 ? "bg-violet-600" : "bg-stone-300"}`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <CertificateArt className="hidden w-40 shrink-0 sm:block" />
        <p className="text-sm leading-relaxed text-stone-700">
          <span className="font-display font-medium">
            Все 3 теста пройдены!
          </span>{" "}
          ИИ готовит ваш комплексный отчёт: сводный анализ личности, сильных
          сторон, интересов и карьерных рекомендаций. Он появится в личном
          кабинете.
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/dashboard"
          className="rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
        >
          Перейти в личный кабинет
        </Link>
      </div>
    </div>
  );
}
