import Link from "next/link";
import ActivityChart from "@/components/activity-chart";
import {
  notifications,
  schoolClasses,
  schoolStats,
  teacher,
  teacherStudents,
} from "@/lib/teacher-mock-data";

const kpis = [
  { label: "Зарегистрировано учеников", value: schoolStats.registered },
  { label: "Прошли 1-й тест · DeBruce", value: schoolStats.test1 },
  { label: "Прошли 2-й тест · MBTI", value: schoolStats.test2 },
  { label: "Прошли 3-й тест · Голланд", value: schoolStats.test3 },
];

const noteStyles = {
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-teal-200 bg-teal-50 text-teal-900",
  tip: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export default function TeacherDashboard() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Добрый день, {teacher.firstName}!
        </h1>
        <p className="mt-1 text-slate-500">
          {teacher.school} · показатели школы в реальном времени
        </p>
      </div>

      {/* Ключевые показатели */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-2xl font-bold">
              {k.value.toLocaleString("ru-RU")}
            </p>
            <p className="mt-1 text-sm text-slate-500">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Уведомления и рекомендации системы */}
      <div className="space-y-2.5">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-3.5 text-sm ${noteStyles[n.type]}`}
          >
            <span>{n.text}</span>
            <Link
              href={n.href}
              className="shrink-0 font-medium underline-offset-2 hover:underline"
            >
              {n.action} →
            </Link>
          </div>
        ))}
      </div>

      {/* График активности */}
      <ActivityChart />

      {/* Карточки: школа / класс / ученики → детальная аналитика */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/teacher/analytics"
          className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-teal-300"
        >
          <span className="text-2xl">🏫</span>
          <h2 className="mt-3 font-semibold group-hover:text-teal-700">
            Школа
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Общая статистика, интересы, направления, динамика
          </p>
          <p className="mt-3 text-sm font-medium text-teal-600">
            Аналитика школы →
          </p>
        </Link>
        <Link
          href={`/teacher/analytics/class/${schoolClasses[3].id}`}
          className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-teal-300"
        >
          <span className="text-2xl">👥</span>
          <h2 className="mt-3 font-semibold group-hover:text-teal-700">
            Класс
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Результаты класса, сравнение учеников, средние показатели
          </p>
          <p className="mt-3 text-sm font-medium text-teal-600">
            Например, {schoolClasses[3].name} →
          </p>
        </Link>
        <Link
          href={`/teacher/analytics/student/${teacherStudents[0].id}`}
          className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-teal-300"
        >
          <span className="text-2xl">🎓</span>
          <h2 className="mt-3 font-semibold group-hover:text-teal-700">
            Ученики
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Карточка ученика: тесты, рекомендации AI, вузы
          </p>
          <p className="mt-3 text-sm font-medium text-teal-600">
            К карточкам учеников →
          </p>
        </Link>
      </div>
    </div>
  );
}
