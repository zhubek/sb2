import { BarChart3, BookOpen, Compass, History, UserRound } from "lucide-react";
import Link from "next/link";
import DownloadReport from "@/components/download-report";
import {
  HollandBars,
  HollandTopTiles,
  MbtiBars,
  TopSkillCards,
} from "@/components/report-blocks";
import {
  currentUser,
  hollandScales,
  testHistory,
  tests,
} from "@/lib/mock-data";

const testIcons = {
  debruce: BarChart3,
  mbti: UserRound,
  holland: Compass,
} as const;

export default function TestsPage() {
  const passedCount = tests.filter((t) => t.passed).length;
  const debruce = tests.find((t) => t.id === "debruce")!;
  const mbti = tests.find((t) => t.id === "mbti")!;
  const holland = tests.find((t) => t.id === "holland")!;

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

      {/* Баннер: комплексная диагностика — главный акцент экрана */}
      <section className="flex flex-wrap items-center justify-between gap-5 rounded-[28px] bg-gradient-to-br from-violet-500 to-violet-700 px-7 py-6">
        <div className="max-w-xl">
          <h2 className="font-display text-lg text-white">
            Комплексная диагностика
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-violet-100">
            {passedCount === 3
              ? "Все три теста пройдены — ИИ собрал навыки, тип личности и интересы в единый портрет с рекомендациями."
              : "Чтобы получить комплексную диагностику, пройдите все три теста — ИИ соберёт навыки, тип личности и интересы в единый портрет с рекомендациями."}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {tests.map((t) => (
              <span
                key={t.id}
                className={`h-1.5 w-16 rounded-full ${t.passed ? "bg-white" : "bg-white/30"}`}
              />
            ))}
            <span className="ml-1 font-mono text-xs text-violet-100">
              {passedCount}/3
            </span>
          </div>
        </div>
        {passedCount === 3 ? (
          <Link
            href="/tests/report"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100"
          >
            Открыть комплексный отчёт →
          </Link>
        ) : (
          <DownloadReport />
        )}
      </section>

      {/* DeBruce — основной тест, визуально крупнее */}
      <section className="rounded-[28px] border-2 border-violet-200 bg-white p-7 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <BarChart3 size={22} strokeWidth={2} />
            </span>
            <div>
              <h2 className="font-display text-xl">{debruce.name}</h2>
              <p className="font-mono text-xs text-stone-400">
                {debruce.questions} вопросов · {debruce.duration}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {debruce.passed && (
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
                пройден
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-medium text-stone-600">
              <BookOpen size={12} className="text-violet-600" />
              {debruce.method}
            </span>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">
          {debruce.tagline} После прохождения достаточно выбрать отрасль — и
          навигатор сразу отфильтрует подходящие программы и заведения.
        </p>

        {/* Краткий результат: топ-3 способности — как в отчёте */}
        {debruce.passed && (
          <div className="mt-5">
            <TopSkillCards />
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={debruce.passed ? "/tests/debruce/report" : "/tests/debruce"}
            className="rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
          >
            {debruce.passed ? "Открыть отчёт" : "Пройти тест"}
          </Link>
          {debruce.passed && (
            <Link
              href="/tests/debruce"
              className="rounded-2xl border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50"
            >
              Перепройти тест
            </Link>
          )}
        </div>
      </section>

      {/* MBTI и Голланд */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* MBTI */}
        <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                <UserRound size={18} strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-display font-medium">{mbti.name}</h2>
                <p className="text-xs text-stone-400">{mbti.method}</p>
                <p className="font-mono text-xs text-stone-400">
                  {mbti.questions} вопросов · {mbti.duration}
                </p>
              </div>
            </div>
            {mbti.passed ? (
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
                пройден
              </span>
            ) : (
              <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-500">
                не пройден
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {mbti.tagline}
          </p>

          {/* Краткий результат: буквы типа + шкалы от центра */}
          {mbti.passed && (
            <div className="mt-4 flex-1">
              <div className="flex items-center gap-2">
                {currentUser.mbtiType.split("").map((letter, i) => (
                  <span
                    key={i}
                    className="font-display flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg text-violet-700"
                  >
                    {letter}
                  </span>
                ))}
                <div className="ml-1.5">
                  <p className="text-sm font-semibold">{currentUser.mbtiTitle}</p>
                  <p className="text-xs text-stone-400">тип личности</p>
                </div>
              </div>
              <div className="mt-4">
                <MbtiBars compact />
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href={mbti.passed ? "/tests/mbti/report" : "/tests/mbti"}
              className="rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              {mbti.passed ? "Открыть отчёт" : "Пройти тест"}
            </Link>
            {mbti.passed && (
              <Link
                href="/tests/mbti"
                className="rounded-2xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50"
              >
                Перепройти
              </Link>
            )}
          </div>
        </div>

        {/* Голланд */}
        <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                <Compass size={18} strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-display font-medium">{holland.name}</h2>
                <p className="text-xs text-stone-400">{holland.method}</p>
                <p className="font-mono text-xs text-stone-400">
                  {holland.questions} вопроса · {holland.duration}
                </p>
              </div>
            </div>
            {holland.passed ? (
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
                пройден
              </span>
            ) : (
              <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-500">
                не пройден
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {holland.tagline} В результате — ваш код RIASEC по шкалам:{" "}
            {hollandScales.map((s) => s.name.toLowerCase()).join(", ")}.
          </p>
          {/* Краткий результат: диаграмма Голланда — как в отчёте */}
          {holland.passed ? (
            <div className="mt-4 flex-1 space-y-4">
              <HollandTopTiles small />
              <HollandBars compact />
            </div>
          ) : (
            <div className="mt-4 flex-1 rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
              <p>
                Последний шаг до комплексной диагностики — после прохождения
                здесь появится ваш код RIASEC и профиль интересов.
              </p>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href={holland.passed ? "/tests/holland/report" : "/tests/holland"}
              className="inline-block rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              {holland.passed ? "Открыть отчёт" : "Пройти тест"}
            </Link>
            {holland.passed && (
              <Link
                href="/tests/holland"
                className="rounded-2xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50"
              >
                Перепройти
              </Link>
            )}
          </div>
        </div>
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
                  href={`/tests/${h.testId}/report`}
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
