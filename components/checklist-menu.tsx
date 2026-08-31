"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CHECKLIST_STEP_DONE } from "@/lib/checklist-events";
import { checklist } from "@/lib/mock-data";

// Чек-лист в шапке. Пункты отмечаются АВТОМАТИЧЕСКИ по событию о реальном
// прогрессе: список открывается сам, конфетти на весь экран, пункт
// зачёркивается анимацией.
export default function ChecklistMenu() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(checklist.map((c) => [c.id, c.done]))
  );
  const [justDone, setJustDone] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const doneCount = Object.values(done).filter(Boolean).length;
  const total = checklist.length;
  const pct = Math.round((doneCount / total) * 100);

  // Параметры кольца прогресса
  const r = 9;
  const circ = 2 * Math.PI * r;

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
      if (!id) return;
      setDone((d) => {
        if (d[id]) return d; // уже выполнен — не дублируем праздник
        setJustDone(id);
        setOpen(true);
        setBurst((b) => b + 1);
        setTimeout(() => setJustDone(null), 2600);
        return { ...d, [id]: true };
      });
    }
    window.addEventListener(CHECKLIST_STEP_DONE, onStepDone);
    return () => window.removeEventListener(CHECKLIST_STEP_DONE, onStepDone);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Конфетти на весь экран (галерея #88752 · celebration).
          Портал в body: backdrop-blur шапки создаёт containing block
          и иначе запирает fixed-слой внутри навбара. */}
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
        aria-label="Чек-лист и прогресс"
        className={`flex items-center gap-2 rounded-full border py-1.5 pr-3 pl-2 text-sm transition ${
          open
            ? "border-violet-300 bg-violet-100"
            : "border-stone-200 bg-white hover:border-violet-200 hover:bg-violet-100/50"
        }`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
          <circle
            cx="12"
            cy="12"
            r={r}
            fill="none"
            strokeWidth="3"
            className="stroke-stone-100"
          />
          <circle
            cx="12"
            cy="12"
            r={r}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - doneCount / total)}
            className="stroke-violet-600 transition-all duration-700"
          />
        </svg>
        <span className="font-medium text-stone-700">
          {doneCount}/{total}
        </span>
      </button>

      {open && (
        // На телефоне fixed относительно шапки (backdrop-blur делает её
        // containing block) — раскрываем на всю ширину экрана
        <div className="fixed inset-x-3 top-16 z-50 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-80">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-sm font-medium">Мой прогресс</p>
            <p className="font-mono text-xs text-stone-400">{pct}%</p>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          <ul className="mt-3.5 space-y-1">
            {checklist.map((item) => {
              const isDone = done[item.id];
              const striking = justDone === item.id;
              const inner = (
                <>
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] transition-colors duration-500 ${
                      isDone
                        ? "bg-violet-600 text-white"
                        : "border border-stone-300 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span
                    className={`text-[13px] leading-snug transition-colors duration-700 ${
                      striking
                        ? "strike-anim text-stone-400"
                        : isDone
                          ? "text-stone-400 line-through"
                          : "text-stone-700"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              );
              return (
                <li key={item.id}>
                  {!isDone && item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-violet-100"
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
        </div>
      )}
    </div>
  );
}
