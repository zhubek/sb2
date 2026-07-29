"use client";

import {
  Building2,
  ClipboardList,
  FolderTree,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/compass-marks";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/users", label: "Ученики", icon: GraduationCap },
  { href: "/admin/tests", label: "Тесты", icon: ClipboardList },
  { href: "/admin/content", label: "Отрасли и программы", icon: FolderTree },
  { href: "/admin/universities", label: "ВУЗы", icon: Building2 },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-stone-800 bg-stone-900 text-stone-400">
      <div className="px-5 py-5">
        <p className="font-display flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
          <LogoMark dark className="h-6 w-6" />
          <span>профориентатор<span className="text-violet-400">.</span></span>
        </p>
        <p className="mt-0.5 text-[11px] text-stone-500">Панель администратора</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map((l) => {
          const active =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-stone-800 font-medium text-violet-300"
                  : "hover:bg-stone-800/60 hover:text-white"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-stone-800 p-4">
        <Link
          href="/"
          className="text-xs text-stone-500 transition hover:text-stone-300"
        >
          ← На платформу
        </Link>
      </div>
    </aside>
  );
}
