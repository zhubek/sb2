import Link from "next/link";
import ActivityChart from "@/components/activity-chart";
import {
  attentionSignals,
  schoolClasses,
  schoolStats,
  teacher,
} from "@/lib/teacher-mock-data";

// КПИ: значение, доля, ссылка на список — по мотивам прототипа кабинета
const kpis = [
  {
    label: "Общее количество учеников",
    value: schoolStats.total,
    sub: "7–11 классы школы",
    pct: null as number | null,
    href: "/teacher/analytics",
    link: "Аналитика школы",
  },
  {
    label: "Зарегистрированы",
    value: schoolStats.registered,
    sub: `${Math.round((schoolStats.registered / schoolStats.total) * 100)}% от общего числа`,
    pct: Math.round((schoolStats.registered / schoolStats.total) * 100),
    href: "/teacher/analytics/students",
    link: "Открыть список",
  },
  {
    label: "Прошли DeBruce",
    value: schoolStats.test1,
    sub: `${Math.round((schoolStats.test1 / schoolStats.registered) * 100)}% от зарегистрированных`,
    pct: Math.round((schoolStats.test1 / schoolStats.registered) * 100),
    href: "/teacher/analytics/students",
    link: "Открыть список",
  },
  {
    label: "Прошли MBTI",
    value: schoolStats.test2,
    sub: `${Math.round((schoolStats.test2 / schoolStats.registered) * 100)}% от зарегистрированных`,
    pct: Math.round((schoolStats.test2 / schoolStats.registered) * 100),
    href: "/teacher/analytics/students",
    link: "Открыть список",
  },
  {
    label: "Прошли тест Голланда",
    value: schoolStats.test3,
    sub: `${Math.round((schoolStats.test3 / schoolStats.registered) * 100)}% от зарегистрированных`,
    pct: Math.round((schoolStats.test3 / schoolStats.registered) * 100),
    href: "/teacher/analytics/students",
    link: "Открыть список",
  },
];

const severityStyles = {
  urgent: { chip: "bg-rose-100 text-rose-700", label: "срочно" },
  important: { chip: "bg-amber-100 text-amber-800", label: "важно" },
  info: { chip: "bg-sky-100 text-sky-700", label: "к сведению" },
};

export default function TeacherDashboard() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Добрый день, {teacher.firstName}!
        </h1>
        <p className="mt-1 text-slate-500">
          {teacher.school} · данные на 18.08.2026
        </p>
      </div>

      {/* Ключевые показатели */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-300"
          >
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className="mt-1.5 text-[26px] leading-none font-bold">
              {k.value.toLocaleString("ru-RU")}
            </p>
            <p className="mt-1.5 text-[11px] text-slate-400">{k.sub}</p>
            {k.pct !== null && (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${k.pct >= 55 ? "bg-teal-500" : "bg-amber-400"}`}
                  style={{ width: `${k.pct}%` }}
                />
              </div>
            )}
            <p className="mt-auto pt-2.5 text-xs font-medium text-teal-600 opacity-0 transition group-hover:opacity-100">
              {k.link} →
            </p>
          </Link>
        ))}
      </div>

      {/* Требуют внимания — горизонтально между KPI и графиком */}
      <section>
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Требуют внимания</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
            {attentionSignals.length}
          </span>
        </div>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {attentionSignals.map((s) => {
            const sev = severityStyles[s.severity];
            return (
              <li
                key={s.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${sev.chip}`}
                  >
                    {sev.label}
                  </span>
                </div>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">
                  {s.text}
                </p>
                <Link
                  href={s.href}
                  className="mt-1.5 inline-block text-xs font-medium text-teal-600 hover:text-teal-700"
                >
                  {s.action} →
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* График активности — на всю ширину */}
      <ActivityChart />

      {/* Охват диагностикой по классам */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Охват диагностикой по классам</h2>
        <p className="text-sm text-slate-500">
          Нажмите на строку, чтобы открыть аналитику класса
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium">Класс</th>
                <th className="py-2.5 pr-4 font-medium">Зарегистрированы</th>
                <th className="py-2.5 pr-4 font-medium">DeBruce</th>
                <th className="py-2.5 pr-4 font-medium">MBTI</th>
                <th className="py-2.5 pr-4 font-medium">Голланд</th>
                <th className="py-2.5 font-medium">Доля прошедших</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schoolClasses.map((c) => {
                const pct = Math.round((c.tested / c.students) * 100);
                return (
                  <tr key={c.id} className="relative hover:bg-slate-50/60">
                    <td className="py-3 pr-4 font-medium">
                      <Link
                        href={`/teacher/analytics/class/${c.id}`}
                        className="after:absolute after:inset-0"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{c.students}</td>
                    <td className="py-3 pr-4 text-slate-600">{c.t1}</td>
                    <td className="py-3 pr-4 text-slate-600">{c.t2}</td>
                    <td className="py-3 pr-4 text-slate-600">{c.t3}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${pct >= 55 ? "bg-teal-500" : "bg-amber-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-500">
                          {pct}%
                        </span>
                        {pct < 35 && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                            низкий охват
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
