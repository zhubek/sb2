"use client";

import {
  BarChart3,
  BookOpen,
  Bot,
  LayoutDashboard,
  Library,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TeacherCertMenu from "@/components/teacher-cert-menu";
import { teacher } from "@/lib/teacher-mock-data";

const links = [
  { href: "/teacher", label: "Главная", icon: LayoutDashboard },
  { href: "/teacher/assistant", label: "AI-помощник", icon: Bot },
  { href: "/teacher/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/teacher/handbook", label: "Справочник образования", icon: BookOpen },
  { href: "/teacher/library", label: "Библиотека", icon: Library },
  { href: "/teacher/profile", label: "Личный кабинет", icon: UserRound },
];

export default function TeacherNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-slate-900 text-slate-300">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-xs font-bold text-slate-950">
          AI
        </span>
        <div>
          <p className="font-display text-sm font-semibold leading-tight tracking-tight text-white">
            профориентатор<span className="text-teal-400">.</span>
          </p>
          <p className="text-[11px] text-slate-500">Платформа педагога</p>
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
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-slate-800 font-medium text-teal-400"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {l.label}
            </Link>
          );
        })}

        {/* Сертификат: прогресс и шаги — как чек-лист ученика, но в левом меню */}
        <TeacherCertMenu />
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/15 text-sm font-semibold text-teal-400">
            {teacher.firstName[0]}
            {teacher.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {teacher.firstName} {teacher.lastName}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {teacher.school}
            </p>
          </div>
        </div>
        <Link
          href="/teacher/login"
          className="mt-3 block text-xs text-slate-500 hover:text-slate-300"
        >
          Выйти
        </Link>
      </div>
    </aside>
  );
}
