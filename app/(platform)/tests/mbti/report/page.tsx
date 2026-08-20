import Link from "next/link";
import { CheckList, MbtiBars, ReportShell, Sect } from "@/components/report-blocks";
import { mbtiReport, mbtiWhatIs } from "@/lib/report-data";

export const metadata = { title: "Отчёт MBTI — Smart Bolashaq" };

// Отчёт по тесту MBTI — по структуре референсного PDF «Отчёт по MBTI»
export default function MbtiReportPage() {
  const r = mbtiReport;
  return (
    <ReportShell
      eyebrow="AI Профориентатор · Отчёт MBTI"
      title={`${r.type} — ${r.title}`}
      subtitle={r.tagline}
    >
      {/* Хиро: четыре буквы типа */}
      <section className="rounded-[28px] border border-violet-200/70 bg-violet-100 p-7 md:p-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {r.letters.map((l) => (
            <div key={l.l} className="rounded-2xl bg-white px-4 py-4 text-center">
              <p className="font-display text-3xl text-violet-700">{l.l}</p>
              <p className="mt-1 text-sm font-medium text-stone-700">{l.name}</p>
              <p className="text-xs text-stone-400">{l.scale}</p>
            </div>
          ))}
        </div>
      </section>

      <Sect title="Что такое MBTI?">
        <p className="max-w-2xl leading-relaxed text-stone-600">{mbtiWhatIs}</p>
      </Sect>

      <Sect kicker="Твой тип" title={`${r.type} — ${r.title}`}>
        <div className="space-y-4">
          {r.descParas.map((p) => (
            <p key={p.slice(0, 24)} className="leading-relaxed text-stone-600">
              {p}
            </p>
          ))}
        </div>
      </Sect>

      <Sect kicker="Диагностика" title="Показатели по шкалам">
        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <MbtiBars />
        </div>
      </Sect>

      <Sect title="Твои сильные стороны">
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-stone-600">
          {r.strengthsIntro}
        </p>
        <CheckList items={r.strengths} />
      </Sect>

      <Sect title="Полезно развивать">
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-stone-600">
          {r.developIntro}
        </p>
        <ul className="space-y-1.5">
          {r.develop.map((d) => (
            <li
              key={d}
              className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-stone-700"
            >
              <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-amber-400" />
              {d}
            </li>
          ))}
        </ul>
      </Sect>

      <Sect title="Рекомендации">
        <p className="max-w-2xl leading-relaxed text-stone-600">
          {r.recommendation}
        </p>
      </Sect>

      {/* Итог */}
      <section className="rounded-[28px] border border-violet-200/70 bg-violet-100 p-7">
        <p className="text-xs font-semibold tracking-[0.14em] text-violet-600 uppercase">
          Итог
        </p>
        <p className="mt-3 leading-relaxed text-violet-900/80">{r.summary}</p>
      </section>

      <Sect title={`Известные люди с типом ${r.type}`}>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-stone-500">
          {r.famousNote}
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {r.famous.map((f) => (
            <div
              key={f.name}
              className="rounded-2xl border border-stone-200 bg-white px-4 py-3"
            >
              <p className="text-sm font-semibold text-stone-800">{f.name}</p>
              <p className="text-xs text-stone-500">{f.desc}</p>
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
