"use client";
import { useCopy } from "@/lib/cms/client";

import { useContent } from "@/lib/cms/client";

import { ContentText } from "@/lib/cms/client";


import { ArrowLeft, Camera, Check, Lock } from "lucide-react";
import { type CurrentProfile, currentProfile } from "@/lib/current-profile";
import { api } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { teacher } from "@/lib/teacher-mock-data";

const PROFILE_KEY = "teacher-profile";

type Profile = {
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
};

const defaults: Profile = {
  firstName: teacher.firstName,
  lastName: teacher.lastName,
  role: teacher.role,
  phone: "+7 701 245 18 90",
};

const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-400";

// Школа, город и e-mail закреплены за учётной записью —
// их меняет только администратор платформы
const lockedFields = [
  { label: "Школа", value: teacher.school },
  { label: "Город", value: teacher.city },
  { label: "Email", value: teacher.email },
];

const inlineDefault_teacher = teacher;

export default function ProfileEditPage() {
  const pageCopy = useCopy("copy.app.teacher.panel.profile.edit.page");
  const teacher = useContent("teacher-mock-data.teacher", inlineDefault_teacher);
  const defaults = {
  firstName: teacher.firstName,
  lastName: teacher.lastName,
  role: teacher.role,
  phone: "+7 701 245 18 90",
};
  const [account, setAccount] = useState<CurrentProfile | null>(null);
  const lockedFields = [
    {label: "Школа", value: account?.organization?.name ?? "—"},
    {label: "Город", value: account?.organization?.city?.name ?? "—"},
    {label: "Email", value: account?.email ?? ""},
  ];
  const [form, setForm] = useState<Profile>(defaults);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    currentProfile().then(p => {setAccount(p); setForm(v => ({...v,firstName:p.name,lastName:p.surname,phone:p.phone??"",role:p.jobTitle??""}));}).catch(() => setError("Не удалось загрузить профиль."));
  }, []);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaved(false); setError("");
    try {
      const profile = await currentProfile();
      await api(`/users/${profile.id}`, {method:"PATCH",body:JSON.stringify({name:form.firstName,surname:form.lastName,phone:form.phone,jobTitle:form.role})});
      setSaved(true);
    } catch { setError("Не удалось сохранить профиль. Повторите попытку."); }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <div>
        <Link
          href="/teacher/profile"
          className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft size={15} />
          <ContentText id="copy.app.teacher.panel.profile.edit.page.001" fallback="Личный кабинет" /></Link>
        <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight">
          <ContentText id="copy.app.teacher.panel.profile.edit.page.002" fallback="Редактирование профиля" /></h1>
        <p className="mt-1 text-slate-500">
          <ContentText id="copy.app.teacher.panel.profile.edit.page.003" fallback="Эти данные видят ученики и родители при записи на консультацию" /></p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        {/* Аватар */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
              {(form.firstName[0] ?? "") + (form.lastName[0] ?? "")}
            </div>
            <button
              aria-label={pageCopy("x003","Изменить фото")}
              className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-teal-600"
            >
              <Camera size={14} />
            </button>
          </div>
          <div className="text-sm text-slate-500">
            <p className="font-medium text-slate-700"><ContentText id="copy.app.teacher.panel.profile.edit.page.004" fallback="Фото профиля" /></p>
            <p className="mt-0.5 text-xs">
              <ContentText id="copy.app.teacher.panel.profile.edit.page.005" fallback="JPG или PNG, до 2 МБ. Пока используются инициалы." /></p>
          </div>
        </div>

        {/* Редактируемые поля */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-500"><ContentText id="copy.app.teacher.panel.profile.edit.page.006" fallback="Имя" /></span>
            <input
              disabled={!account} value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500"><ContentText id="copy.app.teacher.panel.profile.edit.page.007" fallback="Фамилия" /></span>
            <input
              disabled={!account} value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500">
              <ContentText id="copy.app.teacher.panel.profile.edit.page.008" fallback="Должность" /></span>
            <input
              disabled={!account} value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500"><ContentText id="copy.app.teacher.panel.profile.edit.page.009" fallback="Телефон" /></span>
            <input
              disabled={!account} value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={`mt-1.5 ${fieldCls}`}
            />
          </label>
        </div>

        {/* Поля, закреплённые за школой: редактирует администратор */}
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Lock size={12} />
            <ContentText id="copy.app.teacher.panel.profile.edit.page.010" fallback="Данные учётной записи — изменяются администратором платформы" /></p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {lockedFields.map((f) => (
              <label key={f.label} className="block">
                <span className="text-xs font-medium text-slate-400">
                  {f.label}
                </span>
                <input
                  value={f.value}
                  disabled
                  className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            {saved && <Check size={15} />}
            {saved ? pageCopy("x004","Сохранено") : pageCopy("x005","Сохранить изменения")}
          </button>
          <Link
            href="/teacher/profile"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <ContentText id="copy.app.teacher.panel.profile.edit.page.011" fallback="Отмена" /></Link>
        </div>
      </section>
    </div>
  );
}
