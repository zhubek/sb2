"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Мок ветвления: почта не с домена школы → ошибка входа
    if (email && !email.includes("@")) return;
    if (email.endsWith("@wrong.kz")) {
      setError(true);
      return;
    }
    // Онбординга нет — сразу на Dashboard (ТЗ, раздел 3)
    router.push("/teacher");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
            AI
          </span>
          <div>
            <p className="font-semibold leading-tight">ИИ профориентатор</p>
            <p className="text-xs text-slate-400">Платформа педагога</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="font-semibold">Вход для профориентатора</h1>
          <p className="mt-1 text-sm text-slate-500">
            Используйте учётные данные, выданные администратором платформы.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Неверная почта или пароль.{" "}
              <button
                type="button"
                onClick={() => setError(false)}
                className="font-medium underline underline-offset-2"
              >
                Восстановить доступ
              </button>
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Рабочая почта"
              className={inputCls}
            />
            <input
              required
              type="password"
              placeholder="Пароль"
              className={inputCls}
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              Войти
            </button>
          </form>

          <button className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-600">
            Забыли пароль? Восстановить доступ
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Профориентатор привязан к одной школе — все данные ограничены вашей
          школой ·{" "}
          <Link href="/" className="hover:text-slate-600">
            Платформа ученика
          </Link>
        </p>
      </div>
    </div>
  );
}
