"use client";
import { useCopy } from "@/lib/cms/client";

import { ContentText } from "@/lib/cms/client";
import { defaultTests } from "@/lib/cms/test-defaults";
import { useContent } from "@/lib/cms/client";


import Link from "next/link";
import { useState } from "react";
import { hollandScales, hollandSections } from "@/lib/mock-data";
import { HollandBars, HollandTopTiles } from "@/components/report-blocks";
import SectionQuiz from "@/components/section-quiz";
import { CertificateArt, InterestsArt } from "@/components/brand-art";
import { completeChecklistStep } from "@/lib/checklist-events";
import { recordTestAttempt } from "@/lib/api";

type Stage = "intro" | "quiz" | "result";

const cmsDefaults_hollandScales = hollandScales;
const cmsDefaults_hollandSections = hollandSections;

export default function HollandFlow({ initialStage }: { initialStage: Stage }) {
  const pageCopy = useCopy("copy.app.platform.tests.holland.holland-flow");
  const definition = useContent("test.holland", defaultTests.find(t => t.slug === "holland")!);
  const hollandSections = useContent("mock-data.hollandSections", cmsDefaults_hollandSections);
  const hollandScales = useContent("mock-data.hollandScales", cmsDefaults_hollandScales);
  const [stage, setStage] = useState<Stage>(initialStage);

  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <InterestsArt className="mx-auto h-44 w-56" />
        <span className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          {definition.method}</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">{definition.name}</h1>
        <p className="mt-4 leading-relaxed text-stone-600">
          {definition.tagline}</p>
        <div className="mt-6 flex justify-center gap-6 text-sm text-stone-500">
          <span>{definition.duration}</span>
          <span>·</span>
          <span>
            {hollandSections.length} <ContentText id="copy.app.platform.tests.holland.holland-flow.005" fallback=" раздела ·" />{" "}
            {hollandSections.reduce((n, s) => n + s.questions.length, 0)}{" "}
            <ContentText id="copy.app.platform.tests.holland.holland-flow.006" fallback="вопросов (демо)" /></span>
        </div>
        <button
          onClick={() => setStage("quiz")}
          className="mt-8 rounded-2xl bg-violet-500 px-8 py-3 font-medium text-white transition hover:bg-violet-600"
        >
          <ContentText id="copy.app.platform.tests.holland.holland-flow.007" fallback="Начать тест" /></button>
      </div>
    );
  }

  if (stage === "quiz") {
    return (
      <SectionQuiz
        title={definition.name} scale={definition.scale}
        sections={hollandSections}
        onFinish={async (values) => { await recordTestAttempt("holland", values, { summary: pageCopy("x001","Код ASE · Артистичный тип"), code: "ASE" }, definition); setStage("result");
completeChecklistStep("c6"); }}
      />
    );
  }

  const sorted = [...hollandScales].sort((a, b) => b.score - a.score);
  const top = sorted.slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="text-sm font-medium text-violet-600">
          <ContentText id="copy.app.platform.tests.holland.holland-flow.008" fallback="Результат теста по модели Дж. Холланда (RIASEC)" /></p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          {top.map((t) => t.name).join(" + ")} <ContentText id="copy.app.platform.tests.holland.holland-flow.009" fallback=" тип" /></h1>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700">
          <ContentText id="copy.app.platform.tests.holland.holland-flow.010" fallback="Код RIASEC:" /><span className="font-mono text-base font-bold tracking-[0.2em] text-violet-800">
            {sorted
              .slice(0, 3)
              .map((s) => s.code)
              .join("")}
          </span>
        </p>
        <p className="mx-auto mt-3 max-w-lg text-stone-600">
          <ContentText id="copy.app.platform.tests.holland.holland-flow.011" fallback="Ваши ведущие интересы — творчество и работа с людьми. Вам подходят профессии, где можно создавать новое и напрямую взаимодействовать с аудиторией: медиа, образование, культура, коммуникации." /></p>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold"><ContentText id="copy.app.platform.tests.holland.holland-flow.012" fallback="Профиль интересов (RIASEC)" /></h2>
        <div className="mt-5 space-y-4">
          <HollandTopTiles />
          <HollandBars />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <CertificateArt className="hidden w-40 shrink-0 sm:block" />
        <p className="text-sm leading-relaxed text-stone-700">
          <span className="font-display font-medium">
            <ContentText id="copy.app.platform.tests.holland.holland-flow.013" fallback="Все 3 теста пройдены!" /></span>{" "}
          <ContentText id="copy.app.platform.tests.holland.holland-flow.014" fallback="ИИ готовит ваш комплексный отчёт: сводный анализ личности, сильных сторон, интересов и карьерных рекомендаций. Он появится в личном кабинете." /></p>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/tests/holland/report"
          className="rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
        >
          <ContentText id="copy.app.platform.tests.holland.holland-flow.015" fallback="Открыть полный отчёт" /></Link>
        <Link
          href="/tests/report"
          className="rounded-xl border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          <ContentText id="copy.app.platform.tests.holland.holland-flow.016" fallback="Комплексный отчёт" /></Link>
      </div>
    </div>
  );
}
