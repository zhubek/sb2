import { adminStats, adminTopIndustries, adminUsers } from "@/lib/mock-data";

const stats = [
  { label: "Всего учеников", value: adminStats.totalUsers.toLocaleString("ru-RU") },
  { label: "Активны за неделю", value: adminStats.activeThisWeek.toLocaleString("ru-RU") },
  { label: "Тестов пройдено", value: adminStats.testsCompleted.toLocaleString("ru-RU") },
  { label: "Полных профилей (3/3)", value: adminStats.fullProfiles.toLocaleString("ru-RU") },
  { label: "Тестов на ученика", value: adminStats.avgTestsPerUser.toString() },
  { label: "ВУЗов в избранном", value: adminStats.savedUniversities.toLocaleString("ru-RU") },
];

export default function AdminDashboard() {
  const maxCount = adminTopIndustries[0].count;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Обзор платформы</h1>
        <p className="mt-1 text-stone-500">Ключевые метрики за всё время</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-stone-200 bg-white p-5"
          >
            <p className="font-display text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 text-sm text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Популярные отрасли */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold">Популярные отрасли</h2>
          <p className="mt-1 text-sm text-stone-500">
            По выбору учеников после теста DeBruce
          </p>
          <div className="mt-5 space-y-4">
            {adminTopIndustries.map((it) => (
              <div key={it.name}>
                <div className="flex justify-between text-sm">
                  <span>{it.name}</span>
                  <span className="font-medium text-stone-500">{it.count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-violet-600"
                    style={{ width: `${(it.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Последние регистрации */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold">Последние регистрации</h2>
          <ul className="mt-4 divide-y divide-stone-100">
            {adminUsers.slice(0, 5).map((u) => (
              <li key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-stone-400">
                    {u.school} · {u.grade}
                  </p>
                </div>
                <span className="text-xs text-stone-400">{u.registeredAt}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
