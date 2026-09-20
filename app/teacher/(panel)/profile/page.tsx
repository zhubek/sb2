"use client";
import { ContentText } from "@/lib/cms/client";
import { useContent } from "@/lib/cms/client";


import { Award, BookOpen, Pencil } from "lucide-react";
import { currentProfile } from "@/lib/current-profile";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  courseModules,
  moduleStatusLabels,
  teacher,
  teacherBadges,
} from "@/lib/teacher-mock-data";

const cmsDefaults_courseModules = courseModules;
const cmsDefaults_moduleStatusLabels = moduleStatusLabels;
const cmsDefaults_teacher = teacher;
const cmsDefaults_teacherBadges = teacherBadges;

export default function TeacherProfilePage() {
  const teacher = useContent("teacher-mock-data.teacher", cmsDefaults_teacher);
  const teacherBadges = useContent("teacher-mock-data.teacherBadges", cmsDefaults_teacherBadges);
  const courseModules = useContent("teacher-mock-data.courseModules", cmsDefaults_courseModules);
  const moduleStatusLabels = useContent("teacher-mock-data.moduleStatusLabels", cmsDefaults_moduleStatusLabels);
  const [profile, setProfile] = useState({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    role: teacher.role,
    school: teacher.school,
    email: teacher.email,
  });

  useEffect(() => {
    currentProfile().then(p => setProfile(v => ({...v,firstName:p.name,lastName:p.surname,email:p.email,school:p.organization?.name ?? "—"}))).catch(() => {});
  }, []);

  const earnedBadges = teacherBadges.filter((b) => b.earned);
  const doneModules = courseModules.filter((m) => m.status === "done");
  const inProgress = courseModules.filter((m) => m.status === "progress");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          <ContentText id="copy.app.teacher.panel.profile.page.001" fallback="Личный кабинет" /></h1>
        <p className="mt-1 text-slate-500">
          <ContentText id="copy.app.teacher.panel.profile.page.002" fallback="Ваш профессиональный прогресс на платформе" /></p>
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
            <ContentText id="copy.app.teacher.panel.profile.page.003" fallback="Редактировать" /></Link>
        </div>
      </section>

      {/* Достижения — сразу под блоком с фотографией и ФИО */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <Award size={16} className="text-slate-400" />
          <ContentText id="copy.app.teacher.panel.profile.page.004" fallback="Достижения · " />{earnedBadges.length} <ContentText id="copy.app.teacher.panel.profile.page.005" fallback=" из " />{teacherBadges.length}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {teacherBadges.map((b) => (
            <span
              key={b.id}
              title={b.earned ? `${b.desc} · ${b.earnedAt}` : b.desc}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
                b.earned
                  ? "bg-teal-50 text-teal-700"
                  : "bg-slate-100 text-slate-400 opacity-60"
              }`}
            >
              <span>{b.icon}</span>
              {b.name}
            </span>
          ))}
        </div>
      </section>

      {/* Пройденные модули — прогресс из раздела «Обучающий курс» */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-semibold">
            <BookOpen size={16} className="text-slate-400" />
            <ContentText id="copy.app.teacher.panel.profile.page.006" fallback="Пройденные модули · " />{doneModules.length} <ContentText id="copy.app.teacher.panel.profile.page.007" fallback=" из " />{courseModules.length}
          </h2>
          <Link
            href="/teacher/course"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            <ContentText id="copy.app.teacher.panel.profile.page.008" fallback="К курсу →" /></Link>
        </div>
        <ul className="mt-3 divide-y divide-slate-100">
          {doneModules.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
              <p className="text-sm font-medium">{m.title}</p>
              <p className="font-mono text-xs text-slate-400">
                {moduleStatusLabels[m.status]} · {m.completedAt}
              </p>
            </li>
          ))}
          {inProgress.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
              <p className="text-sm font-medium text-slate-600">{m.title}</p>
              <p className="font-mono text-xs text-amber-600">
                {moduleStatusLabels[m.status]} · {m.progress}%
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
