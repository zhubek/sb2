"use client";

import { Award, BookOpen, FileBadge, Pencil, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  gamificationSteps,
  teacher,
  teacherBadges,
  teacherCourses,
} from "@/lib/teacher-mock-data";

export default function TeacherProfilePage() {
  const [certEarned, setCertEarned] = useState(false);
  const [profile, setProfile] = useState({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    role: teacher.role,
    school: teacher.school,
    email: teacher.email,
  });

  useEffect(() => {
    const saved = localStorage.getItem("teacher-gamification-done");
    if (saved) {
      const done: string[] = JSON.parse(saved);
      setCertEarned(gamificationSteps.every((s) => done.includes(s.id)));
    }
    // Правки из «Редактирование профиля» хранятся локально
    const stored = localStorage.getItem("teacher-profile");
    if (stored) setProfile((p) => ({ ...p, ...JSON.parse(stored) }));
  }, []);

  const earnedBadges = teacherBadges.filter((b) => b.earned);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Личный кабинет
        </h1>
        <p className="mt-1 text-slate-500">
          Ваш профессиональный прогресс на платформе
        </p>
      </div>

      {/* Профиль */}
      <section className="flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-700">
          {profile.firstName[0]}
          {profile.lastName[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-medium">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-slate-500">
            {profile.role} · {profile.school}
          </p>
          <p className="mt-0.5 font-mono text-xs text-slate-400">
            {profile.email}
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <Link
            href="/teacher/profile/edit"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Pencil size={14} />
            Редактировать
          </Link>
          <Link
            href="/teacher/certificate"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Мой прогресс
          </Link>
        </div>
      </section>

      {/* Сертификаты */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <FileBadge size={16} className="text-slate-400" />
          Сертификаты
        </h2>
        {certEarned ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50/60 p-4">
            <div className="flex items-center gap-3">
              <Trophy size={20} className="text-teal-600" />
              <div>
                <p className="text-sm font-medium">
                  Сертификат педагога-профориентатора
                </p>
                <p className="font-mono text-xs text-slate-400">
                  ID PRF-2026-GA-0417 · выдан 28.07.2026
                </p>
              </div>
            </div>
            <Link
              href="/teacher/certificate"
              className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-teal-700"
            >
              Скачать
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Пока нет сертификатов. Пройдите все шаги в разделе{" "}
            <Link
              href="/teacher/certificate"
              className="font-medium text-teal-600 hover:text-teal-700"
            >
              «Сертификат»
            </Link>{" "}
            — и получите именной сертификат с QR-проверкой.
          </p>
        )}
      </section>

      {/* Пройденные курсы */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <BookOpen size={16} className="text-slate-400" />
          Пройденные курсы
        </h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {teacherCourses.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="font-mono text-xs text-slate-400">
                {c.date} · {c.hours} ч
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Достижения */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <Award size={16} className="text-slate-400" />
          Достижения · {earnedBadges.length} из {teacherBadges.length}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {teacherBadges.map((b) => (
            <span
              key={b.id}
              title={b.desc}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
                b.earned
                  ? "bg-teal-50 text-teal-700"
                  : "bg-slate-100 text-slate-400 line-through"
              }`}
            >
              <Award size={12} />
              {b.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
