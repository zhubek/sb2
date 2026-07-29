import { BarChart3, Compass, History, UserRound } from "lucide-react";
import Link from "next/link";
import { testHistory, tests } from "@/lib/mock-data";

const testIcons = {
  debruce: BarChart3,
  mbti: UserRound,
  holland: Compass,
} as const;

export default function TestsPage() {
  const passedCount = tests.filter((t) => t.passed).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Тесты
        </h1>
        <p className="mt-1 text-stone-500">
          Диагностика и история результатов · пройдено {passedCount} из 3
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tests.map((t) => {
          const Icon = testIcons[t.id];
          return (
            <div
              key={t.id}
              className={`flex flex-col rounded-2xl border bg-white p-6 ${
                t.flagship
                  ? "border-violet-200 ring-1 ring-violet-100"
                  : "border-stone-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      t.flagship
                        ? "bg-violet-100 text-violet-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <h2 className="font-display font-medium">{t.name}</h2>
                </div>
                {t.passed ? (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
                    пройден
                  </span>
                ) : (
                  <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-500">
                    не пройден
                  </span>
                )}
              </div>
              {t.flagship && (
                <span className="mt-3 -rotate-1 self-start rounded bg-amber-300 px-2 py-0.5 text-[11px] font-semibold text-stone-900">
                  флагманский тест
                </span>
              )}
              <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
                {t.tagline}
              </p>
              <p className="mt-3 font-mono text-xs text-stone-400">
                {t.questions} вопросов · {t.duration}
              </p>
              <Link
                href={t.passed ? `/tests/${t.id}?view=result` : `/tests/${t.id}`}
                className={`mt-4 rounded-full py-2.5 text-center text-sm font-medium transition ${
                  t.passed
                    ? "border border-stone-300 text-stone-700 hover:border-stone-900"
                    : "bg-stone-900 text-white hover:bg-violet-700"
                }`}
              >
                {t.passed ? "Смотреть результат" : "Пройти тест"}
              </Link>
            </div>
          );
        })}
      </div>

      {/* История прохождений */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <History size={16} className="text-stone-400" />
          История прохождений
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Все результаты сохраняются. Перепройти тест можно спустя 30 дней —
          старые результаты остаются в истории.
        </p>
        <ul className="mt-4 divide-y divide-stone-100">
          {testHistory.map((h) => {
            const meta = tests.find((t) => t.id === h.testId)!;
            const Icon = testIcons[h.testId];
            return (
              <li
                key={h.id}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                    <Icon size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{meta.name}</p>
                    <p className="font-mono text-xs text-stone-400">
                      {h.date} · {h.time}
                    </p>
                  </div>
                </div>
                <p className="hidden flex-1 text-sm text-stone-500 sm:block">
                  {h.summary}
                </p>
                <Link
                  href={`/tests/${h.testId}?view=result`}
                  className="shrink-0 text-sm font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-violet-600"
                >
                  Детали
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
