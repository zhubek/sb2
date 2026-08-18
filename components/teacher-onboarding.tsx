"use client";

import { useEffect, useState } from "react";

const DONE_KEY = "teacher-onboarding-done";
export const ONBOARDING_RESTART = "teacher-onboarding-restart";

// Онбординг по платформе: 5 шагов, подсвечивает разделы левого меню.
// Запускается при первом входе; повторно — из раздела «Руководство».
const steps: { tour: string | null; title: string; text: string }[] = [
  {
    tour: null,
    title: "Добро пожаловать на платформу профориентатора!",
    text: "За 5 коротких шагов покажем основные разделы и функции: аналитику по школе, AI-помощника, отчёты и обучающий курс.",
  },
  {
    tour: "analytics",
    title: "Аналитика: школа → классы → ученики",
    text: "Три уровня данных: сводка по школе за выбранный период, метрики классов и карточки учеников с результатами тестов. Любой уровень можно скачать отчётом.",
  },
  {
    tour: "assistant",
    title: "AI-помощник",
    text: "Задавайте вопросы о своих учениках обычным текстом: «кто не прошёл тесты», «сравни 10 «А» и 10 «Б»», «подготовь характеристику ученика».",
  },
  {
    tour: "reports",
    title: "Отчёты",
    text: "Все сформированные отчёты хранятся здесь — и созданные вами вручную, и автоматические сводки системы. С фильтрами и поиском.",
  },
  {
    tour: "course",
    title: "Обучающий курс и бонусы",
    text: "Пройдите модули курса, чтобы освоить платформу. За активность начисляются баллы — следите за ними в разделе «Бонусная система».",
  },
];

export default function TeacherOnboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!localStorage.getItem(DONE_KEY)) setOpen(true);
    function onRestart() {
      setStep(0);
      setOpen(true);
    }
    window.addEventListener(ONBOARDING_RESTART, onRestart);
    return () => window.removeEventListener(ONBOARDING_RESTART, onRestart);
  }, []);

  // Позиция подсвечиваемого пункта меню пересчитывается на каждом шаге
  useEffect(() => {
    if (!open) return;
    const tour = steps[step].tour;
    if (!tour) {
      setRect(null);
      return;
    }
    function measure() {
      const el = document.querySelector(`[data-tour="${tour}"]`);
      setRect(el ? el.getBoundingClientRect() : null);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, step]);

  if (!open) return null;

  const last = step === steps.length - 1;
  const s = steps[step];

  function finish() {
    localStorage.setItem(DONE_KEY, "1");
    setOpen(false);
    setStep(0);
  }

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Затемнение с «окном» вокруг подсвеченного пункта меню */}
      {rect ? (
        <div
          className="absolute rounded-xl ring-2 ring-teal-400 transition-all duration-300"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.55)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900/55" />
      )}

      {/* Карточка шага */}
      <div
        className="absolute w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all duration-300"
        style={
          rect
            ? { top: Math.min(rect.top, window.innerHeight - 280), left: rect.right + 20 }
            : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
        }
      >
        <p className="font-mono text-xs text-teal-600">
          Шаг {step + 1} из {steps.length}
        </p>
        <h2 className="font-display mt-2 text-lg font-semibold tracking-tight">
          {s.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>

        <div className="mt-5 flex items-center gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-teal-600" : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={finish}
            className="text-sm text-slate-400 hover:text-slate-600"
          >
            Пропустить
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Назад
              </button>
            )}
            <button
              onClick={() => (last ? finish() : setStep(step + 1))}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              {last ? "Начать работу" : "Далее"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
