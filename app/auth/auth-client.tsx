"use client";
import { useCopy } from "@/lib/cms/client";

import { useContent } from "@/lib/cms/client";

import { ContentText } from "@/lib/cms/client";


import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { LogoMark } from "@/components/compass-marks";
import { apiSafe, backendUserId } from "@/lib/api";
import { requestOtp } from "@/lib/auth-actions";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

// Литера класса — русский алфавит (без Ё, Й, Ъ, Ь)
const letters = [
  "А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К", "Л", "М", "Н", "О", "П",
  "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ы", "Э", "Ю", "Я",
];

const inlineDefault_letters = letters;

function GoogleIcon() {
  return (
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
  );
}

export default function AuthClient({ googleEnabled }: { googleEnabled: boolean }) {
  const pageCopy = useCopy("copy.app.auth.auth-client");
  const letters = useContent("inline.app.auth.auth-client.letters", inlineDefault_letters);
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";

  const [mode, setMode] = useState<"login" | "register">("register");
  // Регистрация в 3 шага: почта/Google → код подтверждения → личные данные.
  // Вход — те же шаги 1–2 и сразу в кабинет.
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // Демо: почтовый сервис не подключён, код показываем прямо на экране
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function switchMode(m: "login" | "register") {
    setMode(m);
    setStep(1);
    setCode("");
    setError(null);
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await requestOtp(email);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDemoCode(res.demoCode);
    setCode("");
    setStep(2);
  }

  // Регистрация без проверки почты (дев-режим): аккаунт создаётся сразу,
  // шаг с кодом пропускается — используем универсальный код 000000
  async function registerNow(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("otp", { email, code: "000000", redirect: false });
    setBusy(false);
    if (res?.error) {
      setError(pageCopy("x001","Не удалось создать аккаунт. Проверьте адрес почты."));
      return;
    }
    setStep(3);
  }

  function google() {
    if (!googleEnabled) {
      setError(
        pageCopy("x002","Вход через Google появится после настройки OAuth (AUTH_GOOGLE_ID и AUTH_GOOGLE_SECRET в .env).")
      );
      return;
    }
    signIn("google", {
      redirectTo: mode === "login" ? callbackUrl : "/onboarding",
    });
  }

  async function confirmCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("otp", { email, code, redirect: false });
    setBusy(false);
    if (res?.error) {
      setError(pageCopy("x003","Неверный или устаревший код. Запросите новый и попробуйте ещё раз."));
      return;
    }
    if (mode === "login") {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setStep(3);
    }
  }

  async function finish(e: React.FormEvent) {
    e.preventDefault();
    // Имя показывается в шапке кабинета (профиль пока живёт в localStorage)
    try {
      const stored = JSON.parse(localStorage.getItem("student-profile") || "{}");
      localStorage.setItem(
        "student-profile",
        JSON.stringify({ ...stored, firstName, lastName })
      );
      window.dispatchEvent(new Event("student-profile-updated"));
    } catch {}
    // Имя и фамилия — в профиль пользователя в бекенде
    const uid = await backendUserId();
    if (uid) {
      apiSafe(`/users/${uid}`, {
        method: "PATCH",
        body: JSON.stringify({ name: firstName, surname: lastName }),
      });
    }
    router.push("/onboarding");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="fixed bottom-5 right-5 z-20"><Link href="/login" className="rounded-xl bg-white px-4 py-3 text-sm text-violet-700 shadow-md border">Вход по паролю →</Link></div>
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="font-display mb-8 flex items-center justify-center gap-2 text-sm tracking-tight"
        >
          <LogoMark className="h-7 w-7" />
          <span><ContentText id="copy.app.auth.auth-client.001" fallback="профориентатор" /><span className="text-violet-600">.</span></span>
        </Link>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          {/* Табы */}
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-medium">
            {(
              [
                ["register", pageCopy("x004","Регистрация")],
                ["login", pageCopy("x005","Вход")],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
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

          {/* Индикатор шагов: регистрация — почта → о себе (без кода, дев-режим);
              вход — почта → код */}
          <div className="mb-6 flex items-center gap-2">
            {(mode === "register"
              ? [
                  { n: 1, label: pageCopy("x006","Почта") },
                  { n: 3, label: pageCopy("x007","О себе") },
                ]
              : [
                  { n: 1, label: pageCopy("x008","Почта") },
                  { n: 2, label: pageCopy("x009","Код") },
                ]
            ).map((s, i) => (
              <div key={s.n} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-semibold transition ${
                    s.n < step
                      ? "bg-teal-500 text-white"
                      : s.n === step
                        ? "bg-violet-500 text-white"
                        : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {s.n < step ? "✓" : i + 1}
                </span>
                <span
                  className={`hidden text-xs sm:block ${
                    s.n === step ? "font-medium text-stone-700" : "text-stone-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Шаг 1: почта или Google */}
          {step === 1 && (
            <>
              <button
                data-cms-navigation="true" onClick={google}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 py-2.5 text-sm font-medium transition hover:bg-stone-50 ${
                  googleEnabled ? "" : "opacity-60"
                }`}
              >
                <GoogleIcon />
                <ContentText id="copy.app.auth.auth-client.002" fallback="Продолжить с Google" /></button>
              <div className="my-5 flex items-center gap-3 text-xs text-stone-400">
                <div className="h-px flex-1 bg-stone-100" />
                <ContentText id="copy.app.auth.auth-client.003" fallback="или через почту" /><div className="h-px flex-1 bg-stone-100" />
              </div>
              <form
                onSubmit={mode === "register" ? registerNow : sendCode}
                className="space-y-3"
              >
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={pageCopy("x010","Электронная почта")}
                  className={inputCls}
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-2xl bg-violet-500 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600 disabled:opacity-60"
                >
                  {busy
                    ? mode === "register"
                      ? pageCopy("x011","Создаём…")
                      : pageCopy("x012","Отправляем…")
                    : mode === "register"
                      ? pageCopy("x013","Продолжить")
                      : pageCopy("x014","Получить код")}
                </button>
                {mode === "register" && (
                  <p className="text-center text-xs text-stone-400">
                    <ContentText id="copy.app.auth.auth-client.004" fallback="Дев-режим: почта не проверяется, аккаунт создаётся сразу" /></p>
                )}
              </form>
            </>
          )}

          {/* Шаг 2: код подтверждения */}
          {step === 2 && (
            <form onSubmit={confirmCode} className="space-y-4">
              <p className="text-sm text-stone-600">
                <ContentText id="copy.app.auth.auth-client.005" fallback="Мы отправили 6-значный код на" />{" "}
                <span className="font-medium text-stone-800">{email}</span><ContentText id="copy.app.auth.auth-client.006" fallback=". Введите его, чтобы подтвердить адрес." /></p>
              {demoCode && (
                <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
                  <ContentText id="copy.app.auth.auth-client.007" fallback="Демо-режим: почтовый сервис не подключён, ваш код —" />{" "}
                  <span className="font-mono font-semibold tracking-widest">{demoCode}</span>
                </p>
              )}
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="••••••"
                className={`${inputCls} text-center font-mono text-lg tracking-[0.5em]`}
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-2xl bg-violet-500 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600 disabled:opacity-60"
              >
                {busy ? pageCopy("x015","Проверяем…") : pageCopy("x016","Подтвердить")}
              </button>
              <div className="flex justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError(null);
                  }}
                  className="text-stone-400 transition hover:text-stone-600"
                >
                  <ContentText id="copy.app.auth.auth-client.008" fallback="← Изменить почту" /></button>
                <button
                  type="button"
                  onClick={(e) => sendCode(e)}
                  className="text-violet-600 transition hover:text-violet-700"
                >
                  <ContentText id="copy.app.auth.auth-client.009" fallback="Отправить код ещё раз" /></button>
              </div>
            </form>
          )}

          {/* Шаг 3: личные данные (только регистрация) */}
          {step === 3 && (
            <form onSubmit={finish} className="space-y-3">
              <p className="rounded-xl bg-teal-50 px-4 py-2.5 text-xs text-teal-700">
                <ContentText id="copy.app.auth.auth-client.010" fallback="Аккаунт для " />{email} <ContentText id="copy.app.auth.auth-client.011" fallback=" создан — осталось рассказать о себе" /></p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder={pageCopy("x017","Имя")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputCls}
                />
                <input
                  required
                  placeholder={pageCopy("x018","Фамилия")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select required defaultValue="" className={inputCls}>
                  <option value="" disabled>
                    {pageCopy("x019","Класс")}</option>
                  {["7", "8", "9", "10", "11", "12"].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <select required defaultValue="" className={inputCls}>
                  <option value="" disabled>
                    {pageCopy("x020","Литера")}</option>
                  {letters.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-500">
                <ContentText id="copy.app.auth.auth-client.012" fallback="Область: " /><span className="text-stone-700"><ContentText id="copy.app.auth.auth-client.013" fallback="г. Астана" /></span> <ContentText id="copy.app.auth.auth-client.014" fallback=" · Город:" />{" "}
                <span className="text-stone-700"><ContentText id="copy.app.auth.auth-client.015" fallback="Астана" /></span> <ContentText id="copy.app.auth.auth-client.016" fallback=" · Школа:" />{" "}
                <span className="text-stone-700"><ContentText id="copy.app.auth.auth-client.017" fallback="НИШ ФМН Астана" /></span>
                <span className="mt-1 block text-stone-400">
                  <ContentText id="copy.app.auth.auth-client.018" fallback="Определено автоматически по ссылке школы" /></span>
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-violet-500 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
              >
                <ContentText id="copy.app.auth.auth-client.019" fallback="Создать аккаунт" /></button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-stone-400">
          <ContentText id="copy.app.auth.auth-client.020" fallback="Продолжая, вы соглашаетесь с условиями использования платформы" /></p>
      </div>
    </div>
  );
}
