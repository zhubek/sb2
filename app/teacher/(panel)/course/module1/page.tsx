"use client";

import { ArrowLeft, Check, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  type Lesson,
  module1Lessons,
  module1Meta,
  module1Quiz,
} from "@/lib/course-module1";

const DONE_KEY = "course-m1-done";
const PASSED_KEY = "course-m1-passed";

// ─── Контент урока ───────────────────────────────────────────────────────────

function LessonBody({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-8">
      {lesson.blocks.map((b, i) => {
        if (b.kind === "note")
          return (
            <p
              key={i}
              className="rounded-r-xl border-l-4 border-slate-300 bg-slate-50 px-5 py-4 text-[15px] leading-relaxed text-slate-600"
            >
              {b.text}
            </p>
          );
        if (b.kind === "key")
          return (
            <div key={i} className="border-t-2 border-slate-800 pt-4">
              <h4 className="font-mono text-xs font-medium tracking-widest text-slate-400 uppercase">
                {b.title}
              </h4>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed">
                {b.items!.map((it) => (
                  <li key={it.t}>{it.t}</li>
                ))}
              </ol>
            </div>
          );
        return (
          <div key={i}>
            <h4 className="border-b border-slate-200 pb-2 font-mono text-xs font-medium tracking-widest text-slate-400 uppercase">
              {b.title}
            </h4>
            <ul className="mt-3.5 space-y-3">
              {b.items!.map((it) => (
                <li key={it.t} className="text-[15px] leading-relaxed">
                  <span className="font-semibold">{it.t}</span>
                  {it.d && <span className="text-slate-600"> — {it.d}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// ─── Итоговая проверка ───────────────────────────────────────────────────────

function FinalCheck({ onPassed }: { onPassed: () => void }) {
  // Ответы: single — индекс, multi — выбранные индексы (замораживаются после проверки)
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [checkedMulti, setCheckedMulti] = useState<Record<string, number[]>>({});
  const [openText, setOpenText] = useState("");
  const [openSent, setOpenSent] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const scored = module1Quiz.filter((q) => q.type !== "open");
  const answered = scored.filter((q) => answers[q.id] !== undefined);
  const right = scored.filter((q) => {
    const a = answers[q.id];
    if (a === undefined) return false;
    if (q.type === "single")
      return q.options![a as number].correct === true;
    const sel = a as number[];
    return q.options!.every((o, i) => Boolean(o.correct) === sel.includes(i));
  });
  const allDone = answered.length === scored.length;
  const pct = Math.round((right.length / scored.length) * 100);
  const passed = allDone && pct >= 70;

  useEffect(() => {
    if (passed) onPassed();
  }, [passed, onPassed]);

  const words = openText.trim() ? openText.trim().split(/\s+/).length : 0;

  function reset() {
    setAnswers({});
    setCheckedMulti({});
    setOpenText("");
    setOpenSent(false);
    setResetCount((c) => c + 1);
  }

  return (
    <div key={resetCount} className="space-y-8">
      <p className="text-[15px] leading-relaxed text-slate-600">
        {scored.length} вопросов по всем шести урокам: с одним и несколькими
        ответами, включая ситуационные. На каждый вопрос — одна попытка. Для
        прохождения нужно набрать 70%. Открытый вопрос — без балла: вы излагаете
        профессиональное мнение и сверяетесь с образцом.
      </p>

      {module1Quiz.map((q, qi) => {
        const a = answers[q.id];
        const isAnswered = a !== undefined;

        return (
          <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold">
                Вопрос {qi + 1}.{" "}
                <span className="font-medium">{q.q}</span>
              </p>
              <span className="shrink-0 rounded border border-slate-200 px-2 py-0.5 font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                {q.chip}
              </span>
            </div>

            {/* Один ответ */}
            {q.type === "single" && (
              <div className="mt-4 space-y-2">
                {q.options!.map((o, i) => {
                  const chosen = a === i;
                  const showState = isAnswered && (chosen || o.correct);
                  return (
                    <button
                      key={o.t}
                      disabled={isAnswered}
                      onClick={() => setAnswers((s) => ({ ...s, [q.id]: i }))}
                      className={`block w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                        showState
                          ? o.correct
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-rose-300 bg-rose-50"
                          : isAnswered
                            ? "border-slate-100 text-slate-400"
                            : "border-slate-200 hover:border-teal-400"
                      }`}
                    >
                      {o.t}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Несколько ответов */}
            {q.type === "multi" && (
              <div className="mt-4 space-y-2">
                {q.options!.map((o, i) => {
                  const sel = (
                    isAnswered ? (a as number[]) : (checkedMulti[q.id] ?? [])
                  ).includes(i);
                  const state = !isAnswered
                    ? ""
                    : o.correct && sel
                      ? "border-emerald-300 bg-emerald-50"
                      : o.correct && !sel
                        ? "border-amber-300 bg-amber-50"
                        : !o.correct && sel
                          ? "border-rose-300 bg-rose-50"
                          : "border-slate-100 text-slate-400";
                  return (
                    <label
                      key={o.t}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition ${
                        state || "border-slate-200 hover:border-teal-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={isAnswered}
                        checked={sel}
                        onChange={(e) =>
                          setCheckedMulti((s) => {
                            const cur = s[q.id] ?? [];
                            return {
                              ...s,
                              [q.id]: e.target.checked
                                ? [...cur, i]
                                : cur.filter((x) => x !== i),
                            };
                          })
                        }
                        className="accent-teal-600"
                      />
                      {o.t}
                    </label>
                  );
                })}
                {!isAnswered && (
                  <button
                    onClick={() =>
                      setAnswers((s) => ({
                        ...s,
                        [q.id]: checkedMulti[q.id] ?? [],
                      }))
                    }
                    className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                  >
                    Проверить
                  </button>
                )}
              </div>
            )}

            {/* Открытый вопрос */}
            {q.type === "open" && (
              <div className="mt-4">
                {!openSent ? (
                  <>
                    <textarea
                      value={openText}
                      onChange={(e) => setOpenText(e.target.value)}
                      rows={4}
                      placeholder="Ваше профессиональное мнение…"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-400"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`font-mono text-xs ${words >= 25 ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {words} слов
                      </span>
                      <button
                        disabled={words < 8}
                        onClick={() => setOpenSent(true)}
                        className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-40"
                      >
                        Отправить и открыть образец
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-r-xl border-l-4 border-emerald-400 bg-emerald-50/60 px-5 py-4">
                    <h4 className="font-mono text-xs font-medium tracking-widest text-slate-500 uppercase">
                      Образец рассуждения
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {q.model}
                    </p>
                    <p className="mt-3 text-xs text-slate-400 italic">
                      Открытый вопрос без балла — единственно верной формулировки
                      здесь нет.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Обратная связь */}
            {isAnswered && q.type !== "open" && (
              <p
                className={`mt-3 rounded-r-xl border-l-4 px-4 py-2.5 text-sm ${
                  (q.type === "single" &&
                    q.options![a as number].correct) ||
                  (q.type === "multi" &&
                    q.options!.every(
                      (o, i) =>
                        Boolean(o.correct) === (a as number[]).includes(i)
                    ))
                    ? "border-emerald-400 bg-emerald-50/60 text-emerald-900"
                    : "border-rose-400 bg-rose-50/60 text-rose-900"
                }`}
              >
                {(q.type === "single" &&
                  q.options![a as number].correct) ||
                (q.type === "multi" &&
                  q.options!.every(
                    (o, i) => Boolean(o.correct) === (a as number[]).includes(i)
                  ))
                  ? q.ok
                  : q.no}
              </p>
            )}
          </div>
        );
      })}

      {/* Результат */}
      {allDone && (
        <div className="rounded-xl border-2 border-slate-800 bg-white p-6 text-center">
          <p className="font-display text-2xl font-semibold">
            {right.length} из {scored.length} · {pct}%
          </p>
          <p className="mt-1 font-mono text-xs text-slate-400">
            порог прохождения — 70% · открытый вопрос — без балла
          </p>
          {passed ? (
            <p className="mt-3 font-semibold text-emerald-700">
              ✓ Проверка пройдена — модуль завершён
            </p>
          ) : (
            <>
              <p className="mt-3 font-semibold text-rose-700">
                Порог не набран — пройдите проверку заново
              </p>
              <button
                onClick={reset}
                className="mt-4 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                Пройти заново
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Страница модуля ─────────────────────────────────────────────────────────

export default function Module1Page() {
  const [done, setDone] = useState<string[]>([]);
  const [active, setActive] = useState("l1");
  const [canNext, setCanNext] = useState(false);
  const [passed, setPassed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(DONE_KEY);
    if (saved) setDone(JSON.parse(saved));
    setPassed(Boolean(localStorage.getItem(PASSED_KEY)));
  }, []);

  // «Далее» активируется, когда урок долистан до конца
  useEffect(() => {
    if (active === "final") return;
    setCanNext(false);
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setCanNext(true),
      { threshold: 1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [active]);

  const idx = module1Lessons.findIndex((l) => l.id === active);
  const lesson = idx >= 0 ? module1Lessons[idx] : null;
  const allLessonsDone = module1Lessons.every((l) => done.includes(l.id));

  function unlocked(i: number) {
    return i === 0 || done.includes(module1Lessons[i - 1].id);
  }

  function goTo(id: string) {
    setActive(id);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function next() {
    const newDone = [...new Set([...done, lesson!.id])];
    setDone(newDone);
    localStorage.setItem(DONE_KEY, JSON.stringify(newDone));
    goTo(idx < module1Lessons.length - 1 ? module1Lessons[idx + 1].id : "final");
  }

  function markPassed() {
    localStorage.setItem(PASSED_KEY, "1");
    setPassed(true);
  }

  return (
    <div ref={topRef} className="mx-auto max-w-6xl scroll-mt-8">
      <Link
        href="/teacher/course"
        className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-700"
      >
        <ArrowLeft size={15} />
        Обучающий курс
      </Link>

      {/* Паспорт модуля */}
      <div className="mt-4 border-b-2 border-slate-800 pb-6">
        <p className="font-mono text-xs font-semibold tracking-widest text-teal-600 uppercase">
          {module1Meta.num}
        </p>
        <h1 className="font-display mt-1.5 text-3xl font-semibold tracking-tight">
          {module1Meta.title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{module1Meta.source}</p>
        <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-4">
          {module1Meta.passport.map((p) => (
            <div
              key={p.k}
              className="border-slate-200 bg-white p-4 not-last:border-r max-sm:odd:border-r max-sm:[&:nth-child(-n+2)]:border-b"
            >
              <p className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                {p.k}
              </p>
              <p className="mt-1 text-sm font-semibold">{p.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Навигация по урокам */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="mb-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-500"
                style={{ width: `${(done.length / module1Lessons.length) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-xs text-slate-400">
              {done.length} из {module1Lessons.length} уроков
              {passed && " · проверка пройдена"}
            </p>
          </div>
          <ol className="space-y-1">
            {module1Lessons.map((l, i) => {
              const isDone = done.includes(l.id);
              const isActive = active === l.id;
              const isOpen = unlocked(i);
              return (
                <li key={l.id}>
                  <button
                    disabled={!isOpen}
                    onClick={() => goTo(l.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] leading-snug transition ${
                      isActive
                        ? "bg-teal-50 font-semibold text-teal-800"
                        : isOpen
                          ? "text-slate-600 hover:bg-slate-50"
                          : "cursor-not-allowed text-slate-300"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium ${
                        isDone
                          ? "border-teal-600 bg-teal-600 text-white"
                          : isActive
                            ? "border-teal-600 text-teal-700"
                            : "border-slate-300 border-dashed text-slate-400"
                      }`}
                    >
                      {isDone ? <Check size={11} /> : i + 1}
                    </span>
                    <span className="flex-1">{l.short}</span>
                    {!isOpen && <Lock size={12} className="shrink-0" />}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                disabled={!allLessonsDone}
                onClick={() => goTo("final")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] transition ${
                  active === "final"
                    ? "bg-teal-50 font-semibold text-teal-800"
                    : allLessonsDone
                      ? "text-slate-600 hover:bg-slate-50"
                      : "cursor-not-allowed text-slate-300"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px] ${
                    passed
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-300 text-slate-400"
                  }`}
                >
                  {passed ? <Check size={11} /> : "✦"}
                </span>
                <span className="flex-1">Итоговая проверка</span>
                {!allLessonsDone && <Lock size={12} className="shrink-0" />}
              </button>
            </li>
          </ol>
        </aside>

        {/* Контент */}
        <div className="min-w-0 max-w-3xl">
          {lesson ? (
            <>
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <p className="font-mono text-xs font-semibold tracking-widest text-teal-600 uppercase">
                  {lesson.num}
                </p>
                <p className="font-mono text-xs text-slate-400">
                  {lesson.source}
                </p>
              </div>
              <h2 className="font-display mb-6 text-2xl font-semibold tracking-tight">
                {lesson.title}
              </h2>
              <LessonBody lesson={lesson} />
              <div ref={sentinelRef} className="h-px" />

              {/* Навигация по страницам */}
              <div className="mt-10 flex items-center justify-between border-t-2 border-slate-800 pt-5">
                {idx > 0 ? (
                  <button
                    onClick={() => goTo(module1Lessons[idx - 1].id)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    ← Назад
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-3">
                  {!canNext && (
                    <span className="font-mono text-[11px] text-amber-600">
                      Долистайте урок до конца, чтобы продолжить
                    </span>
                  )}
                  <button
                    disabled={!canNext}
                    onClick={next}
                    className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-40"
                  >
                    {idx === module1Lessons.length - 1
                      ? "К итоговой проверке →"
                      : "Далее →"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <p className="font-mono text-xs font-semibold tracking-widest text-teal-600 uppercase">
                  Итоговая проверка
                </p>
                <button
                  onClick={() => goTo(module1Lessons[module1Lessons.length - 1].id)}
                  className="text-sm text-slate-400 hover:text-slate-600"
                >
                  ← Назад к урокам
                </button>
              </div>
              <h2 className="font-display mb-6 text-2xl font-semibold tracking-tight">
                Проверка по всему модулю
              </h2>
              {allLessonsDone ? (
                <FinalCheck onPassed={markPassed} />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                  <p className="text-2xl">🔒</p>
                  <p className="mt-2 font-semibold">Проверка пока закрыта</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                    Пройдите все шесть уроков — долистайте каждый до конца и
                    нажмите «Далее». Когда все уроки будут пройдены, проверка
                    откроется.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
