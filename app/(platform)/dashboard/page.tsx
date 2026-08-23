import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReportThumb } from "@/components/report-blocks";
import TestResultRows from "@/components/test-result-rows";
import { currentUser, tests } from "@/lib/mock-data";

export default function DashboardPage() {
  const passedCount = tests.filter((t) => t.passed).length;
  const allPassed = passedCount === 3;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium tracking-[0.2em] text-stone-400 uppercase">
        Личный кабинет
      </p>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Привет, {currentUser.firstName}
        </h1>
        <p className="font-mono text-sm text-stone-400">
          {passedCount}/3 теста пройдено
        </p>
      </div>

      {/* Результаты тестов */}
      <div className="mt-10">
        <TestResultRows />
      </div>

      {/* Комплексный отчёт ИИ — яркий акцентный баннер с мини-обложкой отчёта */}
      <section className="mt-10 overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-500 to-violet-700 p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-violet-200 uppercase">
              Комплексный отчёт ИИ
            </p>
            <h2 className="font-display mt-3 text-xl text-white">
              {allPassed
                ? "Ваш полный портрет готов"
                : "Остался один шаг"}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-violet-100">
              {allPassed
                ? "Сводный анализ личности, сильных сторон, интересов и карьерных рекомендаций."
                : "Пройдите тест по модели Дж. Холланда (RIASEC) — и ИИ соберёт подробный анализ вашей личности и карьерных перспектив."}
            </p>
            <Link
              href={allPassed ? "/tests/report" : "/tests/holland"}
              className="group mt-6 inline-flex items-center gap-2 rounded-2xl bg-white py-2.5 pr-5 pl-6 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100"
            >
              {allPassed ? "Открыть отчёт" : "Пройти тест"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          {/* Мини-обложка реального отчёта как иллюстрация */}
          <div className="hidden shrink-0 sm:block">
            <ReportThumb />
          </div>
        </div>
      </section>
    </div>
  );
}
