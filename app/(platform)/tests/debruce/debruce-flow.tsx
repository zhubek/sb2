"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { debruceSections, skills } from "@/lib/mock-data";
import { industryIcon, personaIndustries } from "@/components/navigator/industry-icons";
import { industries } from "@/lib/nav/types";
import SectionQuiz from "@/components/section-quiz";
import { SkillsArt } from "@/components/brand-art";
import { completeChecklistStep } from "@/lib/checklist-events";

type Stage = "intro" | "quiz" | "result" | "industry";

export default function DebruceFlow({ initialStage }: { initialStage: Stage }) {
  const [stage, setStage] = useState<Stage>(initialStage);
  const [openSkill, setOpenSkill] = useState<string | null>(null);

  // ── Вводный экран ──────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <SkillsArt className="mx-auto h-44 w-56" />
        <span className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">
          Методика НАО им. Ы. Алтынсарина · DeBruce
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Мои навыки</h1>
        <p className="mt-4 leading-relaxed text-stone-600">
          Тест определит рейтинг ваших 10 ключевых навыков. На основе топ-3 мы
          предложим подходящие отрасли, направления и образовательные программы
          — вплоть до списка университетов.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-sm text-stone-500">
          <span>≈ 15 минут</span>
          <span>·</span>
          <span>
            {debruceSections.length} раздела ·{" "}
            {debruceSections.reduce((n, s) => n + s.questions.length, 0)}{" "}
            вопросов (демо)
          </span>
          <span>·</span>
          <span>Без правильных ответов</span>
        </div>
        <button
          onClick={() => setStage("quiz")}
          className="mt-8 rounded-2xl bg-violet-500 px-8 py-3 font-medium text-white transition hover:bg-violet-600"
        >
          Начать тест
        </button>
        <p className="mt-4 text-xs text-stone-400">
          Отвечайте честно — так рекомендации будут точнее
        </p>
      </div>
    );
  }

  // ── Вопросы ────────────────────────────────────────────────────────────────
  if (stage === "quiz") {
    return (
      <SectionQuiz
        title="Мои навыки"
        sections={debruceSections}
        onFinish={() => {
          setStage("result");
          completeChecklistStep("c3");
        }}
      />
    );
  }

  // ── Результат: 10 навыков ─────────────────────────────────────────────────
  if (stage === "result") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-sm font-medium text-violet-600">
            Результат теста по методике НАО им. Ы. Алтынсарина
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">Ваши 10 навыков</h1>
          <p className="mt-2 text-stone-500">
            Топ-3 выделены — на их основе построены рекомендации. Нажмите на
            навык, чтобы узнать подробнее.
          </p>
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
            Перейти к рекомендациям по отраслям
          </button>
          <Link
            href="/tests/debruce/report"
            className="rounded-2xl border border-stone-200 px-8 py-3 font-medium text-stone-600 transition hover:bg-stone-50"
          >
            Открыть отчёт
          </Link>
        </div>
      </div>
    );
  }

  // ── Выбор отрасли: реальные отрасли навигатора ────────────────────────────
  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="text-sm font-medium text-violet-600">Рекомендации</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">Выберите отрасль</h1>
        <p className="mt-2 text-stone-500">
          На основе ваших топ-3 навыков (Креативность, Коммуникация, Эмпатия)
          мы подобрали 3 отрасли из 16. Внутри — направления, профессии и
          программы, где этому учат, и переход в навигатор.
        </p>
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
          Все 16 отраслей →
        </Link>
        <button onClick={() => setStage("result")} className="text-sm text-stone-400 hover:text-stone-600">
          ← Назад к навыкам
        </button>
      </div>
    </div>
  );
}
