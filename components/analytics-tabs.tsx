"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/teacher/analytics", label: "Школа" },
  { href: "/teacher/analytics/classes", label: "Классы" },
  { href: "/teacher/analytics/students", label: "Ученики" },
];

// Подразделы аналитики: Школа · Классы · Ученики
export default function AnalyticsTabs() {
  const pathname = usePathname();

  return (
    <div className="flex w-fit rounded-xl bg-slate-100 p-1 text-sm font-medium">
      {tabs.map((t) => {
        const active =
          t.href === "/teacher/analytics"
            ? pathname === "/teacher/analytics"
            : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`rounded-lg px-4 py-2 transition ${
              active
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
