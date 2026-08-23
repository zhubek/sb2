import { Sparkles } from "lucide-react";
import Link from "next/link";
import DownloadPdf from "@/components/download-pdf";
import { industryMeta } from "@/components/industry-meta";
import {
  HollandBars,
  HollandTopTiles,
  MbtiBars,
  ReportShell,
  Sect,
  TopSkillCards,
} from "@/components/report-blocks";
import { hollandScales, skills } from "@/lib/mock-data";
import {
  debruceIndustries,
  debruceWhatIs,
  generalReport,
  hollandProfessions,
  hollandWhatIs,
  mbtiReport,
  mbtiWhatIs,
} from "@/lib/report-data";

export const metadata = { title: "Профориентационный отчёт — Smart Bolashaq" };

// Комплексный отчёт по трём тестам — по структуре референсного PDF
// «Профориентационный отчёт»
export default function GeneralReportPage() {
  const sortedHolland = [...hollandScales].sort((a, b) => b.score - a.score);
  const code = sortedHolland.slice(0, 3).map((s) => s.code).join("");
  const codeNames = sortedHolland.slice(0, 3).map((s) => s.name).join(", ");

  return (
    <ReportShell
      eyebrow="AI Профориентатор · Профориентационный отчёт"
      title="Комплексный отчёт"
      subtitle="Сводный анализ по трём тестам: способности, тип личности и интересы"
    >
      {/* Хиро: три ключевых результата */}
      <section className="rounded-[28px] border border-violet-200/70 bg-violet-100 p-7 md:p-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
              Ведущая способность
            </p>
            <p className="font-display mt-1 text-2xl text-violet-700">
              {skills[0].name}
            </p>
            <p className="mt-1 text-xs text-stone-500">тест DeBruce</p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
              Тип личности
            </p>
            <p className="font-display mt-1 text-2xl text-violet-700">
              {mbtiReport.type}
            </p>
            <p className="mt-1 text-xs text-stone-500">{mbtiReport.title}</p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
              Код Холланда
            </p>
            <p className="font-display mt-1 text-2xl tracking-[0.15em] text-violet-700">
              {code}
            </p>
            <p className="mt-1 text-xs text-stone-500">{codeNames}</p>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-white/70 px-5 py-4">
          <p className="text-xs font-semibold tracking-[0.12em] text-violet-600 uppercase">
            Твой профиль
          </p>
          <p className="mt-2 text-sm leading-relaxed text-violet-900/80">
            {generalReport.profile}
          </p>
        </div>
      </section>

      {/* Тест 1. DeBruce */}
      <Sect kicker="Тест 1 · DeBruce" title="Профессиональные способности">
        <p className="max-w-2xl text-sm leading-relaxed text-stone-500">
          {debruceWhatIs}
        </p>
        <p className="mt-4 text-sm font-semibold text-stone-700">
          По итогам теста выявлены три ведущие способности
        </p>
        <div className="mt-3">
          <TopSkillCards />
        </div>
        <div className="mt-4 space-y-2.5">
          {debruceIndustries.map((ind) => {
            const m = industryMeta(ind.name);
            return (
              <div
                key={ind.name}
                className={`flex items-start gap-3 rounded-2xl border px-5 py-4 ${m.card}`}
              >
                <span className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg ${m.iconBg}`}>
                  <m.Icon size={15} />
                </span>
                <div>
                  <p className={`text-sm font-semibold ${m.title}`}>{ind.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">
                    Рекомендуемые профессии: {ind.professions.join(" · ")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Link
          href="/tests/debruce/report"
          className="mt-4 inline-block text-sm font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-violet-600"
        >
          Полный отчёт по способностям →
        </Link>
      </Sect>

      {/* Тест 2. MBTI */}
      <Sect kicker="Тест 2 · MBTI" title="Тип личности">
        <p className="max-w-2xl text-sm leading-relaxed text-stone-500">
          {mbtiWhatIs}
        </p>
        <div className="mt-4 rounded-3xl border border-stone-200 bg-white p-6">
          <p className="font-display text-lg text-stone-800">
            {mbtiReport.type} — {mbtiReport.title}
          </p>
          <p className="mt-1 text-sm text-stone-500">{mbtiReport.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {mbtiReport.descParas[0]}
          </p>
          <p className="mt-5 text-xs font-semibold tracking-[0.1em] text-stone-400 uppercase">
            Показатели по шкалам
          </p>
          <div className="mt-3">
            <MbtiBars />
          </div>
        </div>
        <Link
          href="/tests/mbti/report"
          className="mt-4 inline-block text-sm font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-violet-600"
        >
          Полный отчёт по типу личности →
        </Link>
      </Sect>

      {/* Тест 3. Holland */}
      <Sect kicker="Тест 3 · Holland RIASEC" title="Профессиональные интересы">
        <p className="max-w-2xl text-sm leading-relaxed text-stone-500">
          {hollandWhatIs}
        </p>
        <div className="mt-4 space-y-4">
          <HollandTopTiles />
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <HollandBars />
          </div>
        </div>
        <div className="mt-3 rounded-2xl border border-stone-200 bg-white px-5 py-4">
          <p className="text-sm font-semibold text-stone-800">
            Рекомендуемые профессии по коду {code}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">
            {hollandProfessions
              .slice(0, 6)
              .map((p) => `${p.name} (${p.match}%)`)
              .join(" · ")}
          </p>
        </div>
        <Link
          href="/tests/holland/report"
          className="mt-4 inline-block text-sm font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-violet-600"
        >
          Полный отчёт по интересам →
        </Link>
      </Sect>

      {/* Комплексный ИИ-анализ */}
      <section className="rounded-[28px] border border-violet-200/70 bg-violet-100 p-7 md:p-8">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-violet-600 uppercase">
          <Sparkles size={14} />
          Комплексный ИИ-анализ
        </p>
        <p className="mt-3 text-sm leading-relaxed text-violet-900/75">
          Три теста вместе помогают лучше понять твои сильные стороны. Каждый из
          них показывает разные стороны твоих способностей, а вместе они дают
          более полную картину.
        </p>
        <div className="mt-4 space-y-2.5">
          {generalReport.synthesis.map((s) => (
            <div key={s.test} className="rounded-2xl bg-white px-5 py-4">
              <p className="text-sm font-semibold text-violet-700">{s.test}</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                {s.text}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 leading-relaxed text-violet-900/85">
          {generalReport.conclusion}
        </p>
      </section>

      {/* Действия */}
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <Link
          href="/universities"
          className="rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
        >
          Подобрать программы и вузы
        </Link>
        <DownloadPdf />
      </div>
    </ReportShell>
  );
}
