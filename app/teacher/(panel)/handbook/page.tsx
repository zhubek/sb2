"use client";

import { useState } from "react";
import UniversityExplorer from "@/components/university-explorer";
import { colleges, eduPrograms } from "@/lib/teacher-mock-data";

type Tab = "universities" | "colleges" | "programs";

const tabs: { key: Tab; label: string }[] = [
  { key: "universities", label: "Университеты" },
  { key: "colleges", label: "Колледжи" },
  { key: "programs", label: "Образовательные программы" },
];

export default function HandbookPage() {
  const [tab, setTab] = useState<Tab>("universities");
  const [search, setSearch] = useState("");
  const [openProgram, setOpenProgram] = useState<string | null>(null);

  const q = search.toLowerCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Справочник образования</h1>
        <p className="mt-1 text-slate-500">
          Единый каталог, синхронизированный с ученической платформой — вы
          видите те же данные, что и ученики
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-medium">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSearch("");
              }}
              className={`rounded-lg px-4 py-2 transition ${
                tab === t.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab !== "universities" && (
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск…"
            className="w-64 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-teal-400"
          />
        )}
      </div>

      {/* Университеты — тот же UX, что и у учеников, в палитре педагога */}
      {tab === "universities" && (
        <UniversityExplorer
          tone="teal"
          detailBase="/teacher/handbook/university"
          savable={false}
        />
      )}

      {/* Колледжи */}
      {tab === "colleges" && (
        <div className="space-y-4">
          {colleges
            .filter((c) => `${c.name} ${c.city}`.toLowerCase().includes(q))
            .map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{c.name}</h2>
                    <p className="mt-0.5 text-sm text-slate-400">{c.city}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                    Колледж
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Специальности
                    </p>
                    <ul className="mt-1.5 space-y-1 text-sm text-slate-700">
                      {c.specialties.map((s) => (
                        <li key={s}>· {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Условия поступления
                    </p>
                    <p className="mt-1.5 text-sm text-slate-700">
                      {c.admission}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Контакты
                    </p>
                    <p className="mt-1.5 text-sm text-slate-700">📍 {c.address}</p>
                    <p className="text-sm text-slate-700">📞 {c.phone}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Образовательные программы */}
      {tab === "programs" && (
        <div className="space-y-3">
          {eduPrograms
            .filter((p) =>
              `${p.code} ${p.name} ${p.direction}`.toLowerCase().includes(q)
            )
            .map((p) => {
              const open = openProgram === p.id;
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200 bg-white"
                >
                  <button
                    onClick={() => setOpenProgram(open ? null : p.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="rounded-lg bg-teal-50 px-2.5 py-1 font-mono text-xs font-medium text-teal-700">
                        {p.code}
                      </span>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.direction}</p>
                      </div>
                    </div>
                    <span
                      className={`text-slate-400 transition ${open ? "rotate-90" : ""}`}
                    >
                      ›
                    </span>
                  </button>
                  {open && (
                    <div className="space-y-4 border-t border-slate-100 px-6 py-5">
                      <p className="text-sm leading-relaxed text-slate-600">
                        {p.description}
                      </p>
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Профессии после окончания
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.professions.map((prof) => (
                            <span
                              key={prof}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                            >
                              {prof}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Вузы, реализующие программу
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.universities.map((un) => (
                            <span
                              key={un}
                              className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-700"
                            >
                              {un}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
