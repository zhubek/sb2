"use client";

import {
  BarChart3,
  BookOpen,
  Bot,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { teacher } from "@/lib/teacher-mock-data";

const links = [
  { href: "/teacher", label: "Главная", icon: LayoutDashboard, tour: "home" },
  { href: "/teacher/assistant", label: "AI-помощник", icon: Bot, tour: "assistant" },
  { href: "/teacher/analytics", label: "Аналитика", icon: BarChart3, tour: "analytics" },
  { href: "/teacher/handbook", label: "Справочник образования", icon: BookOpen, tour: "handbook" },
  { href: "/teacher/reports", label: "Отчёты", icon: FileText, tour: "reports" },
  { href: "/teacher/course", label: "Обучающий курс", icon: GraduationCap, tour: "course" },
  { href: "/teacher/guide", label: "Руководство", icon: LifeBuoy, tour: "guide" },
  { href: "/teacher/bonus", label: "Бонусная система", icon: Sparkles, tour: "bonus" },
  { href: "/teacher/profile", label: "Личный кабинет", icon: UserRound, tour: "profile" },
];

export default function TeacherNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-100 bg-white text-slate-600">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500 text-xs font-bold text-white">
          AI
        </span>
        <div>
          <p className="font-display text-sm leading-tight tracking-tight text-slate-800">
            профориентатор<span className="text-teal-600">.</span>
          </p>
          <p className="text-[11px] text-slate-400">Платформа педагога</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {links.map((l) => {
          const active =
            l.href === "/teacher"
              ? pathname === "/teacher"
              : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              data-tour={l.tour}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-teal-50 font-semibold text-teal-700"
                  : "hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
            {teacher.firstName[0]}
            {teacher.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {teacher.firstName} {teacher.lastName}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {teacher.school}
            </p>
          </div>
        </div>
        <Link
          href="/teacher/login"
          className="mt-3 block text-xs text-slate-400 hover:text-slate-600"
        >
          Выйти
        </Link>
      </div>
    </aside>
  );
}
