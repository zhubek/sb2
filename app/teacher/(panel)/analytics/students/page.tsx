"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AnalyticsTabs from "@/components/analytics-tabs";
import { schoolClasses, teacherStudents } from "@/lib/teacher-mock-data";

type TestFilter = "all" | "full" | "partial" | "none";

const testFilters: { key: TestFilter; label: string }[] = [
  { key: "all", label: "Все результаты" },
  { key: "full", label: "Полный профиль (3/3)" },
  { key: "partial", label: "Частично (1–2 теста)" },
  { key: "none", label: "Не начали" },
];

const selectCls =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-400";

export default function StudentsAnalyticsPage() {
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("all");
  const [grade, setGrade] = useState("all");
  const [tests, setTests] = useState<TestFilter>("all");

  const grades = [...new Set(teacherStudents.map((s) => s.grade))].sort();

  const filtered = teacherStudents.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (classId !== "all" && s.classId !== classId) return false;
    if (grade !== "all" && s.grade !== Number(grade)) return false;
    if (tests === "full" && s.testsPassed !== 3) return false;
    if (tests === "partial" && (s.testsPassed === 0 || s.testsPassed === 3))
      return false;
    if (tests === "none" && s.testsPassed !== 0) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm text-slate-400">Аналитика · уровень «Ученики»</p>
        <h1 className="mt-0.5 text-2xl font-bold">Ученики</h1>
        <p className="mt-1 text-slate-500">
          Все ученики школы · отчёт по каждому доступен в его карточке
        </p>
      </div>

      <AnalyticsTabs />

      {/* Фильтры и поиск */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени и фамилии…"
            className="w-64 rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm outline-none transition focus:border-teal-400"
          />
        </div>
        <select
          value={grade}
          onChange={(e) => {
            setGrade(e.target.value);
            setClassId("all");
          }}
          className={selectCls}
        >
          <option value="all">Все параллели</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              {g}-я параллель
            </option>
          ))}
        </select>
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className={selectCls}
        >
          <option value="all">Все классы</option>
          {schoolClasses
            .filter((c) => grade === "all" || c.name.startsWith(grade))
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <select
          value={tests}
          onChange={(e) => setTests(e.target.value as TestFilter)}
          className={selectCls}
        >
          {testFilters.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">
          Найдено учеников: {filtered.length}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium">Ученик</th>
                <th className="py-2.5 pr-4 font-medium">Класс</th>
                <th className="py-2.5 pr-4 font-medium">Тесты</th>
                <th className="py-2.5 pr-4 font-medium">Отрасль</th>
                <th className="py-2.5 pr-4 font-medium">Активность</th>
                <th className="py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/teacher/analytics/student/${s.id}`}
                      className="font-medium hover:text-teal-700"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{s.className}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className={`h-2 w-5 rounded-full ${
                              i < s.testsPassed ? "bg-teal-600" : "bg-slate-100"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {s.testsPassed}/3
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {s.topIndustry ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{s.lastActive}</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/teacher/analytics/student/${s.id}`}
                      className="text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                      Карточка →
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    По заданным фильтрам ученики не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
