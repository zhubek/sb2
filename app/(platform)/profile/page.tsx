"use client";

import { ArrowLeft, Camera, Check, Globe, Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { currentUser } from "@/lib/mock-data";

const PROFILE_KEY = "student-profile";
const LANG_KEY = "student-ui-lang";

type Profile = {
  firstName: string;
  lastName: string;
  grade: string;
  email: string;
};

const defaults: Profile = {
  firstName: currentUser.firstName,
  lastName: currentUser.lastName,
  grade: currentUser.grade,
  email: currentUser.email,
};

// Область, город и школа задаются школой — ученик их не редактирует
const school = {
  region: "г. Астана",
  city: currentUser.city,
  school: currentUser.school,
};

const fieldCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-400";

const lockedCls =
  "mt-1.5 flex items-center justify-between gap-2 rounded-xl border border-stone-100 bg-stone-50 px-4 py-2.5 text-sm text-stone-500";

export default function StudentProfilePage() {
  const [form, setForm] = useState<Profile>(defaults);
  const [lang, setLang] = useState("ru");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) setForm({ ...defaults, ...JSON.parse(stored) });
    const storedLang = localStorage.getItem(LANG_KEY);
    if (storedLang) setLang(storedLang);
  }, []);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(form));
    localStorage.setItem(LANG_KEY, lang);
    setSaved(true);
    // Имя в шапке обновится без перезагрузки
    window.dispatchEvent(new Event("student-profile-updated"));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-stone-700"
        >
          <ArrowLeft size={15} />
          Главная
        </Link>
        <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight">
          Мой профиль
        </h1>
        <p className="mt-1 text-stone-500">
          Эти данные попадают в отчёты и видны вашему профориентатору
        </p>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        {/* Аватар */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-500 text-2xl font-semibold text-white">
              {(form.firstName[0] ?? "") + (form.lastName[0] ?? "")}
            </div>
            <button
              aria-label="Изменить фото"
              className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:text-violet-600"
            >
              <Camera size={14} />
            </button>
          </div>
          <div className="text-sm text-stone-500">
            <p className="font-medium text-stone-700">Фото профиля</p>
            <p className="mt-0.5 text-xs">
              JPG или PNG, до 2 МБ. Пока используются инициалы.
            </p>
          </div>
        </div>

        {/* Поля */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-stone-500">Имя</span>
            <input
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-stone-500">Фамилия</span>
            <input
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-stone-500">Класс</span>
            <input
              value={form.grade}
              onChange={(e) => set("grade", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-stone-500">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>

          {/* Область / город / школа — только чтение, задаются школой */}
          <div className="block">
            <span className="text-xs font-medium text-stone-500">Область</span>
            <div className={lockedCls}>
              {school.region}
              <Lock size={13} className="shrink-0 text-stone-300" />
            </div>
          </div>
          <div className="block">
            <span className="text-xs font-medium text-stone-500">Город</span>
            <div className={lockedCls}>
              {school.city}
              <Lock size={13} className="shrink-0 text-stone-300" />
            </div>
          </div>
          <div className="block sm:col-span-2">
            <span className="text-xs font-medium text-stone-500">Школа</span>
            <div className={lockedCls}>
              {school.school}
              <Lock size={13} className="shrink-0 text-stone-300" />
            </div>
            <p className="mt-1.5 text-xs text-stone-400">
              Область, город и школа привязаны к вашей школьной ссылке — при
              ошибке обратитесь к профориентатору.
            </p>
          </div>

          {/* Язык интерфейса */}
          <div className="block sm:col-span-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <Globe size={12} />
              Язык интерфейса
            </span>
            <div className="mt-1.5 inline-grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-medium">
              {(
                [
                  ["kk", "Қазақша"],
                  ["ru", "Русский"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setLang(key);
                    setSaved(false);
                  }}
                  className={`rounded-lg px-5 py-1.5 transition ${
                    lang === key
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
          >
            {saved && <Check size={15} />}
            {saved ? "Сохранено" : "Сохранить изменения"}
          </button>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
          >
            Отмена
          </Link>
        </div>
      </section>

      {/* Выход из профиля */}
      <section className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-6 py-4">
        <div className="text-sm">
          <p className="font-medium text-stone-700">Выйти из профиля</p>
          <p className="mt-0.5 text-xs text-stone-400">
            Результаты тестов сохранятся — вы сможете войти снова.
          </p>
        </div>
        <button
          onClick={() => signOut({ redirectTo: "/auth" })}
          className="flex items-center gap-2 rounded-2xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={15} />
          Выйти
        </button>
      </section>
    </div>
  );
}
