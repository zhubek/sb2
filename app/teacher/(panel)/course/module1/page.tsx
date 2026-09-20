"use client";
import { useCopy } from "@/lib/cms/client";

import { ContentText } from "@/lib/cms/client";
import { useContent } from "@/lib/cms/client";


import FinalCheck from "@/components/course-final-check";
import CourseModuleHeader from "@/components/course-module-header";
import LessonBody from "@/components/course-lesson-body";
import { ArrowLeft, Check, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  module1Lessons,
  module1Meta,
} from "@/lib/course-module1";

const DONE_KEY = "course-m1-done";
const PASSED_KEY = "course-m1-passed";

// ─── Контент урока ───────────────────────────────────────────────────────────

const cmsDefaults_module1Lessons = module1Lessons;
const cmsDefaults_module1Meta = module1Meta;

// ─── Итоговая проверка ───────────────────────────────────────────────────────

// ─── Страница модуля ─────────────────────────────────────────────────────────

export default function Module1Page() {
  const pageCopy = useCopy("copy.app.teacher.panel.course.module1.page");
  const module1Lessons = useContent("course-module1.module1Lessons", cmsDefaults_module1Lessons);
  const module1Meta = useContent("course-module1.module1Meta", cmsDefaults_module1Meta);
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
        <ContentText id="copy.app.teacher.panel.course.module1.page.013" fallback="Обучающий курс" /></Link>

      {/* Паспорт модуля */}
      <CourseModuleHeader meta={module1Meta}/>

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
              {done.length} <ContentText id="copy.app.teacher.panel.course.module1.page.014" fallback=" из " />{module1Lessons.length} <ContentText id="copy.app.teacher.panel.course.module1.page.015" fallback=" уроков" />{passed && pageCopy("x002"," · проверка пройдена")}
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
                <span className="flex-1"><ContentText id="copy.app.teacher.panel.course.module1.page.016" fallback="Итоговая проверка" /></span>
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
                    <ContentText id="copy.app.teacher.panel.course.module1.page.017" fallback="← Назад" /></button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-3">
                  {!canNext && (
                    <span className="font-mono text-[11px] text-amber-600">
                      <ContentText id="copy.app.teacher.panel.course.module1.page.018" fallback="Долистайте урок до конца, чтобы продолжить" /></span>
                  )}
                  <button
                    disabled={!canNext}
                    onClick={next}
                    className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-40"
                  >
                    {idx === module1Lessons.length - 1
                      ? pageCopy("x003","К итоговой проверке →")
                      : pageCopy("x004","Далее →")}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <p className="font-mono text-xs font-semibold tracking-widest text-teal-600 uppercase">
                  <ContentText id="copy.app.teacher.panel.course.module1.page.019" fallback="Итоговая проверка" /></p>
                <button
                  onClick={() => goTo(module1Lessons[module1Lessons.length - 1].id)}
                  className="text-sm text-slate-400 hover:text-slate-600"
                >
                  <ContentText id="copy.app.teacher.panel.course.module1.page.020" fallback="← Назад к урокам" /></button>
              </div>
              <h2 className="font-display mb-6 text-2xl font-semibold tracking-tight">
                <ContentText id="copy.app.teacher.panel.course.module1.page.021" fallback="Проверка по всему модулю" /></h2>
              {allLessonsDone ? (
                <FinalCheck onPassed={markPassed} />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                  <p className="text-2xl">🔒</p>
                  <p className="mt-2 font-semibold"><ContentText id="copy.app.teacher.panel.course.module1.page.022" fallback="Проверка пока закрыта" /></p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                    <ContentText id="copy.app.teacher.panel.course.module1.page.023" fallback="Пройдите все шесть уроков — долистайте каждый до конца и нажмите «Далее». Когда все уроки будут пройдены, проверка откроется." /></p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
