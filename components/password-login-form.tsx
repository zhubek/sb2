"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";

export function PasswordLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
    <form className="w-full max-w-md space-y-5 rounded-2xl border bg-white p-8 shadow-sm" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError("");
      try {
        const result = await signIn("password", { email, password, redirect: false });
        if (result?.error) { setError("Неверная почта или пароль. Проверьте данные и попробуйте снова."); return; }
        const session = await getSession();
        if (!session?.user) { setError("Не удалось войти. Попробуйте снова."); return; }
        window.location.assign(session.user.contentAdmin ? "/admin" : session.user.role === "teacher" ? "/teacher" : "/dashboard");
      } catch { setError("Сервер недоступен. Попробуйте позже."); }
      finally { setBusy(false); }
    }}>
      <Link href="/" className="font-semibold text-violet-700">Smart Bolashaq</Link>
      <h1 className="text-2xl font-semibold">Вход в аккаунт</h1>
      <p className="text-sm text-slate-500">Используйте выданные вам почту и пароль.</p>
      <label className="block text-sm">Электронная почта<input className="mt-2 w-full rounded-xl border p-3" disabled={!ready || busy} type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label className="block text-sm">Пароль<input className="mt-2 w-full rounded-xl border p-3" disabled={!ready || busy} type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button disabled={busy || !ready} className="w-full rounded-xl bg-violet-600 p-3 font-medium text-white disabled:opacity-50">{busy ? "Входим…" : "Войти"}</button>
      <Link href="/auth" className="block text-sm text-violet-700">Регистрация ученика →</Link>
    </form>
  </main>;
}
