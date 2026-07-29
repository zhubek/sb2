"use client";

import { ArrowLeft, Camera, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { currentUser } from "@/lib/mock-data";

const PROFILE_KEY = "student-profile";

type Profile = {
  firstName: string;
  lastName: string;
  grade: string;
  school: string;
  city: string;
  email: string;
  about: string;
};

const defaults: Profile = {
  firstName: currentUser.firstName,
  lastName: currentUser.lastName,
  grade: currentUser.grade,
  school: currentUser.school,
  city: currentUser.city,
  email: currentUser.email,
  about: "Интересуюсь дизайном и психологией. Хочу понять, что мне подходит.",
};

const fieldCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-400";

export default function StudentProfilePage() {
  const [form, setForm] = useState<Profile>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) setForm({ ...defaults, ...JSON.parse(stored) });
  }, []);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(form));
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
          Кабинет
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
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-900 text-2xl font-semibold text-white">
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
            <span className="text-xs font-medium text-stone-500">Школа</span>
            <input
              value={form.school}
              onChange={(e) => set("school", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-stone-500">Город</span>
            <input
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
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
          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-stone-500">О себе</span>
            <textarea
              value={form.about}
              onChange={(e) => set("about", e.target.value)}
              rows={3}
              className={`mt-1.5 resize-none ${fieldCls}`}
            />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            {saved && <Check size={15} />}
            {saved ? "Сохранено" : "Сохранить изменения"}
          </button>
          <Link
            href="/dashboard"
            className="rounded-full border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
          >
            Отмена
          </Link>
        </div>
      </section>
    </div>
  );
}
