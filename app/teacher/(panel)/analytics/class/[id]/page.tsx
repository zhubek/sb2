import Link from "next/link";
import { notFound } from "next/navigation";
import ReportButton from "@/components/report-button";
import { schoolClasses, teacherStudents } from "@/lib/teacher-mock-data";

export default async function ClassAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cls = schoolClasses.find((c) => c.id === id);
  if (!cls) notFound();

  // В демо детальный состав есть у 10 «Б»; для остальных классов показываем его же
  const students = teacherStudents;
  const avgTests =
    students.reduce((s, x) => s + x.testsPassed, 0) / students.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/teacher/analytics"
        className="text-sm text-slate-400 hover:text-slate-600"
      >
        ← Аналитика школы
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Аналитика · уровень «Класс»</p>
          <h1 className="mt-0.5 text-2xl font-bold">Класс {cls.name}</h1>
          <p className="mt-1 text-slate-500">
            Классный руководитель: Жанар Касымова
          </p>
        </div>
        <ReportButton label={`Скачать отчёт по ${cls.name}`} />
      </div>

      {/* Средние показатели */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat value={cls.students} label="Учеников в классе" />
        <Stat
          value={`${Math.round((cls.tested / cls.students) * 100)}%`}
          label="Начали диагностику"
        />
        <Stat value={cls.fullProfiles} label="Полные профили (3/3)" />
        <Stat value={avgTests.toFixed(1)} label="Тестов на ученика" />
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-3.5 text-sm text-teal-900">
        Ведущее направление класса:{" "}
        <span className="font-semibold">{cls.topDirection}</span>
      </div>

      {/* Сравнение учеников */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Ученики класса</h2>
        <p className="text-sm text-slate-500">
          Сравнение результатов · нажмите на ученика для перехода в карточку
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium">Ученик</th>
                <th className="py-2.5 pr-4 font-medium">Тесты</th>
                <th className="py-2.5 pr-4 font-medium">Топ-навык</th>
                <th className="py-2.5 pr-4 font-medium">MBTI</th>
                <th className="py-2.5 pr-4 font-medium">Отрасль</th>
                <th className="py-2.5 font-medium">Активность</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/teacher/analytics/student/${s.id}`}
                      className="font-medium hover:text-teal-700"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className={`h-2 w-5 rounded-full ${
                              i < s.testsPassed ? "bg-teal-600" : "bg-slate-100"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {s.testsPassed}/3
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {s.topSkills[0] ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{s.mbti ?? "—"}</td>
                  <td className="py-3 pr-4 text-slate-600">
                    {s.topIndustry ?? "—"}
                  </td>
                  <td className="py-3 text-slate-400">{s.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Пустые данные: реакция системы */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm text-amber-900">
        ⚠ 1 ученик класса не начал диагностику.{" "}
        <Link
          href="/teacher/assistant"
          className="font-medium underline underline-offset-2"
        >
          Спросить AI, как вовлечь
        </Link>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}
