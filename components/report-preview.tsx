"use client";

import { Download, Eye, X } from "lucide-react";
import { useState } from "react";

// Предпросмотр отчёта перед скачиванием (мок): модальное окно со сводкой
export default function ReportPreview({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "generating" | "done">("idle");

  function download() {
    setState("generating");
    setTimeout(() => setState("done"), 1400);
    setTimeout(() => setState("idle"), 4000);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <Eye size={15} />
        Посмотреть отчёт
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-slate-400">
                  Предпросмотр отчёта · демо
                </p>
                <h2 className="font-display mt-1 text-lg font-semibold tracking-tight">
                  {title}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-100">
              {rows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-medium">{r.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Закрыть
              </button>
              <button
                onClick={download}
                disabled={state === "generating"}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  state === "done"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
                }`}
              >
                {state === "idle" && (
                  <>
                    <Download size={15} />
                    Скачать
                  </>
                )}
                {state === "generating" && (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Формируем…
                  </>
                )}
                {state === "done" && <>✓ Отчёт скачан (демо)</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
