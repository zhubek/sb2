"use client";

import Link from "next/link";
import { useState } from "react";
import { debruceSections, recommendedIndustries, skills } from "@/lib/mock-data";
import type { Direction, Industry, Profile, Program } from "@/lib/types";
import SectionQuiz from "@/components/section-quiz";
import { SkillsArt } from "@/components/brand-art";
import { completeChecklistStep } from "@/lib/checklist-events";

type Stage =
  | "intro"
  | "quiz"
  | "result"
  | "industry"
  | "direction"
  | "profile"
  | "program";

export default function DebruceFlow({ initialStage }: { initialStage: Stage }) {
  const [stage, setStage] = useState<Stage>(initialStage);
  const [openSkill, setOpenSkill] = useState<string | null>(null);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [program, setProgram] = useState<Program | null>(null);

  // ── Вводный экран ──────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <SkillsArt className="mx-auto h-44 w-56" />
        <span className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">
          Методика НАО им. Ы. Алтынсарина
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Тест DeBruce</h1>
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
        title="Тест DeBruce"
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
            Результат теста DeBruce
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
                    ? "border-violet-200 bg-violet-50/60 hover:bg-violet-50"
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
                  <span className="flex-1 text-sm font-medium">{s.name}</span>
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

        <div className="mt-8 text-center">
          <button
            onClick={() => setStage("industry")}
            className="rounded-2xl bg-violet-500 px-8 py-3 font-medium text-white transition hover:bg-violet-600"
          >
            Перейти к рекомендациям по отраслям
          </button>
        </div>
      </div>
    );
  }

  // ── Иерархия выбора ────────────────────────────────────────────────────────
  const crumbs = [
    industry && industry.name,
    direction && direction.name,
    profile && profile.name,
    program && program.name,
  ].filter(Boolean) as string[];

  const stepMeta: Record<
    string,
    { step: number; title: string; subtitle: string }
  > = {
    industry: {
      step: 1,
      title: "Выберите отрасль",
      subtitle:
        "На основе ваших топ-3 навыков (Креативность, Коммуникация, Эмпатия) мы подобрали 3 отрасли из 16. Этого достаточно: навигатор сразу отфильтрует программы и заведения. Углубляться в направления — по желанию.",
    },
    direction: {
      step: 2,
      title: "Выберите направление",
      subtitle: `Направления внутри отрасли «${industry?.name}».`,
    },
    profile: {
      step: 3,
      title: "Выберите профиль",
      subtitle: `Профили направления «${direction?.name}».`,
    },
    program: {
      step: 4,
      title: "Образовательная программа",
      subtitle: `Программы профиля «${profile?.name}» с примерами профессий.`,
    },
  };
  const meta = stepMeta[stage];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <p className="text-sm font-medium text-violet-600">
          Рекомендации{meta.step > 1 ? ` · уточнение ${meta.step - 1} из 3` : ""}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">{meta.title}</h1>
        <p className="mt-2 text-stone-500">{meta.subtitle}</p>
        {crumbs.length > 0 && (
          <p className="mt-3 text-xs text-stone-400">{crumbs.join(" → ")}</p>
        )}
      </div>

      <div className="mt-8 space-y-3">
        {stage === "industry" &&
          !industry &&
          recommendedIndustries.map((it) => {
            // Примеры профессий отрасли — по входящим в неё программам
            const professions = [
              ...new Set(
                it.directions
                  .flatMap((d) => d.profiles)
                  .flatMap((p) => p.programs)
                  .flatMap((pr) => pr.professions)
              ),
            ].slice(0, 4);
            return (
              <ChoiceCard
                key={it.id}
                name={it.name}
                description={it.description}
                extra={`Профессии: ${professions.join(", ")}`}
                onClick={() => {
                  setIndustry(it);
                  setDirection(null);
                  setProfile(null);
                  setProgram(null);
                }}
              />
            );
          })}

        {/* Отрасль выбрана — этого достаточно для предфильтра навигатора */}
        {stage === "industry" && industry && (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 text-center">
            <p className="text-sm font-medium text-violet-600">Ваша отрасль</p>
            <h2 className="mt-1 text-xl font-bold">{industry.name}</h2>
            <p className="mt-2 text-sm text-stone-600">{industry.description}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={`/universities?industry=${encodeURIComponent(industry.name)}`}
                className="rounded-2xl bg-violet-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-600"
              >
                Открыть навигатор с этой отраслью →
              </Link>
              <button
                onClick={() => setStage("direction")}
                className="rounded-2xl border border-violet-200 bg-white px-6 py-3 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
              >
                Уточнить направление
              </button>
            </div>
            <p className="mt-3 text-xs text-stone-400">
              Навигатор откроется с преднастроенным фильтром по отрасли
            </p>
          </div>
        )}

        {stage === "direction" &&
          industry?.directions.map((d) => (
            <ChoiceCard
              key={d.id}
              name={d.name}
              description={d.description}
              onClick={() => {
                setDirection(d);
                setStage("profile");
              }}
            />
          ))}

        {stage === "profile" &&
          direction?.profiles.map((p) => (
            <ChoiceCard
              key={p.id}
              name={p.name}
              description={p.description}
              onClick={() => {
                setProfile(p);
                setStage("program");
              }}
            />
          ))}

        {stage === "program" &&
          !program &&
          profile?.programs.map((pr) => (
            <ChoiceCard
              key={pr.id}
              name={pr.name}
              description={pr.description}
              extra={`Профессии: ${pr.professions.join(", ")}`}
              onClick={() => setProgram(pr)}
            />
          ))}

        {stage === "program" && program && (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 text-center">
            <p className="text-sm font-medium text-violet-600">Ваш выбор</p>
            <h2 className="mt-1 text-xl font-bold">{program.name}</h2>
            <p className="mt-2 text-sm text-stone-600">{program.description}</p>
            <p className="mt-3 text-sm text-stone-500">
              Профессии: {program.professions.join(", ")}
            </p>
            <Link
              href={`/universities?program=${encodeURIComponent(program.name)}`}
              className="mt-5 inline-block rounded-2xl bg-violet-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              Найти ВУЗы с этой программой →
            </Link>
            <p className="mt-3 text-xs text-stone-400">
              Навигатор откроется с преднастроенным фильтром по программе
            </p>
          </div>
        )}
      </div>

      {/* Назад по иерархии */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            if (stage === "program" && program) setProgram(null);
            else if (stage === "program") setStage("profile");
            else if (stage === "profile") setStage("direction");
            else if (stage === "direction") setStage("industry");
            else if (stage === "industry" && industry) setIndustry(null);
            else setStage("result");
          }}
          className="text-sm text-stone-400 hover:text-stone-600"
        >
          ← Назад
        </button>
      </div>
    </div>
  );
}

function ChoiceCard({
  name,
  description,
  extra,
  onClick,
}: {
  name: string;
  description: string;
  extra?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-stone-200 bg-white p-5 text-left transition hover:border-violet-300 hover:bg-violet-50/40"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="mt-1 text-sm text-stone-600">{description}</p>
          {extra && <p className="mt-2 text-xs text-stone-400">{extra}</p>}
        </div>
        <span className="text-stone-300">→</span>
      </div>
    </button>
  );
}
