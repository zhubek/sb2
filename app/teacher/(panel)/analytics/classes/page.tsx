import Link from "next/link";
import AnalyticsTabs from "@/components/analytics-tabs";
import { schoolClasses, teacher } from "@/lib/teacher-mock-data";

export default function ClassesAnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm text-slate-400">Аналитика · уровень «Классы»</p>
        <h1 className="mt-0.5 text-2xl font-bold">Классы</h1>
        <p className="mt-1 text-slate-500">
          {teacher.school} · {schoolClasses.length} классов на платформе
        </p>
      </div>

      <AnalyticsTabs />

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Список классов</h2>
        <p className="text-sm text-slate-500">
          Основные метрики · перейдите в класс для полной аналитики и списка
          учеников
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium">Класс</th>
                <th className="py-2.5 pr-4 font-medium">Учеников</th>
                <th className="py-2.5 pr-4 font-medium">Начали диагностику</th>
                <th className="py-2.5 pr-4 font-medium">Полные профили (3/3)</th>
                <th className="py-2.5 pr-4 font-medium">Ведущее направление</th>
                <th className="py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schoolClasses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{c.students}</td>
                  <td className="py-3 pr-4 text-slate-600">
                    {c.tested} ({Math.round((c.tested / c.students) * 100)}%)
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{c.fullProfiles}</td>
                  <td className="py-3 pr-4 text-slate-600">{c.topDirection}</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/teacher/analytics/class/${c.id}`}
                      className="text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                      Открыть →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
