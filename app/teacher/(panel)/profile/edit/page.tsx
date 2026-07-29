"use client";

import { ArrowLeft, Camera, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { teacher } from "@/lib/teacher-mock-data";

const PROFILE_KEY = "teacher-profile";

type Profile = {
  firstName: string;
  lastName: string;
  role: string;
  school: string;
  city: string;
  email: string;
  phone: string;
  about: string;
};

const defaults: Profile = {
  firstName: teacher.firstName,
  lastName: teacher.lastName,
  role: teacher.role,
  school: teacher.school,
  city: teacher.city,
  email: teacher.email,
  phone: "+7 701 245 18 90",
  about:
    "Помогаю ученикам 8–11 классов осознанно выбирать профессию. Веду профориентационные консультации с 2018 года.",
};

const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-400";

export default function ProfileEditPage() {
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
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/teacher/profile"
          className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft size={15} />
          Личный кабинет
        </Link>
        <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight">
          Редактирование профиля
        </h1>
        <p className="mt-1 text-slate-500">
          Эти данные видят ученики и родители при записи на консультацию
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        {/* Аватар */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
              {(form.firstName[0] ?? "") + (form.lastName[0] ?? "")}
            </div>
            <button
              aria-label="Изменить фото"
              className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-teal-600"
            >
              <Camera size={14} />
            </button>
          </div>
          <div className="text-sm text-slate-500">
            <p className="font-medium text-slate-700">Фото профиля</p>
            <p className="mt-0.5 text-xs">
              JPG или PNG, до 2 МБ. Пока используются инициалы.
            </p>
          </div>
        </div>

        {/* Поля */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Имя</span>
            <input
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Фамилия</span>
            <input
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">
              Должность
            </span>
            <input
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Школа</span>
            <input
              value={form.school}
              onChange={(e) => set("school", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Город</span>
            <input
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Телефон</span>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-slate-500">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-slate-500">О себе</span>
            <textarea
              value={form.about}
              onChange={(e) => set("about", e.target.value)}
              rows={3}
              className={`mt-1.5 resize-none ${fieldCls}`}
            />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            {saved && <Check size={15} />}
            {saved ? "Сохранено" : "Сохранить изменения"}
          </button>
          <Link
            href="/teacher/profile"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Отмена
          </Link>
        </div>
      </section>
    </div>
  );
}
