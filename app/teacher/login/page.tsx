"use client";
import { useCopy } from "@/lib/cms/client";


import { ContentText } from "@/lib/cms/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100";

export default function TeacherLoginPage() {
  const pageCopy = useCopy("copy.app.teacher.login.page");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await signIn("teacher", { email, password, redirect: false });
    setBusy(false);
    if (res?.error) {
      setError(true);
      return;
    }
    // Онбординга нет — сразу на Dashboard (ТЗ, раздел 3)
    router.push("/teacher");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
            AI
          </span>
          <div>
            <p className="font-semibold leading-tight"><ContentText id="copy.app.teacher.login.page.001" fallback="ИИ профориентатор" /></p>
            <p className="text-xs text-slate-400"><ContentText id="copy.app.teacher.login.page.002" fallback="Платформа педагога" /></p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="font-semibold"><ContentText id="copy.app.teacher.login.page.003" fallback="Вход для профориентатора" /></h1>
          <p className="mt-1 text-sm text-slate-500">
            <ContentText id="copy.app.teacher.login.page.004" fallback="Используйте учётные данные, выданные администратором платформы." /></p>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <ContentText id="copy.app.teacher.login.page.005" fallback="Неверная почта или пароль." />{" "}
              <button
                type="button"
                onClick={() => setError(false)}
                className="font-medium underline underline-offset-2"
              >
                <ContentText id="copy.app.teacher.login.page.006" fallback="Восстановить доступ" /></button>
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={pageCopy("x001","Рабочая почта")}
              className={inputCls}
            />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={pageCopy("x002","Пароль")}
              className={inputCls}
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {busy ? pageCopy("x003","Входим…") : pageCopy("x004","Войти")}
            </button>
          </form>

          <button className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-600">
            <ContentText id="copy.app.teacher.login.page.007" fallback="Забыли пароль? Восстановить доступ" /></button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          <ContentText id="copy.app.teacher.login.page.008" fallback="Профориентатор привязан к одной школе — все данные ограничены вашей школой ·" />{" "}
          <Link href="/" className="hover:text-slate-600">
            <ContentText id="copy.app.teacher.login.page.009" fallback="Платформа ученика" /></Link>
        </p>
      </div>
    </div>
  );
}
