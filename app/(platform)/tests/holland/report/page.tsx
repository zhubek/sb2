import Link from "next/link";
import {
  HollandBars,
  HollandTopTiles,
  ReportShell,
  Sect,
} from "@/components/report-blocks";
import { hollandScales } from "@/lib/mock-data";
import {
  hollandCodeMeaning,
  hollandProfessions,
  hollandSixTypes,
  hollandTopTypes,
  hollandWhatIs,
} from "@/lib/report-data";

export const metadata = { title: "Отчёт Holland RIASEC — Smart Bolashaq" };

// Отчёт по тесту Голланда — по структуре референсного PDF «Отчёт по Holland RIASEC»
export default function HollandReportPage() {
  const sorted = [...hollandScales].sort((a, b) => b.score - a.score);
  const code = sorted.slice(0, 3).map((s) => s.code).join("");
  const codeNames = sorted.slice(0, 3).map((s) => s.name).join(", ");
  const topProf = hollandProfessions[0];

  return (
    <ReportShell
      eyebrow="AI Профориентатор · Профессиональные интересы"
      title="Holland RIASEC"
      subtitle="Профиль профессиональных интересов"
    >
      {/* Хиро: код, ведущий тип, топ-профессия */}
      <section className="rounded-[28px] border border-violet-200/70 bg-violet-100 p-7 md:p-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
              Код Холланда
            </p>
            <p className="font-display mt-1 text-3xl tracking-[0.15em] text-violet-700">
              {code}
            </p>
            <p className="mt-1 text-xs text-stone-500">{codeNames}</p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
              Ведущий тип интересов
            </p>
            <p className="font-display mt-1 text-2xl text-violet-700">
              {sorted[0].name}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {sorted[0].score}% выраженности
            </p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
              Совпадение с топ-профессией
            </p>
            <p className="font-display mt-1 text-3xl text-violet-700">
              {topProf.match}%
            </p>
            <p className="mt-1 text-xs text-stone-500">{topProf.name}</p>
          </div>
        </div>
      </section>

      <Sect title="Что такое Holland RIASEC?">
        <p className="max-w-2xl leading-relaxed text-stone-600">{hollandWhatIs}</p>
      </Sect>

      <Sect title="Шесть типов интересов">
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-stone-500">
          Модель Холланда описывает шесть базовых типов. У каждого человека
          выражены все шесть в разной степени — важно их сочетание. Выделены
          цветом те, что вошли в твой код.
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {hollandSixTypes.map((t) => {
            const inCode = code.includes(t.code);
            return (
              <div
                key={t.code}
                className={`rounded-2xl px-4 py-3.5 ${
                  inCode
                    ? "bg-violet-100"
                    : "border border-stone-200 bg-white"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${inCode ? "text-violet-800" : "text-stone-700"}`}
                >
                  <span
                    className={`mr-1.5 font-mono ${inCode ? "text-violet-500" : "text-stone-400"}`}
                  >
                    {t.code}
                  </span>
                  {t.name}
                </p>
                <p
                  className={`mt-1 text-xs leading-relaxed ${inCode ? "text-violet-900/70" : "text-stone-500"}`}
                >
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Sect>

      <Sect kicker="Диагностика" title="Твои результаты">
        <div className="space-y-4">
          <HollandTopTiles />
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <HollandBars />
          </div>
        </div>
      </Sect>

      <Sect title={`Что означает код ${code}`}>
        <p className="max-w-2xl leading-relaxed text-stone-600">
          {hollandCodeMeaning}
        </p>
      </Sect>

      {/* Топ-3 типа подробно */}
      <div className="space-y-3">
        {hollandTopTypes.map((t) => {
          const scale = hollandScales.find((s) => s.code === t.code)!;
          return (
            <section
              key={t.code}
              className="rounded-3xl border border-stone-200 bg-white p-6 md:p-7"
            >
              <h3 className="font-display text-lg text-stone-800">
                {t.name} тип ({t.code}) —{" "}
                <span className="text-violet-600">{scale.score}%</span>
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-stone-600">
                {t.desc}
              </p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold tracking-[0.1em] text-stone-400 uppercase">
                    Сильные стороны
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {t.strengths.map((s) => (
                      <li key={s} className="flex gap-2 text-sm text-stone-600">
                        <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-emerald-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.1em] text-stone-400 uppercase">
                    Где раскрывается
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {t.where.map((s) => (
                      <li key={s} className="flex gap-2 text-sm text-stone-600">
                        <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-violet-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Рекомендуемые профессии */}
      <Sect kicker="Рекомендации" title="Рекомендуемые профессии">
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-stone-500">
          Подобраны по совпадению с твоим кодом {code}. Процент показывает,
          насколько интересы профессии соответствуют твоему профилю.
        </p>
        <div className="space-y-2">
          {hollandProfessions.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-3.5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-stone-800">{p.name}</p>
                <p className="text-xs leading-relaxed text-stone-500">
                  {p.desc}
                </p>
              </div>
              <div className="hidden h-1.5 w-24 flex-none overflow-hidden rounded-full bg-stone-100 sm:block">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${p.match}%` }}
                />
              </div>
              <span className="w-10 flex-none text-right font-mono text-sm font-semibold text-violet-600">
                {p.match}%
              </span>
            </div>
          ))}
        </div>
      </Sect>

      <div className="text-center print:hidden">
        <Link
          href="/tests/report"
          className="inline-block rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
        >
          Открыть комплексный отчёт
        </Link>
      </div>
    </ReportShell>
  );
}
