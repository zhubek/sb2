"use client";

import { Download, FileText, Search } from "lucide-react";
import { useState } from "react";
import { type TeacherReport, teacherReports } from "@/lib/teacher-mock-data";

type SourceFilter = "all" | "manual" | "auto";
type LevelFilter = "all" | TeacherReport["level"];

const selectCls =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-400";

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<SourceFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const filtered = teacherReports.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (source !== "all" && r.source !== source) return false;
    if (level !== "all" && r.level !== level) return false;
    return true;
  });

  function download(id: string) {
    setDownloaded(id);
    setTimeout(() => setDownloaded(null), 2500);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Отчёты
        </h1>
        <p className="mt-1 text-slate-500">
          Все сгенерированные отчёты — созданные вручную и сформированные
          системой автоматически
        </p>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative w-full sm:w-auto">
          <Search
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm outline-none transition focus:border-teal-400 sm:w-64"
          />
        </div>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as SourceFilter)}
          className={selectCls}
        >
          <option value="all">Все типы</option>
          <option value="manual">Созданные вручную</option>
          <option value="auto">Автоматические</option>
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as LevelFilter)}
          className={selectCls}
        >
          <option value="all">Все уровни</option>
          <option value="Школа">Школа</option>
          <option value="Класс">Класс</option>
          <option value="Ученик">Ученик</option>
        </select>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Найдено отчётов: {filtered.length}</h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {filtered.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <FileText size={16} />
              </span>
              <div className="min-w-0 flex-1 basis-[12rem]">
                <p className="truncate text-sm font-medium">{r.title}</p>
                <p className="font-mono text-xs text-slate-400">
                  {r.level} · {r.date} · {r.size}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  r.source === "auto"
                    ? "bg-slate-100 text-slate-500"
                    : "bg-teal-50 text-teal-700"
                }`}
              >
                {r.source === "auto" ? "Автоматически" : "Вручную"}
              </span>
              <span className="ml-auto flex sm:hidden" />
              <button
                onClick={() => download(r.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition ${
                  downloaded === r.id
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-600 hover:border-teal-600 hover:text-teal-700"
                }`}
              >
                <Download size={13} />
                {downloaded === r.id ? "Скачан (демо)" : "Скачать"}
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-8 text-center text-sm text-slate-400">
              По заданным фильтрам отчёты не найдены
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
