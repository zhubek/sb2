"use client";
import { useCopy } from "@/lib/cms/client";

import { ContentText } from "@/lib/cms/client";
import { defaultTests } from "@/lib/cms/test-defaults";
import { useContent } from "@/lib/cms/client";


import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { debruceSections, skills } from "@/lib/mock-data";
import { industryIcon, personaIndustries } from "@/components/navigator/industry-icons";
import { industries } from "@/lib/nav/types";
import SectionQuiz from "@/components/section-quiz";
import { SkillsArt } from "@/components/brand-art";
import { completeChecklistStep } from "@/lib/checklist-events";
import { recordTestAttempt } from "@/lib/api";

type Stage = "intro" | "quiz" | "result" | "industry";

const cmsDefaults_debruceSections = debruceSections;
const cmsDefaults_skills = skills;
const cmsDefaults_industries = industries;

export default function DebruceFlow({ initialStage }: { initialStage: Stage }) {
  const pageCopy = useCopy("copy.app.platform.tests.debruce.debruce-flow");
  const definition = useContent("test.debruce", defaultTests.find(t => t.slug === "debruce")!);
  const debruceSections = useContent("mock-data.debruceSections", cmsDefaults_debruceSections);
  const skills = useContent("mock-data.skills", cmsDefaults_skills);
  const industries = useContent("nav-meta.industries", cmsDefaults_industries);
  const [stage, setStage] = useState<Stage>(initialStage);
  const [openSkill, setOpenSkill] = useState<string | null>(null);

  // ── Вводный экран ──────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <SkillsArt className="mx-auto h-44 w-56" />
        <span className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">
          {definition.method}</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">{definition.name}</h1>
        <p className="mt-4 leading-relaxed text-stone-600">
          {definition.tagline}</p>
        <div className="mt-6 flex justify-center gap-6 text-sm text-stone-500">
          <span>{definition.duration}</span>
          <span>·</span>
          <span>
            {debruceSections.length} <ContentText id="copy.app.platform.tests.debruce.debruce-flow.005" fallback=" раздела ·" />{" "}
            {debruceSections.reduce((n, s) => n + s.questions.length, 0)}{" "}
            <ContentText id="copy.app.platform.tests.debruce.debruce-flow.006" fallback="вопросов (демо)" /></span>
          <span>·</span>
          <span><ContentText id="copy.app.platform.tests.debruce.debruce-flow.007" fallback="Без правильных ответов" /></span>
        </div>
        <button
          onClick={() => setStage("quiz")}
          className="mt-8 rounded-2xl bg-violet-500 px-8 py-3 font-medium text-white transition hover:bg-violet-600"
        >
          <ContentText id="copy.app.platform.tests.debruce.debruce-flow.008" fallback="Начать тест" /></button>
        <p className="mt-4 text-xs text-stone-400">
          <ContentText id="copy.app.platform.tests.debruce.debruce-flow.009" fallback="Отвечайте честно — так рекомендации будут точнее" /></p>
      </div>
    );
  }

  // ── Вопросы ────────────────────────────────────────────────────────────────
  if (stage === "quiz") {
    return (
      <SectionQuiz
        title={definition.name} scale={definition.scale}
        sections={debruceSections}
        onFinish={async (values) => { await recordTestAttempt("debruce", values, {
            summary: pageCopy("x001","Топ-3: Креативность · Коммуникация · Эмпатия"),
            top: [pageCopy("x002","Креативность"), pageCopy("x003","Коммуникация"), pageCopy("x004","Эмпатия")],
          }, definition); setStage("result");
completeChecklistStep("c3"); }}
      />
    );
  }

  // ── Результат: 10 навыков ─────────────────────────────────────────────────
  if (stage === "result") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-sm font-medium text-violet-600">
            <ContentText id="copy.app.platform.tests.debruce.debruce-flow.010" fallback="Результат теста по методике НАО им. Ы. Алтынсарина" /></p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight"><ContentText id="copy.app.platform.tests.debruce.debruce-flow.011" fallback="Ваши 10 навыков" /></h1>
          <p className="mt-2 text-stone-500">
            <ContentText id="copy.app.platform.tests.debruce.debruce-flow.012" fallback="Топ-3 выделены — на их основе построены рекомендации. Нажмите на навык, чтобы узнать подробнее." /></p>
        </div>

        <div className="mt-8 space-y-2.5">
          {skills.map((s, i) => {
            const top = i < 3;
            const open = openSkill === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setOpenSkill(open ? null : s.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  top
                    ? "border-violet-200 bg-violet-100/70 hover:bg-violet-100"
                    : "border-stone-200 bg-white hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      top ? "bg-violet-600 text-white" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium">
                    {s.name}
                    {s.en && (
                      <span className="ml-1.5 text-xs font-normal text-stone-400">
                        {s.en}
                      </span>
                    )}
                  </span>
                  <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-stone-100 sm:block">
                    <div
                      className={`h-full rounded-full ${top ? "bg-violet-600" : "bg-stone-300"}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-stone-600">
                    {s.score}
                  </span>
                </div>
                {open && (
                  <p className="mt-3 pl-10 text-sm leading-relaxed text-stone-600">
                    {s.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setStage("industry")}
            className="rounded-2xl bg-violet-500 px-8 py-3 font-medium text-white transition hover:bg-violet-600"
          >
            <ContentText id="copy.app.platform.tests.debruce.debruce-flow.013" fallback="Перейти к рекомендациям по отраслям" /></button>
          <Link
            href="/tests/debruce/report"
            className="rounded-2xl border border-stone-200 px-8 py-3 font-medium text-stone-600 transition hover:bg-stone-50"
          >
            <ContentText id="copy.app.platform.tests.debruce.debruce-flow.014" fallback="Открыть отчёт" /></Link>
        </div>
      </div>
    );
  }

  // ── Выбор отрасли: реальные отрасли навигатора ────────────────────────────
  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="text-sm font-medium text-violet-600"><ContentText id="copy.app.platform.tests.debruce.debruce-flow.015" fallback="Рекомендации" /></p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight"><ContentText id="copy.app.platform.tests.debruce.debruce-flow.016" fallback="Выберите отрасль" /></h1>
        <p className="mt-2 text-stone-500">
          <ContentText id="copy.app.platform.tests.debruce.debruce-flow.017" fallback="На основе ваших топ-3 навыков (Креативность, Коммуникация, Эмпатия) мы подобрали 3 отрасли из 16. Внутри — направления, профессии и программы, где этому учат, и переход в навигатор." /></p>
      </div>

      <div className="mt-8 space-y-3">
        {personaIndustries.map((name, n) => {
          const idx = industries.findIndex((i) => i.name === name);
          const meta = industries[idx];
          const Icon = industryIcon(name);
          return (
            <Link
              key={name}
              href={`/universities/industry/${idx}`}
              className="flex items-center gap-4 rounded-2xl border p-5 transition hover:shadow-md"
              style={{ background: meta.cl, borderColor: meta.c + "33" }}
            >
              <span className="relative flex h-12 w-12 flex-none items-center justify-center rounded-2xl text-white" style={{ background: meta.c }}>
                <Icon size={22} />
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 font-mono text-[10px] font-bold text-white">
                  {n + 1}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block font-semibold" style={{ color: meta.c }}>{name}</span>
                <span className="mt-0.5 block text-sm text-stone-600">{meta.desc}</span>
              </span>
              <ArrowRight size={17} className="flex-none text-stone-400" />
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link href="/universities/industries" className="text-sm font-medium text-violet-600 hover:text-violet-700">
          <ContentText id="copy.app.platform.tests.debruce.debruce-flow.018" fallback="Все 16 отраслей →" /></Link>
        <button onClick={() => setStage("result")} className="text-sm text-stone-400 hover:text-stone-600">
          <ContentText id="copy.app.platform.tests.debruce.debruce-flow.019" fallback="← Назад к навыкам" /></button>
      </div>
    </div>
  );
}
