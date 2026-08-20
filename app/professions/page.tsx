"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import InfoShell from "@/components/info-shell";
import { professionSectors } from "@/lib/info-data";

// Атлас профессий: 12 отраслей, внутри каждой — востребованные профессии
export default function ProfessionsPage() {
  const [open, setOpen] = useState<string | null>(professionSectors[0].id);

  return (
    <InfoShell
      active="/professions"
      eyebrow="Атлас профессий"
      title="Топ профессии по отраслям"
      lede="12 ключевых отраслей экономики Казахстана: востребованные профессии и ориентиры по зарплатам."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {professionSectors.map((s) => {
          const isOpen = open === s.id;
          return (
            <div
              key={s.id}
              className={`self-start rounded-3xl border bg-white transition ${
                isOpen
                  ? "border-violet-300 shadow-[0_16px_40px_rgba(42,46,59,0.08)]"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="flex w-full items-center gap-4 p-6 text-left"
              >
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                  {s.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-lg text-stone-800">
                    {s.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-stone-500">
                    {s.desc}
                  </span>
                </span>
                <ChevronDown
                  size={18}
                  className={`flex-none text-stone-400 transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <ul className="space-y-1 border-t border-stone-100 px-6 py-4">
                  {s.professions.map((p) => (
                    <li
                      key={p.name}
                      className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm transition hover:bg-stone-50"
                    >
                      <span className="font-medium text-stone-700">
                        {p.name}
                      </span>
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
