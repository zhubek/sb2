"use client";

import { useState } from "react";
import ActivityChart from "@/components/activity-chart";
import AnalyticsTabs from "@/components/analytics-tabs";
import BarList from "@/components/bar-list";
import ReportButton from "@/components/report-button";
import {
  type Period,
  periodSummary,
  popularProfessions,
  schoolClasses,
  schoolInterests,
  schoolStats,
  teacher,
} from "@/lib/teacher-mock-data";

const periods: { key: Period; label: string }[] = [
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
  { key: "quarter", label: "Четверть" },
  { key: "year", label: "Год" },
];

export default function SchoolAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("quarter");
  const summary = periodSummary[period];

  const tests = [
    { name: "1-й тест · DeBruce", value: schoolStats.test1 },
    { name: "2-й тест · MBTI", value: schoolStats.test2 },
    { name: "3-й тест · Голланд", value: schoolStats.test3 },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Аналитика · уровень «Школа»</p>
          <h1 className="mt-0.5 text-2xl font-bold">{teacher.school}</h1>
          <p className="mt-1 text-slate-500">
            {schoolStats.registered} из {schoolStats.total} учеников на
            платформе
          </p>
        </div>
        <ReportButton label="Скачать отчёт по школе" />
      </div>

      <AnalyticsTabs />

      {/* Сводка за период */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Сводка за период</h2>
            <p className="text-sm text-slate-500">
              Общие показатели школы за выбранный период времени
            </p>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-medium">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
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
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-2xl font-bold">{summary.active}</p>
            <p className="mt-1 text-sm text-slate-500">Активных учеников</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{summary.testsDone}</p>
            <p className="mt-1 text-sm text-slate-500">Пройдено тестов</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {summary.aiSessions.toLocaleString("ru-RU")}
            </p>
            <p className="mt-1 text-sm text-slate-500">Диалогов с AI</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{summary.newRegs}</p>
            <p className="mt-1 text-sm text-slate-500">Новых регистраций</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Распределение интересов */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Распределение интересов</h2>
          <p className="text-sm text-slate-500">
            Выбор отраслей учениками после теста DeBruce
          </p>
          <div className="mt-5">
            <BarList data={schoolInterests} />
          </div>
        </section>

        {/* Популярные профессии */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Популярные профессии</h2>
          <p className="text-sm text-slate-500">
            По итогам рекомендаций и выбора учеников
          </p>
          <div className="mt-5">
            <BarList data={popularProfessions} />
          </div>
        </section>

        {/* Прохождение тестов */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Прохождение тестов</h2>
          <p className="text-sm text-slate-500">
            Из {schoolStats.registered} зарегистрированных
          </p>
          <div className="mt-5 space-y-4">
            {tests.map((t) => (
              <div key={t.name}>
                <div className="flex justify-between text-sm">
                  <span>{t.name}</span>
                  <span className="font-medium text-slate-600">
                    {t.value} ·{" "}
                    {Math.round((t.value / schoolStats.registered) * 100)}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{
                      width: `${(t.value / schoolStats.registered) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Направления подготовки */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Направления подготовки</h2>
          <p className="text-sm text-slate-500">
            Ведущие направления по классам
          </p>
          <ul className="mt-4 divide-y divide-slate-100">
            {schoolClasses.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <span className="text-slate-500">{c.name}</span>
                <span className="font-medium">{c.topDirection}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Динамика активности */}
      <ActivityChart />
    </div>
  );
}
