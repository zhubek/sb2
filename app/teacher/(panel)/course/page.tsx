import { Award, BookOpen, Check, Play } from "lucide-react";
import Link from "next/link";
import {
  courseInfo,
  courseModules,
  moduleStatusLabels,
} from "@/lib/teacher-mock-data";

const statusStyles = {
  done: "bg-emerald-50 text-emerald-700",
  progress: "bg-amber-50 text-amber-700",
  todo: "bg-slate-100 text-slate-500",
};

// Первый экран курса: содержание и статус каждого модуля
export default function CoursePage() {
  const doneCount = courseModules.filter((m) => m.status === "done").length;
  const pct = Math.round((doneCount / courseModules.length) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Обучающий курс
        </h1>
        <p className="mt-1 text-slate-500">
          Курс повышения квалификации педагога-профориентатора ·{" "}
          {courseInfo.hours} часов · {courseInfo.modules} модулей
        </p>
      </div>

      {/* Общий прогресс */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <BookOpen size={18} />
            </span>
            <div>
              <p className="font-semibold">
                Пройдено модулей: {doneCount} из {courseModules.length}
              </p>
              <p className="text-sm text-slate-500">
                Прогресс отображается и в вашем личном кабинете
              </p>
            </div>
          </div>
          <p className="font-mono text-sm text-slate-400">{pct}%</p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>

      {/* Сертификат */}
      <div className="flex items-start gap-3.5 rounded-xl border border-teal-200 bg-teal-50/60 px-5 py-4">
        <Award size={20} className="mt-0.5 shrink-0 text-teal-600" />
        <p className="text-sm leading-relaxed text-slate-700">
          {courseInfo.cert}
        </p>
      </div>

      {/* Содержание курса */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Содержание курса</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {courseModules.map((m) => {
            const action =
              m.status === "done"
                ? "Повторить"
                : m.status === "progress"
                  ? "Продолжить"
                  : "Начать";
            const actionCls =
              m.status === "done"
                ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                : "bg-teal-600 text-white hover:bg-teal-700";
            return (
              <li key={m.id} className="flex items-center gap-4 py-4">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs ${
                    m.status === "done"
                      ? "bg-teal-600 text-white"
                      : m.status === "progress"
                        ? "border-2 border-amber-400 text-amber-600"
                        : "border border-slate-300 text-slate-400"
                  }`}
                >
                  {m.status === "done" ? (
                    <Check size={15} />
                  ) : (
                    String(m.num).padStart(2, "0")
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {m.href ? (
                      <Link href={m.href} className="hover:text-teal-700">
                        {m.title}
                      </Link>
                    ) : (
                      m.title
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{m.desc}</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-400">
                    {m.lessons} уроков · {m.hours} ч
                    {m.status === "done" && m.completedAt
                      ? ` · пройден ${m.completedAt}`
                      : ""}
                    {m.status === "progress"
                      ? ` · выполнено ${m.progress}%`
                      : ""}
                  </p>
                  {m.status === "progress" && (
                    <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[m.status]}`}
                >
                  {moduleStatusLabels[m.status]}
                </span>
                {m.href ? (
                  <Link
                    href={m.href}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition ${actionCls}`}
                  >
                    {m.status !== "done" && <Play size={12} />}
                    {action}
                  </Link>
                ) : (
                  <button
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition ${actionCls}`}
                  >
                    {m.status !== "done" && <Play size={12} />}
                    {action}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
