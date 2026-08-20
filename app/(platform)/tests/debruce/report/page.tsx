import Link from "next/link";
import { ReportShell, Sect } from "@/components/report-blocks";
import { skills } from "@/lib/mock-data";
import {
  debruceAdditional,
  debruceAdditionalIndustries,
  debruceIndustries,
  debruceTop,
  debruceWhatIs,
} from "@/lib/report-data";

export const metadata = { title: "Отчёт DeBruce — Smart Bolashaq" };

// Отчёт по тесту DeBruce — по структуре референсного PDF «Отчёт DeBruce»
export default function DebruceReportPage() {
  return (
    <ReportShell
      eyebrow="AI Профориентатор · Отчёт по способностям"
      title="DeBruce Agilities"
      subtitle="Профессиональные способности"
    >
      {/* Хиро: топ-3 способности */}
      <section className="rounded-[28px] border border-violet-200/70 bg-violet-100 p-7 md:p-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-violet-600 uppercase">
          Три ведущие способности
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {debruceTop.map((a, i) => (
            <div key={a.name} className="rounded-2xl bg-white px-4 py-4">
              <p className="font-mono text-xs font-semibold text-violet-600">
                Способность {i + 1}
              </p>
              <p className="font-display mt-1 text-lg text-violet-800">
                {a.name}
              </p>
              <p className="text-xs text-stone-400">{a.en}</p>
            </div>
          ))}
        </div>
      </section>

      <Sect title="Что такое DeBruce Agilities?">
        <p className="max-w-2xl leading-relaxed text-stone-600">{debruceWhatIs}</p>
      </Sect>

      {/* Подробно по каждой из топ-3 */}
      {debruceTop.map((a, i) => (
        <section
          key={a.name}
          className="rounded-3xl border border-stone-200 bg-white p-6 md:p-7"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-violet-600 font-mono text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-xl text-stone-800">{a.name}</h2>
              <p className="text-sm text-stone-500">{a.subtitle}</p>
            </div>
          </div>
          <p className="mt-4 leading-relaxed text-stone-600">{a.desc}</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-stone-400 uppercase">
                Как проявляется
              </p>
              <ul className="mt-2.5 space-y-2">
                {a.manifest.map((m) => (
                  <li key={m} className="flex gap-2 text-sm text-stone-600">
                    <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-violet-400" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-stone-400 uppercase">
                Сильные стороны
              </p>
              <ul className="mt-2.5 space-y-2">
                {a.strengths.map((m) => (
                  <li key={m} className="flex gap-2 text-sm text-stone-600">
                    <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-emerald-400" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-stone-400 uppercase">
                Как развивать
              </p>
              <ul className="mt-2.5 space-y-2">
                {a.develop.map((m) => (
                  <li key={m} className="flex gap-2 text-sm text-stone-600">
                    <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-amber-400" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* Полный рейтинг */}
      <Sect kicker="Рейтинг" title="Все 10 навыков">
        <div className="space-y-2">
          {skills.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${
                  i < 3 ? "bg-violet-600 text-white" : "bg-stone-100 text-stone-500"
                }`}
              >
                {i + 1}
              </span>
              <span className="w-48 flex-none text-sm font-medium text-stone-700">
                {s.name}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full ${i < 3 ? "bg-violet-500" : "bg-stone-300"}`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <span className="w-8 flex-none text-right font-mono text-sm text-stone-600">
                {s.score}
              </span>
            </div>
          ))}
        </div>
      </Sect>

      {/* Дополнительные способности */}
      <Sect kicker="Подробнее" title="Дополнительные способности">
        <div className="space-y-3">
          {debruceAdditional.map((a, i) => (
            <div
              key={a.name}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <p className="font-semibold text-stone-800">
                <span className="font-mono text-sm text-stone-400">{i + 4}</span>{" "}
                {a.name}{" "}
                <span className="text-sm font-normal text-stone-400">
                  · {a.en}
                </span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </Sect>

      {/* Рекомендуемые отрасли */}
      <Sect kicker="Рекомендации" title="Рекомендуемые отрасли">
        <div className="space-y-3">
          {debruceIndustries.map((ind) => (
            <div key={ind.name} className="rounded-3xl bg-violet-100 p-6">
              <h3 className="font-display text-lg text-violet-800">
                {ind.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-violet-900/75">
                {ind.desc}
              </p>
              <p className="mt-3 text-sm text-violet-800/70">
                <span className="font-semibold text-violet-800">
                  Рекомендуемые профессии:
                </span>{" "}
                {ind.professions.join(" · ")}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm font-semibold text-stone-700">
          Дополнительные рекомендации
        </p>
        <p className="mt-1 text-sm text-stone-500">
          Эти отрасли также могут быть интересны, поскольку соответствуют двум
          из твоих ведущих способностей.
        </p>
        <div className="mt-3 space-y-3">
          {debruceAdditionalIndustries.map((ind) => (
            <div
              key={ind.name}
              className="rounded-3xl border border-stone-200 bg-white p-6"
            >
              <h3 className="font-display text-lg text-stone-800">{ind.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {ind.desc}
              </p>
              <p className="mt-3 text-sm text-stone-500">
                <span className="font-semibold text-stone-700">
                  Рекомендуемые профессии:
                </span>{" "}
                {ind.professions.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Sect>

      {/* Следующий шаг */}
      <section className="rounded-[28px] border border-violet-200/70 bg-violet-100 p-6 text-center md:p-7 print:hidden">
        <p className="font-display text-lg text-violet-800">
          Что дальше?
        </p>
        <p className="mx-auto mt-1.5 max-w-lg text-sm text-violet-900/75">
          По этим способностям навигатор уже подобрал подходящие программы и
          учебные заведения.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/tests/debruce?view=result"
            className="rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
          >
            Перейти к рекомендациям
          </Link>
          <Link
            href="/tests/report"
            className="rounded-2xl bg-white px-6 py-2.5 text-sm font-medium text-violet-700 transition hover:text-violet-800"
          >
            Комплексный отчёт
          </Link>
        </div>
      </section>
    </ReportShell>
  );
}
