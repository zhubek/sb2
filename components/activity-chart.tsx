"use client";

import { useState } from "react";
import { activityData, type Period } from "@/lib/teacher-mock-data";

const periods: { key: Period; label: string }[] = [
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
  { key: "quarter", label: "Четверть" },
  { key: "year", label: "Год" },
];

export default function ActivityChart() {
  const [period, setPeriod] = useState<Period>("week");
  const [hover, setHover] = useState<number | null>(null);
  const data = activityData[period];
  const max = Math.max(...data.map((d) => d.value));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Активность учеников</h2>
          <p className="text-sm text-slate-500">
            Действия на платформе: тесты, разделы, AI-чат
          </p>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-medium">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => {
                setPeriod(p.key);
                setHover(null);
              }}
              className={`rounded-lg px-3 py-1.5 transition ${
                period === p.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex h-48 items-end gap-3">
        {data.map((d, i) => (
          <div
            key={d.label}
            className="relative flex flex-1 flex-col items-center gap-2"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {hover === i && (
              <div className="absolute -top-9 z-10 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow">
                {d.label}: {d.value.toLocaleString("ru-RU")}
              </div>
            )}
            <div className="flex h-40 w-full items-end">
              <div
                className={`w-full rounded-t transition-colors ${
                  hover === i ? "bg-teal-700" : "bg-teal-600"
                }`}
                style={{ height: `${(d.value / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{d.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
