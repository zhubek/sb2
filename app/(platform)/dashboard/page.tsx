import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReportArt } from "@/components/brand-art";
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

      {/* Комплексный отчёт ИИ — чернильная карта */}
      <section className="mt-10 overflow-hidden rounded-2xl bg-stone-900 p-8 text-white">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">
              Комплексный отчёт ИИ
            </p>
            <h2 className="font-display mt-3 text-xl font-medium">
              {allPassed
                ? "Ваш полный портрет готов"
                : "Остался один шаг"}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-400">
              {allPassed
                ? "Сводный анализ личности, сильных сторон, интересов и карьерных рекомендаций."
                : "Пройдите тест Голланда — и ИИ соберёт подробный анализ вашей личности и карьерных перспектив."}
            </p>
            <Link
              href={allPassed ? "#" : "/tests/holland"}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white py-2.5 pr-5 pl-6 text-sm font-medium text-stone-900 transition hover:bg-amber-300"
            >
              {allPassed ? "Открыть отчёт" : "Пройти тест Голланда"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ReportArt
            dark
            className="hidden h-40 w-48 shrink-0 sm:block"
          />
        </div>
      </section>
    </div>
  );
}
