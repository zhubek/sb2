"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import InfoShell from "@/components/info-shell";
import { workingCategories } from "@/lib/info-data";

// Рабочие профессии Казахстана: 9 отраслей со списками профессий и зарплатами
export default function WorkingProfessionsPage() {
  const [open, setOpen] = useState<string | null>(workingCategories[0].id);

  return (
    <InfoShell
      active="/workingprofessionsgen"
      eyebrow="Справочник"
      title="Рабочие профессии в Казахстане"
      lede="Востребованные рабочие специальности по отраслям: чем занимаются и сколько зарабатывают. Многим из них учат в колледжах — на базе 9 или 11 классов."
    >
      <div className="mx-auto max-w-3xl space-y-3">
        {workingCategories.map((c) => {
          const isOpen = open === c.id;
          return (
            <div
              key={c.id}
              className={`rounded-3xl border bg-white transition ${
                isOpen
                  ? "border-violet-300 shadow-[0_16px_40px_rgba(42,46,59,0.08)]"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="flex w-full items-center gap-4 px-6 py-5 text-left"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-violet-50 text-xl">
                  {c.icon}
                </span>
                <span className="font-display flex-1 text-lg text-stone-800">
                  {c.name}
                </span>
                <span className="flex-none rounded-full bg-stone-100 px-2.5 py-1 font-mono text-xs text-stone-500">
                  {c.professions.length}
                </span>
                <ChevronDown
                  size={18}
                  className={`flex-none text-stone-400 transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <ul className="divide-y divide-stone-50 border-t border-stone-100 px-6 py-2">
                  {c.professions.map((p) => (
                    <li
                      key={p.name}
                      className="flex items-start justify-between gap-4 py-3.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-700">
                          {p.name}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                          {p.desc}
                        </p>
                      </div>
                      <span className="flex-none font-mono text-xs text-stone-400">
                        {p.salary}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-xs text-stone-400">
        Диапазоны зарплат — ориентировочные, по открытым данным рынка труда
        Казахстана.
      </p>
    </InfoShell>
  );
}
