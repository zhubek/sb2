"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Быстрый доступ к AI-помощнику из любого раздела (ТЗ 4.2, шаг 3)
export default function TeacherAiButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/teacher/assistant")) return null;

  return (
    <Link
      href="/teacher/assistant"
      className="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full bg-teal-600 py-3 pr-5 pl-4 text-sm font-medium text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
    >
      <span className="text-lg">🤖</span>
      Спросить AI
    </Link>
  );
}
