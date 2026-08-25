"use client";

import {
  BarChart3,
  BookOpen,
  Bot,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  // Переключатель языка платформы — в шапке (демо)
  const [lang, setLang] = useState<"ru" | "kk">("ru");
  // Мобильное меню (выдвижная панель)
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const langToggle = (
    <div className="flex flex-col rounded-lg bg-slate-100 p-0.5 text-[10px] font-bold">
      {(
        [
          ["ru", "РУС"],
          ["kk", "ҚАЗ"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          onClick={() => setLang(key)}
          className={`rounded-md px-1.5 py-0.5 transition ${
            lang === key
              ? "bg-white text-teal-700 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const menu = (
    <>
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
    </>
  );

  return (
    <>
      {/* Мобильная шапка */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
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
        <button
          onClick={() => setOpen(true)}
          aria-label="Открыть меню"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Выдвижная панель */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/40" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col bg-white text-slate-600 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2.5 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500 text-xs font-bold text-white">
                  AI
                </span>
                <p className="font-display text-sm tracking-tight text-slate-800">
                  профориентатор<span className="text-teal-600">.</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {langToggle}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть меню"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            {menu}
          </aside>
        </div>
      )}

      {/* Десктоп: боковое меню */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-100 bg-white text-slate-600 lg:flex">
      <div className="flex items-center justify-between gap-2.5 px-5 py-5">
        <div className="flex items-center gap-2.5">
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
        {langToggle}
      </div>
      {menu}
      </aside>
    </>
  );
}
