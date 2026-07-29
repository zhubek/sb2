"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FileBadge } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CHECKLIST_STEP_DONE } from "@/lib/checklist-events";
import { gamificationSteps } from "@/lib/teacher-mock-data";

const STORAGE_KEY = "teacher-gamification-done";

// Пункт «Сертификат» в левом меню педагога: кольцо прогресса, по клику —
// панель с шагами (дизайн как у ученика). Выполнение шага где угодно на
// платформе открывает панель, зачёркивает пункт и запускает конфетти.
export default function TeacherCertMenu() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string[]>(() =>
    gamificationSteps.filter((s) => s.initiallyDone).map((s) => s.id)
  );
  const [justDone, setJustDone] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const total = gamificationSteps.length;
  const doneCount = gamificationSteps.filter((s) => done.includes(s.id)).length;
  const pct = Math.round((doneCount / total) * 100);

  // Параметры кольца прогресса
  const r = 8;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setDone(JSON.parse(saved));
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Автоотметка по событию платформы
  useEffect(() => {
    function onStepDone(e: Event) {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (!id || !gamificationSteps.some((s) => s.id === id)) return;
      setDone((d) => {
        if (d.includes(id)) return d;
        setJustDone(id);
        setOpen(true);
        setBurst((b) => b + 1);
        setTimeout(() => setJustDone(null), 2600);
        return [...d, id];
      });
    }
    window.addEventListener(CHECKLIST_STEP_DONE, onStepDone);
    return () => window.removeEventListener(CHECKLIST_STEP_DONE, onStepDone);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Конфетти на весь экран — портал в body */}
      {burst > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <DotLottieReact
            key={burst}
            src="/lottie/gallery/88752.lottie"
            autoplay
            loop={false}
            className="pointer-events-none fixed inset-0 z-[100] h-full w-full"
          />,
          document.body
        )}

      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
          open
            ? "bg-slate-800 font-medium text-teal-400"
            : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
        }`}
      >
        <FileBadge size={16} strokeWidth={2} />
        <span className="flex-1 text-left">Сертификат</span>
        <span className="flex items-center gap-1.5">
          <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-90">
            <circle
              cx="11"
              cy="11"
              r={r}
              fill="none"
              strokeWidth="2.5"
              className="stroke-slate-700"
            />
            <circle
              cx="11"
              cy="11"
              r={r}
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - doneCount / total)}
              className="stroke-teal-400 transition-all duration-700"
            />
          </svg>
          <span className="font-mono text-[11px] text-slate-400">
            {doneCount}/{total}
          </span>
        </span>
      </button>

      {/* Панель шагов — выезжает справа от меню */}
      {open && (
        <div className="absolute top-0 left-full z-50 ml-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-sm font-medium">
              Путь к сертификату
            </p>
            <p className="font-mono text-xs text-slate-400">{pct}%</p>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          <ul className="mt-3.5 space-y-1">
            {gamificationSteps.map((item) => {
              const isDone = done.includes(item.id);
              const striking = justDone === item.id;
              const inner = (
                <>
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] transition-colors duration-500 ${
                      isDone
                        ? "bg-teal-600 text-white"
                        : "border border-slate-300 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span
                    className={`text-[13px] leading-snug transition-colors duration-700 ${
                      striking
                        ? "strike-anim text-slate-400"
                        : isDone
                          ? "text-slate-400 line-through"
                          : "text-slate-700"
                    }`}
                  >
                    {item.title}
                  </span>
                </>
              );
              return (
                <li key={item.id}>
                  {!isDone ? (
                    <Link
                      href="/teacher/certificate"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-teal-50"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2.5 px-2 py-1.5">
                      {inner}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <Link
            href="/teacher/certificate"
            onClick={() => setOpen(false)}
            className="mt-3 block border-t border-slate-100 pt-2.5 text-center text-xs font-medium text-teal-600 transition hover:text-teal-700"
          >
            {doneCount === total
              ? "Скачать сертификат →"
              : "Открыть страницу сертификата →"}
          </Link>
        </div>
      )}
    </div>
  );
}
