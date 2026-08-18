"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  currentUser,
  hollandScales,
  mbtiScales,
  skills,
} from "@/lib/mock-data";

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
      name: "DeBruce",
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
          {/* Только топ-3 навыка, без процентов — остальные в полном результате */}
          <div className="grid gap-2.5 sm:grid-cols-3">
            {skills.slice(0, 3).map((s, i) => (
              <div key={s.id} className="rounded-2xl bg-violet-50 px-4 py-3.5">
                <span className="font-mono text-xs font-semibold text-violet-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-sm font-semibold text-violet-800">{s.name}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-stone-400">
            Полный рейтинг всех навыков — в подробном результате
          </p>
          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/tests/debruce?view=result"
              className="rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              Полный результат и рекомендации
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
      name: "MBTI",
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
          {/* Диаграмма шкал — как в отчёте */}
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
          <div className="flex items-center gap-3 pt-1">
            <Link
              href="/tests/mbti?view=result"
              className="rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              Полный результат и рекомендации
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
      name: "Тест Голланда",
      passed: false,
      preview: (
        <p className="text-sm text-stone-500">
          Определит профессиональные интересы по 6 типам
        </p>
      ),
      expanded: (
        <div>
          <p className="max-w-lg text-sm leading-relaxed text-stone-600">
            Последний шаг диагностики (≈ 8 минут). В результате вы получите свой
            код RIASEC — профиль интересов по шкалам:{" "}
            {hollandScales.map((s) => s.name.toLowerCase()).join(", ")}. После
            прохождения откроется комплексный отчёт ИИ.
          </p>
          <Link
            href="/tests/holland"
            className="mt-4 inline-block rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
          >
            Пройти тест
          </Link>
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
              className="flex w-full cursor-pointer items-center gap-5 py-5"
            >
              <span className="font-display text-sm text-stone-300">
                {row.n}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
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
            {isOpen && <div className="pb-6 pl-11">{row.expanded}</div>}
          </div>
        );
      })}
    </div>
  );
}
