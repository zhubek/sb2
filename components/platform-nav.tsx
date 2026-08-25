"use client";

import { Bot, Compass, FolderOpen, Home, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/compass-marks";
import { currentUser } from "@/lib/mock-data";

const links = [
  { href: "/dashboard", label: "Главная", icon: Home },
  { href: "/tests", label: "Тесты", icon: ListChecks },
  { href: "/universities", label: "Навигатор", icon: Compass },
  { href: "/portfolio", label: "Портфолио", icon: FolderOpen },
  { href: "/chat", label: "AI чат", icon: Bot },
];

type Lang = "ru" | "kk";

export default function PlatformNav() {
  const pathname = usePathname();
  const [name, setName] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
  });
  // Язык интерфейса — доступен прямо в шапке (демо: сохраняется локально)
  const [lang, setLang] = useState<Lang>("ru");

  // Имя из «Мой профиль» (localStorage), обновляется без перезагрузки
  useEffect(() => {
    function sync() {
      const stored = localStorage.getItem("student-profile");
      if (stored) {
        const p = JSON.parse(stored);
        setName({
          firstName: p.firstName || currentUser.firstName,
          lastName: p.lastName || currentUser.lastName,
        });
      }
    }
    sync();
    try {
      const l = localStorage.getItem("student-lang");
      if (l === "ru" || l === "kk") setLang(l);
    } catch {}
    window.addEventListener("student-profile-updated", sync);
    return () => window.removeEventListener("student-profile-updated", sync);
  }, []);

  function pickLang(l: Lang) {
    setLang(l);
    try {
      localStorage.setItem("student-lang", l);
    } catch {}
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#fcfbfd]/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
          <div className="flex min-w-0 items-center gap-8">
            <Link
              href="/dashboard"
              className="font-display flex items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <LogoMark className="h-6 w-6" />
              <span>профориентатор<span className="text-violet-600">.</span></span>
            </Link>
            <nav className="hidden gap-5 md:flex">
              {links.map((l) => {
                const active = pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`text-sm transition ${
                      active
                        ? "font-medium text-stone-900 underline decoration-violet-600 decoration-2 underline-offset-8"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex overflow-hidden rounded-full border border-stone-200 text-[12px] font-semibold">
              {(["kk", "ru"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => pickLang(l)}
                  className={`px-2.5 py-1 tracking-wide transition ${
                    lang === l ? "bg-stone-800 text-white" : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {l === "kk" ? "ҚАЗ" : "РУС"}
                </button>
              ))}
            </div>
            <Link
              href="/profile"
              className="group flex items-center gap-2.5"
              aria-label="Мой профиль"
            >
              <span className="hidden text-sm font-medium transition group-hover:text-violet-700 sm:block">
                {name.firstName}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-violet-500 text-xs font-semibold text-white transition group-hover:bg-violet-600">
                {name.firstName[0]}
                {name.lastName[0]}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Мобильная навигация — нижняя панель с иконками */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden print:hidden">
        <div className="grid grid-cols-5">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex flex-col items-center gap-1 py-2 text-[10.5px] font-medium transition ${
                  active ? "text-violet-600" : "text-stone-400 hover:text-stone-700"
                }`}
              >
                <span className={`flex h-7 w-11 items-center justify-center rounded-full ${active ? "bg-violet-100" : ""}`}>
                  <Icon size={18} strokeWidth={active ? 2.25 : 2} />
                </span>
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
