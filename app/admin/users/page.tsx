"use client";

import { useState } from "react";
import { adminUsers } from "@/lib/mock-data";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const filtered = adminUsers.filter((u) =>
    `${u.name} ${u.email} ${u.school} ${u.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Ученики</h1>
          <p className="mt-1 text-stone-500">
            {adminUsers.length} зарегистрированных (мок-данные)
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени, школе, городу…"
          className="w-72 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm outline-none focus:border-violet-400"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left text-xs text-stone-400">
              <th className="px-5 py-3 font-medium">Ученик</th>
              <th className="px-5 py-3 font-medium">Школа</th>
              <th className="px-5 py-3 font-medium">Класс</th>
              <th className="px-5 py-3 font-medium">Город</th>
              <th className="px-5 py-3 font-medium">Прогресс тестов</th>
              <th className="px-5 py-3 font-medium">Регистрация</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50/60">
                <td className="px-5 py-3.5">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-stone-400">{u.email}</p>
                </td>
                <td className="px-5 py-3.5 text-stone-600">{u.school}</td>
                <td className="px-5 py-3.5 text-stone-600">{u.grade}</td>
                <td className="px-5 py-3.5 text-stone-600">{u.city}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`h-2 w-5 rounded-full ${
                            i < u.testsPassed ? "bg-violet-600" : "bg-stone-100"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-stone-400">
                      {u.testsPassed}/3
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-stone-400">{u.registeredAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-stone-400">
            Никого не найдено
          </p>
        )}
      </div>
    </div>
  );
}
