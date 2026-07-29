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
        <div className="space-y-2.5">
          {skills.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span
                className={`w-6 font-mono text-xs ${
                  i < 3 ? "font-semibold text-violet-600" : "text-stone-400"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="w-44 text-sm">{s.name}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-stone-200">
                <div
                  className={`h-full rounded-full ${i < 3 ? "bg-violet-600" : "bg-stone-400"}`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <span className="w-7 text-right font-mono text-xs text-stone-500">
                {s.score}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4">
            <Link
              href="/tests/debruce?view=result"
              className="text-sm font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-violet-600"
            >
              Полный результат и рекомендации
            </Link>
            <Link
              href="/tests/debruce"
              className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
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
        <div className="space-y-4">
          {mbtiScales.map((s) => (
            <div key={s.left}>
              <div className="flex justify-between font-mono text-[11px] text-stone-500">
                <span>{s.left}</span>
                <span>{s.right}</span>
              </div>
              <div className="relative mt-1.5 h-1 rounded-full bg-stone-200">
                <div
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600"
                  style={{ left: `${s.value}%` }}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <Link
              href="/tests/mbti?view=result"
              className="text-sm font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-violet-600"
            >
              Полный результат
            </Link>
            <Link
              href="/tests/mbti"
              className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
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
            Последний шаг диагностики (≈ 8 минут). Профиль интересов по шкалам:{" "}
            {hollandScales.map((s) => s.name.toLowerCase()).join(", ")}. После
            прохождения откроется комплексный отчёт ИИ.
          </p>
          <Link
            href="/tests/holland"
            className="mt-4 inline-block rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
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
                    ? "border-stone-900 bg-stone-900 text-white"
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
