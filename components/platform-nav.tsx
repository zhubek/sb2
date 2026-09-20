"use client";
import { useCopy } from "@/lib/cms/client";
import { LanguageSwitcher } from "./content-language";

import { ContentText } from "@/lib/cms/client";
import { useContent } from "@/lib/cms/client";


import { Bot, Compass, FolderOpen, Home, ListChecks } from "lucide-react";
import Link from "next/link";
import { useContentPathname as usePathname } from "@/lib/cms/client";
import { useEffect, useState } from "react";
import ChecklistMenu from "@/components/checklist-menu";
import { LogoMark } from "@/components/compass-marks";
import { currentProfile } from "@/lib/current-profile";
import { currentUser } from "@/lib/mock-data";

const links = [
  { href: "/dashboard", label: "Главная", icon: Home },
  { href: "/tests", label: "Тесты", icon: ListChecks },
  { href: "/universities", label: "Навигатор", icon: Compass },
  { href: "/portfolio", label: "Портфолио", icon: FolderOpen },
  { href: "/chat", label: "AI чат", icon: Bot },
];



const cmsDefaults_currentUser = currentUser;

export default function PlatformNav() {
  const pageCopy = useCopy("copy.components.platform-nav");
  const currentUser = useContent("mock-data.currentUser", cmsDefaults_currentUser);
  const pathname = usePathname();
  const [name, setName] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
  });


  // Имя из «Мой профиль» (localStorage), обновляется без перезагрузки
  useEffect(() => {
    function sync() {
      currentProfile().then(p => setName({ firstName: p.name, lastName: p.surname })).catch(() => setName({firstName: "", lastName: ""}));
    }
    sync();

    window.addEventListener("student-profile-updated", sync);
    return () => window.removeEventListener("student-profile-updated", sync);
  }, []);



  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#fcfbfd]/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
          <div className="flex min-w-0 items-center gap-8">
            <Link
              href="/dashboard"
              className="font-display flex items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <LogoMark className="h-6 w-6 shrink-0" />
              <span className="hidden min-[440px]:inline"><ContentText id="copy.components.platform-nav.001" fallback="профориентатор" /><span className="text-violet-600">.</span></span>
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
          <div className="flex items-center gap-2 sm:gap-3">
            <ChecklistMenu />
            <LanguageSwitcher labels={{kk:pageCopy("x001","ҚАЗ"),ru:pageCopy("x002","РУС")}}/>
            <Link
              href="/profile"
              className="group flex items-center gap-2.5"
              aria-label={pageCopy("x003","Мой профиль")}
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
