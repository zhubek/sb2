"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/compass-marks";
import { currentUser } from "@/lib/mock-data";

const links = [
  { href: "/dashboard", label: "Главная" },
  { href: "/tests", label: "Тесты" },
  { href: "/universities", label: "Навигатор" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/chat", label: "AI чат" },
];

export default function PlatformNav() {
  const pathname = usePathname();
  const [name, setName] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
  });

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
    window.addEventListener("student-profile-updated", sync);
    return () => window.removeEventListener("student-profile-updated", sync);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#fcfbfd]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3.5">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="font-display flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <LogoMark className="h-6 w-6" />
            <span>профориентатор<span className="text-violet-600">.</span></span>
          </Link>
          <nav className="flex gap-5">
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
        <div className="flex items-center gap-3">
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
  );
}
