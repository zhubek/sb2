"use client";

import { BedDouble, GraduationCap, Plane, Shield } from "lucide-react";
import { useState } from "react";
import { formatPrice, universities } from "@/lib/mock-data";

export default function AdminUniversitiesPage() {
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState<"all" | "kz" | "foreign">("all");

  const filtered = universities.filter((u) => {
    if (scope === "kz" && u.foreign) return false;
    if (scope === "foreign" && !u.foreign) return false;
    if (
      search &&
      !`${u.name} ${u.city}`.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">ВУЗы</h1>
          <p className="mt-1 text-stone-500">
            База университетов навигатора ({universities.length} в демо)
          </p>
        </div>
        <button className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700">
          + Добавить ВУЗ
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск…"
          className="w-64 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm outline-none focus:border-violet-400"
        />
        <div className="flex rounded-xl bg-stone-100 p-1 text-sm font-medium">
          {(
            [
              ["all", "Все"],
              ["kz", "Казахстан"],
              ["foreign", "Зарубежные"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setScope(key)}
              className={`rounded-lg px-3.5 py-1.5 transition ${
                scope === key
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left text-xs text-stone-400">
              <th className="px-5 py-3 font-medium">Университет</th>
              <th className="px-5 py-3 font-medium">Город</th>
              <th className="px-5 py-3 font-medium">Программ</th>
              <th className="px-5 py-3 font-medium">Стоимость</th>
              <th className="px-5 py-3 font-medium">Инфраструктура</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50/60">
                <td className="px-5 py-3.5">
                  <p className="font-medium">{u.shortName}</p>
                  <p className="max-w-56 truncate text-xs text-stone-400">
                    {u.name}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-stone-600">
                  {u.city}
                  {u.foreign && (
                    <span className="ml-1.5 rounded-full bg-sky-50 px-1.5 py-0.5 text-[10px] text-sky-700">
                      зарубеж
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-stone-600">
                  {u.programs.length}
                </td>
                <td className="px-5 py-3.5 text-stone-600">
                  {formatPrice(u.priceFrom)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1 text-xs">
                    {u.dorm && <BedDouble size={14} className="text-stone-400" />}
                    {u.military && <Shield size={14} className="text-stone-400" />}
                    {u.mobility && <Plane size={14} className="text-stone-400" />}
                    {u.grants && <GraduationCap size={14} className="text-stone-400" />}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-xs font-medium text-violet-600 hover:text-violet-700">
                    Изменить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
