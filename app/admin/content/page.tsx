"use client";

import { Folder } from "lucide-react";
import { useState } from "react";
import { recommendedIndustries } from "@/lib/mock-data";

export default function AdminContentPage() {
  const [openIndustry, setOpenIndustry] = useState<string | null>(
    recommendedIndustries[0].id
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Отрасли и программы</h1>
          <p className="mt-1 text-stone-500">
            Иерархия рекомендаций: отрасль → направление → профиль →
            образовательная программа
          </p>
        </div>
        <button className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700">
          + Добавить отрасль
        </button>
      </div>

      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
        Показаны 3 отрасли из 16 (мок-данные демо-версии).
      </p>

      <div className="space-y-3">
        {recommendedIndustries.map((ind) => {
          const open = openIndustry === ind.id;
          return (
            <div
              key={ind.id}
              className="rounded-2xl border border-stone-200 bg-white"
            >
              <button
                onClick={() => setOpenIndustry(open ? null : ind.id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <div>
                  <h2 className="font-semibold">{ind.name}</h2>
                  <p className="text-sm text-stone-500">{ind.description}</p>
                </div>
                <span
                  className={`text-stone-400 transition ${open ? "rotate-90" : ""}`}
                >
                  ›
                </span>
              </button>

              {open && (
                <div className="space-y-4 border-t border-stone-100 px-6 py-5">
                  {ind.directions.map((dir) => (
                    <div key={dir.id}>
                      <p className="text-sm font-semibold text-stone-700">
                        <Folder size={14} className="mr-1.5 -mt-0.5 inline text-stone-400" />{dir.name}
                      </p>
                      <div className="mt-2 ml-5 space-y-3 border-l border-stone-100 pl-4">
                        {dir.profiles.map((prof) => (
                          <div key={prof.id}>
                            <p className="text-sm font-medium text-stone-600">
                              {prof.name}
                            </p>
                            <ul className="mt-1.5 space-y-1.5">
                              {prof.programs.map((prog) => (
                                <li
                                  key={prog.id}
                                  className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2"
                                >
                                  <div>
                                    <p className="text-sm">{prog.name}</p>
                                    <p className="text-xs text-stone-400">
                                      {prog.professions.join(" · ")}
                                    </p>
                                  </div>
                                  <button className="text-xs font-medium text-violet-600 hover:text-violet-700">
                                    Изменить
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
