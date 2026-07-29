"use client";

import Link from "next/link";
import { LogoMark } from "@/components/compass-marks";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Мок: регистрация ведёт в онбординг, повторный вход — сразу в кабинет
    router.push(mode === "register" ? "/onboarding" : "/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="font-display mb-8 flex items-center justify-center gap-2 text-sm font-semibold tracking-tight"
        >
          <LogoMark className="h-7 w-7" />
          <span>профориентатор<span className="text-violet-600">.</span></span>
        </Link>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          {/* Табы */}
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-medium">
            {(
              [
                ["register", "Регистрация"],
                ["login", "Вход"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`rounded-lg py-2 transition ${
                  mode === key
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={submit}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 py-2.5 text-sm font-medium transition hover:bg-stone-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Продолжить с Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-stone-400">
            <div className="h-px flex-1 bg-stone-100" />
            или через почту
            <div className="h-px flex-1 bg-stone-100" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "register" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="Имя" className={inputCls} />
                  <input required placeholder="Фамилия" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select required defaultValue="" className={inputCls}>
                    <option value="" disabled>
                      Класс
                    </option>
                    {["7", "8", "9", "10", "11", "12"].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                  <input required placeholder="Литера (напр. Б)" className={inputCls} />
                </div>
                <div className="rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-500">
                  Область: <span className="text-stone-700">г. Астана</span> · Город:{" "}
                  <span className="text-stone-700">Астана</span> · Школа:{" "}
                  <span className="text-stone-700">НИШ ФМН Астана</span>
                  <span className="mt-1 block text-stone-400">
                    Определено автоматически по ссылке школы
                  </span>
                </div>
              </>
            )}
            <input
              required
              type="email"
              placeholder="Электронная почта"
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
              className="w-full rounded-full bg-stone-900 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              {mode === "register" ? "Создать аккаунт" : "Войти"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-stone-400">
          Продолжая, вы соглашаетесь с условиями использования платформы
        </p>
      </div>
    </div>
  );
}
