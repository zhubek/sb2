import Link from "next/link";
import ActivityChart from "@/components/activity-chart";
import BarList from "@/components/bar-list";
import ReportButton from "@/components/report-button";
import {
  popularProfessions,
  schoolClasses,
  schoolInterests,
  schoolStats,
  teacher,
} from "@/lib/teacher-mock-data";

export default function SchoolAnalyticsPage() {
  const tests = [
    { name: "1-й тест · DeBruce", value: schoolStats.test1 },
    { name: "2-й тест · MBTI", value: schoolStats.test2 },
    { name: "3-й тест · Голланд", value: schoolStats.test3 },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">
            Аналитика · уровень «Школа»
          </p>
          <h1 className="mt-0.5 text-2xl font-bold">{teacher.school}</h1>
          <p className="mt-1 text-slate-500">
            {schoolStats.registered} учеников на платформе
          </p>
        </div>
        <ReportButton label="Скачать отчёт по школе" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Распределение интересов */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Распределение интересов</h2>
          <p className="text-sm text-slate-500">
            Выбор отраслей учениками после теста DeBruce
          </p>
          <div className="mt-5">
            <BarList data={schoolInterests} />
          </div>
        </section>

        {/* Популярные профессии */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Популярные профессии</h2>
          <p className="text-sm text-slate-500">
            По итогам рекомендаций и выбора учеников
          </p>
          <div className="mt-5">
            <BarList data={popularProfessions} />
          </div>
        </section>

        {/* Прохождение тестов */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Прохождение тестов</h2>
          <p className="text-sm text-slate-500">
            Из {schoolStats.registered} зарегистрированных
          </p>
          <div className="mt-5 space-y-4">
            {tests.map((t) => (
              <div key={t.name}>
                <div className="flex justify-between text-sm">
                  <span>{t.name}</span>
                  <span className="font-medium text-slate-600">
                    {t.value} ·{" "}
                    {Math.round((t.value / schoolStats.registered) * 100)}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{
                      width: `${(t.value / schoolStats.registered) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Направления подготовки */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Направления подготовки</h2>
          <p className="text-sm text-slate-500">
            Ведущие направления по классам
          </p>
          <ul className="mt-4 divide-y divide-slate-100">
            {schoolClasses.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <span className="text-slate-500">{c.name}</span>
                <span className="font-medium">{c.topDirection}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Динамика активности */}
      <ActivityChart />

      {/* Классы → drill-down */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Классы</h2>
        <p className="text-sm text-slate-500">
          Перейдите в класс для детальной аналитики
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium">Класс</th>
                <th className="py-2.5 pr-4 font-medium">Учеников</th>
                <th className="py-2.5 pr-4 font-medium">Начали диагностику</th>
                <th className="py-2.5 pr-4 font-medium">Полные профили (3/3)</th>
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
