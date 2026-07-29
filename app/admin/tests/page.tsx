import { adminTests } from "@/lib/mock-data";

export default function AdminTestsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Тесты</h1>
          <p className="mt-1 text-stone-500">
            Управление диагностическими инструментами
          </p>
        </div>
        <button className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700">
          + Добавить тест
        </button>
      </div>

      <div className="space-y-4">
        {adminTests.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-stone-200 bg-white p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{t.name}</h2>
                {t.flagship && (
                  <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-medium text-white">
                    Флагманский
                  </span>
                )}
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  {t.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-50">
                  Вопросы
                </button>
                <button className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-50">
                  Настройки
                </button>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Metric label="Вопросов" value={t.questions} />
              <Metric label="Прохождений" value={t.completions.toLocaleString("ru-RU")} />
              <Metric label="Среднее время" value={`${t.avgMinutes} мин`} />
              <Metric label="Перепрохождений" value={t.retakes} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold">Правила перепрохождения</h2>
        <p className="mt-2 text-sm text-stone-600">
          Минимальный интервал между попытками:{" "}
          <span className="font-medium text-stone-900">30 дней</span>. История
          прохождений сохраняется полностью — старые результаты не удаляются.
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-stone-50 px-4 py-3">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-stone-500">{label}</p>
    </div>
  );
}
