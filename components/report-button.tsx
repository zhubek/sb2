"use client";

import { useState } from "react";

// Мок генерации отчёта (ТЗ: «Скачать» доступно на каждом уровне аналитики)
export default function ReportButton({ label }: { label: string }) {
  const [state, setState] = useState<"idle" | "generating" | "done">("idle");

  function generate() {
    setState("generating");
    setTimeout(() => setState("done"), 1400);
    setTimeout(() => setState("idle"), 4000);
  }

  return (
    <button
      onClick={generate}
      disabled={state === "generating"}
      className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition ${
        state === "done"
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
      }`}
    >
      {state === "idle" && <>⬇ {label}</>}
      {state === "generating" && (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Формируем документ…
        </>
      )}
      {state === "done" && <>✓ Отчёт скачан (демо)</>}
    </button>
  );
}
