"use client";

import Link from "next/link";
import { useState } from "react";
import { currentUser, mbtiScales, mbtiSections } from "@/lib/mock-data";
import SectionQuiz from "@/components/section-quiz";
import { PersonalityArt } from "@/components/brand-art";
import { completeChecklistStep } from "@/lib/checklist-events";

type Stage = "intro" | "quiz" | "result";

export default function MbtiFlow({ initialStage }: { initialStage: Stage }) {
  const [stage, setStage] = useState<Stage>(initialStage);

  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <PersonalityArt className="mx-auto h-44 w-56" />
        <span className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          Дополнительная диагностика
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Тест MBTI</h1>
        <p className="mt-4 leading-relaxed text-stone-600">
          Определит ваш тип личности: как вы восполняете энергию, воспринимаете
          информацию, принимаете решения и организуете свою жизнь. Вместе с
          DeBruce и Голландом откроет комплексный отчёт ИИ.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-sm text-stone-500">
          <span>≈ 10 минут</span>
          <span>·</span>
          <span>
            {mbtiSections.length} раздела ·{" "}
            {mbtiSections.reduce((n, s) => n + s.questions.length, 0)} вопросов
            (демо)
          </span>
        </div>
        <button
          onClick={() => setStage("quiz")}
          className="mt-8 rounded-full bg-stone-900 px-8 py-3 font-medium text-white transition hover:bg-violet-700"
        >
          Начать тест
        </button>
      </div>
    );
  }

  if (stage === "quiz") {
    return (
      <SectionQuiz
        title="Тест MBTI"
        sections={mbtiSections}
        onFinish={() => { setStage("result"); completeChecklistStep("c5"); }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="text-sm font-medium text-violet-600">Результат MBTI</p>
        <h1 className="mt-2 text-4xl font-bold text-violet-600">
          {currentUser.mbtiType}
        </h1>
        <p className="mt-1 text-lg font-medium">
          «{currentUser.mbtiTitle}»
        </p>
        <p className="mx-auto mt-3 max-w-lg text-stone-600">
          Харизматичный и вдохновляющий лидер. Вы умеете чувствовать людей,
          объединять их вокруг идеи и вести за собой. Вам подходят профессии,
          связанные с коммуникацией, наставничеством и публичной деятельностью.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold">Шкалы личности</h2>
        <div className="mt-5 space-y-5">
          {mbtiScales.map((s) => (
            <div key={s.left}>
              <div className="flex justify-between text-xs font-medium text-stone-500">
                <span>{s.left}</span>
                <span>{s.right}</span>
              </div>
              <div className="relative mt-1.5 h-2 rounded-full bg-stone-100">
                <div
                  className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-600 shadow"
                  style={{ left: `${s.value}%` }}
                />
              </div>
              <p className="mt-1.5 text-right text-xs text-violet-600">
                {s.value}% · {s.winner}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5 text-sm text-stone-700">
        🤖 <span className="font-medium">ИИ-ассистент:</span> отличный
        результат! Тип ENFJ хорошо сочетается с вашими навыками коммуникации и
        эмпатии. Остался один шаг до комплексного отчёта — тест Голланда.
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/tests/holland"
          className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          Пройти тест Голланда
        </Link>
        <Link
          href="/tests"
          className="rounded-xl border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          К разделу «Тесты»
        </Link>
      </div>
    </div>
  );
}
