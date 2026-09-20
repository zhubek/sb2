"use client";
import { useCopy } from "@/lib/cms/client";

import { ContentText } from "@/lib/cms/client";
import { defaultTests } from "@/lib/cms/test-defaults";
import { useContent } from "@/lib/cms/client";


import Link from "next/link";
import { useState } from "react";
import { MbtiBars } from "@/components/report-blocks";
import { currentUser, mbtiSections } from "@/lib/mock-data";
import SectionQuiz from "@/components/section-quiz";
import { PersonalityArt } from "@/components/brand-art";
import { completeChecklistStep } from "@/lib/checklist-events";
import { recordTestAttempt } from "@/lib/api";

type Stage = "intro" | "quiz" | "result";

const cmsDefaults_currentUser = currentUser;
const cmsDefaults_mbtiSections = mbtiSections;

export default function MbtiFlow({ initialStage }: { initialStage: Stage }) {
  const pageCopy = useCopy("copy.app.platform.tests.mbti.mbti-flow");
  const definition = useContent("test.mbti", defaultTests.find(t => t.slug === "mbti")!);
  const mbtiSections = useContent("mock-data.mbtiSections", cmsDefaults_mbtiSections);
  const currentUser = useContent("mock-data.currentUser", cmsDefaults_currentUser);
  const [stage, setStage] = useState<Stage>(initialStage);

  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <PersonalityArt className="mx-auto h-44 w-56" />
        <span className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          {definition.method}</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">{definition.name}</h1>
        <p className="mt-4 leading-relaxed text-stone-600">
          {definition.tagline}</p>
        <div className="mt-6 flex justify-center gap-6 text-sm text-stone-500">
          <span>{definition.duration}</span>
          <span>·</span>
          <span>
            {mbtiSections.length} <ContentText id="copy.app.platform.tests.mbti.mbti-flow.005" fallback=" раздела ·" />{" "}
            {mbtiSections.reduce((n, s) => n + s.questions.length, 0)} <ContentText id="copy.app.platform.tests.mbti.mbti-flow.006" fallback=" вопросов (демо)" /></span>
        </div>
        <button
          onClick={() => setStage("quiz")}
          className="mt-8 rounded-2xl bg-violet-500 px-8 py-3 font-medium text-white transition hover:bg-violet-600"
        >
          <ContentText id="copy.app.platform.tests.mbti.mbti-flow.007" fallback="Начать тест" /></button>
      </div>
    );
  }

  if (stage === "quiz") {
    return (
      <SectionQuiz
        title={definition.name} scale={definition.scale}
        sections={mbtiSections}
        onFinish={async (values) => { await recordTestAttempt("mbti", values, { summary: pageCopy("x001","ENFJ · Протагонист"), type: "ENFJ" }, definition); setStage("result");
completeChecklistStep("c5"); }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="text-sm font-medium text-violet-600"><ContentText id="copy.app.platform.tests.mbti.mbti-flow.008" fallback="Результат теста MBTI" /></p>
        <h1 className="mt-2 text-4xl font-bold text-violet-600">
          {currentUser.mbtiType}
        </h1>
        <p className="mt-1 text-lg font-medium">
          «{currentUser.mbtiTitle}»
        </p>
        <p className="mx-auto mt-3 max-w-lg text-stone-600">
          <ContentText id="copy.app.platform.tests.mbti.mbti-flow.009" fallback="Харизматичный и вдохновляющий лидер. Вы умеете чувствовать людей, объединять их вокруг идеи и вести за собой. Вам подходят профессии, связанные с коммуникацией, наставничеством и публичной деятельностью." /></p>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold"><ContentText id="copy.app.platform.tests.mbti.mbti-flow.010" fallback="Шкалы личности" /></h2>
        <div className="mt-5">
          <MbtiBars />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-100 p-5 text-sm text-stone-700">
        🤖 <span className="font-medium"><ContentText id="copy.app.platform.tests.mbti.mbti-flow.011" fallback="ИИ-ассистент:" /></span> <ContentText id="copy.app.platform.tests.mbti.mbti-flow.012" fallback=" отличный результат! Тип ENFJ хорошо сочетается с вашими навыками коммуникации и эмпатии — подробный разбор сильных сторон и рекомендации ждут в отчёте." /></div>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/tests/mbti/report"
          className="rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
        >
          <ContentText id="copy.app.platform.tests.mbti.mbti-flow.013" fallback="Открыть полный отчёт" /></Link>
        <Link
          href="/tests"
          className="rounded-xl border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          <ContentText id="copy.app.platform.tests.mbti.mbti-flow.014" fallback="К разделу «Тесты»" /></Link>
      </div>
    </div>
  );
}
