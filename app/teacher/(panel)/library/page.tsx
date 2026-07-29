"use client";

import { Download, FileText, Search } from "lucide-react";
import { useState } from "react";
import { librarySections } from "@/lib/teacher-mock-data";

export default function LibraryPage() {
  const [active, setActive] = useState(librarySections[0].id);
  const [search, setSearch] = useState("");

  const section = librarySections.find((s) => s.id === active)!;
  const q = search.toLowerCase();
  const items = search
    ? librarySections
        .flatMap((s) => s.items.map((i) => ({ ...i, section: s.title })))
        .filter((i) => i.name.toLowerCase().includes(q))
    : section.items.map((i) => ({ ...i, section: section.title }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Библиотека
          </h1>
          <p className="mt-1 text-slate-500">
            Материалы, задания и курсы для профориентационной работы
          </p>
        </div>
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по материалам…"
            className="w-64 rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:border-teal-400"
          />
        </div>
      </div>

      {/* Разделы */}
      {!search && (
        <div className="grid gap-3 sm:grid-cols-3">
          {librarySections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`rounded-xl border p-4 text-left transition ${
                active === s.id
                  ? "border-teal-600 bg-teal-50/60"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-medium">{s.title}</p>
              <p className="mt-1 text-xs leading-snug text-slate-500">
                {s.desc}
              </p>
              <p className="mt-2 font-mono text-[11px] text-slate-400">
                {s.items.length} материала
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Материалы */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">
          {search ? `Результаты поиска · ${items.length}` : section.title}
        </h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {items.map((i) => (
            <li key={i.name} className="flex items-center gap-3 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <FileText size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{i.name}</p>
                <p className="font-mono text-xs text-slate-400">
                  {i.type} · {i.length}
                  {search && ` · ${i.section}`}
                </p>
              </div>
              <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-teal-600 hover:text-teal-700">
                <Download size={13} />
                Открыть
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-8 text-center text-sm text-slate-400">
              Ничего не найдено
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
