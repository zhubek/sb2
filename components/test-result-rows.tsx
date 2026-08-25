"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  HollandBars,
  HollandTopTiles,
  MbtiBars,
  TopSkillCards,
} from "@/components/report-blocks";
import { currentUser, hollandScales, skills } from "@/lib/mock-data";

// Раскрывающиеся строки с результатами тестов — редакционный список
export default function TestResultRows() {
  const [open, setOpen] = useState<string | null>(null);

  function toggle(id: string) {
    setOpen(open === id ? null : id);
  }

  const rows = [
    {
      id: "debruce",
      n: "01",
      name: "Мои навыки",
      meth: "Методика НАО им. Ы. Алтынсарина",
      passed: true,
      preview: (
        <p className="text-sm text-stone-500">
          Топ-3:{" "}
          <span className="text-stone-800">
            {skills
              .slice(0, 3)
              .map((s) => s.name)
              .join(" · ")}
          </span>
        </p>
      ),
      expanded: (
        <div>
          {/* Топ-3 способности — нумерация как в отчёте */}
          <TopSkillCards />
          <p className="mt-3 text-xs text-stone-400">
            Полный рейтинг всех навыков — в отчёте
          </p>
          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/tests/debruce/report"
              className="rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              Открыть отчёт
            </Link>
            <Link
              href="/tests/debruce"
              className="rounded-2xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50"
            >
              Перепройти тест
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: "mbti",
      n: "02",
      name: "Мой тип личности",
      meth: "Индикатор типов Майерс — Бриггс (MBTI)",
      passed: true,
      preview: (
        <p className="text-sm text-stone-500">
          <span className="font-semibold text-violet-600">
            {currentUser.mbtiType}
          </span>{" "}
          <span className="text-stone-800">· {currentUser.mbtiTitle}</span>
        </p>
      ),
      expanded: (
        <div className="space-y-5">
          {/* Шкалы от центра — как в отчёте */}
          <MbtiBars />
          <div className="flex items-center gap-3 pt-1">
            <Link
              href="/tests/mbti/report"
              className="rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              Открыть отчёт
            </Link>
            <Link
              href="/tests/mbti"
              className="rounded-2xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50"
            >
              Перепройти тест
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: "holland",
      n: "03",
      name: "Мои интересы",
      meth: "Модель профессиональных интересов Дж. Холланда (RIASEC)",
      passed: true,
      preview: (
        <p className="text-sm text-stone-500">
          Код{" "}
          <span className="font-mono font-semibold tracking-[0.15em] text-violet-600">
            {[...hollandScales]
              .sort((a, b) => b.score - a.score)
              .slice(0, 3)
              .map((s) => s.code)
              .join("")}
          </span>{" "}
          <span className="text-stone-800">
            ·{" "}
            {[...hollandScales].sort((a, b) => b.score - a.score)[0].name} тип
          </span>
        </p>
      ),
      expanded: (
        <div className="space-y-4">
          {/* Диаграмма Голланда — как в отчёте */}
          <HollandTopTiles />
          <HollandBars compact />
          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/tests/holland/report"
              className="rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              Открыть отчёт
            </Link>
            <Link
              href="/tests/holland"
              className="rounded-2xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50"
            >
              Перепройти тест
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="divide-y divide-stone-200 border-t-2 border-b border-stone-900 border-b-stone-200">
      {rows.map((row) => {
        const isOpen = open === row.id;
        return (
          <div key={row.id}>
            <div
              onClick={() => toggle(row.id)}
              className="flex w-full cursor-pointer items-center gap-4 py-5 sm:gap-5"
            >
              <span className="font-display hidden text-sm text-stone-300 sm:block">
                {row.n}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-display font-medium">{row.name}</span>
                  {row.passed ? (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
                      пройден
                    </span>
                  ) : (
                    <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-500">
                      не пройден
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-stone-400">{row.meth}</p>
                <div className="mt-1">{row.preview}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(row.id);
                }}
                aria-label={isOpen ? "Свернуть" : "Подробнее"}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                  isOpen
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-stone-300 text-stone-500 hover:border-stone-900 hover:text-stone-900"
                }`}
              >
                <ChevronDown
                  className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            {isOpen && <div className="pb-6 sm:pl-11">{row.expanded}</div>}
          </div>
        );
      })}
    </div>
  );
}
