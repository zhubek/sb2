import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DownloadPdf from "@/components/download-pdf";
import { currentUser, hollandScales, mbtiScales, skills } from "@/lib/mock-data";
import { reportDisclaimer } from "@/lib/report-data";

// ─── Общие блоки страниц-отчётов (редакционный стиль платформы) ──────────────

export function ReportShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl [-webkit-print-color-adjust:exact] [print-color-adjust:exact]">
      <Link
        href="/tests"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 transition hover:text-stone-600 print:hidden"
      >
        <ArrowLeft size={14} />
        К тестам
      </Link>

      {/* Шапка отчёта */}
      <div className="mt-6 border-b-2 border-stone-900 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-violet-600 uppercase">
              {eyebrow}
            </p>
            <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-stone-500">{subtitle}</p>}
          </div>
          <DownloadPdf />
        </div>
        <p className="mt-4 text-sm text-stone-500">
          <span className="font-medium text-stone-800">
            {currentUser.firstName} {currentUser.lastName}
          </span>{" "}
          · {currentUser.grade} · {currentUser.school} · 16 июля 2026
        </p>
      </div>

      <div className="mt-8 space-y-8">{children}</div>

      {/* Дисклеймер */}
      <p className="mt-12 border-t border-stone-200 pt-5 text-xs leading-relaxed text-stone-400">
        {reportDisclaimer}
      </p>
    </div>
  );
}

export function Sect({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="break-inside-avoid">
      {kicker && (
        <p className="text-xs font-semibold tracking-[0.14em] text-stone-400 uppercase">
          {kicker}
        </p>
      )}
      <h2 className="font-display mt-1.5 text-xl text-stone-800 md:text-2xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// Список с галочками — как «что откроется» на лендинге
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it) => (
        <li
          key={it}
          className="flex items-start gap-2.5 rounded-xl bg-stone-50 px-4 py-2.5 text-sm text-stone-700"
        >
          <span className="mt-0.5 flex h-[17px] w-[17px] flex-none items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
            ✓
          </span>
          {it}
        </li>
      ))}
    </ul>
  );
}

// Топ-3 навыка — нумерация и названия как в отчёте
export function TopSkillCards() {
  return (
    <div className="grid gap-2 sm:grid-cols-3 sm:gap-2.5">
      {skills.slice(0, 3).map((s, i) => (
        <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-violet-100 px-4 py-3 sm:block sm:py-4">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-violet-600 font-mono text-xs font-bold text-white">
            {i + 1}
          </span>
          <div className="min-w-0 sm:mt-2">
            <p className="text-sm font-semibold text-violet-900">{s.name}</p>
            {s.en && <p className="text-xs text-violet-700/60">{s.en}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Плитки топ-3 типов Голланда — как в отчёте: буква, «топ n», название, %
export function HollandTopTiles({ small = false }: { small?: boolean }) {
  const sorted = [...hollandScales].sort((a, b) => b.score - a.score).slice(0, 3);
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
      {sorted.map((s, i) => (
        <div
          key={s.code}
          className={`relative min-w-0 rounded-2xl bg-violet-100 text-center ${small ? "px-1.5 py-3 sm:px-2" : "px-2 py-4 sm:px-4 sm:py-5"}`}
        >
          {/* «ТОП n» — в углу, всё остальное по центру, как в отчёте */}
          <span className="absolute top-2 right-2.5 font-mono text-[10px] tracking-wider text-violet-500 uppercase">
            топ {i + 1}
          </span>
          <p className={`font-display leading-none text-violet-700 ${small ? "mt-1 text-2xl" : "mt-2 text-4xl"}`}>
            {s.code}
          </p>
          <p className={`mt-2 leading-tight font-semibold tracking-tight text-violet-900 sm:tracking-normal ${small ? "text-[10.5px] sm:text-xs" : "text-[11px] sm:text-sm"}`}>
            {s.name}
          </p>
          <p className={`mt-0.5 font-mono text-violet-700 ${small ? "text-xs" : "text-sm"}`}>
            {s.score}%
          </p>
        </div>
      ))}
    </div>
  );
}

// Шкалы Голланда — как в отчёте: топ-3 с градиентом, остальные серые
export function HollandBars({ compact = false }: { compact?: boolean }) {
  const sorted = [...hollandScales].sort((a, b) => b.score - a.score);
  return (
    <div className={compact ? "space-y-2.5" : "space-y-3.5"}>
      {sorted.map((s, i) => {
        const top = i < 3;
        return (
          <div key={s.code}>
            {i === 3 && <div className="mb-2.5 border-t border-stone-100" />}
            <div className="flex items-center gap-3">
              <span
                className={`flex-none ${compact ? "w-36 text-[11px] sm:w-40 sm:text-xs" : "w-36 text-xs sm:w-52 sm:text-sm"} ${
                  top ? "font-semibold text-violet-900" : "text-stone-400"
                }`}
              >
                {s.name} ({s.code})
              </span>
              <div
                className={`flex-1 overflow-hidden rounded-full bg-stone-100 ${compact ? "h-2.5" : "h-3.5"}`}
              >
                <div
                  className={`h-full rounded-full ${
                    top
                      ? "bg-gradient-to-r from-sky-400 to-violet-600"
                      : "bg-stone-300"
                  }`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <span
                className={`w-9 flex-none text-right font-mono sm:w-11 ${compact ? "text-xs" : "text-sm"} ${
                  top ? "font-bold text-violet-700" : "text-stone-400"
                }`}
              >
                {s.score}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Мини-обложка отчёта — иллюстративный элемент для баннеров
export function ReportThumb() {
  return (
    <div className="w-44 rotate-2 rounded-xl bg-white p-4 shadow-lg shadow-violet-900/20">
      <p className="text-[7px] font-semibold tracking-[0.16em] text-violet-600 uppercase">
        AI Профориентатор
      </p>
      <p className="font-display mt-1 text-[11px] leading-tight font-semibold text-stone-800">
        Комплексный отчёт
      </p>
      <p className="mt-0.5 text-[7px] text-stone-400">
        {currentUser.firstName} {currentUser.lastName} · {currentUser.grade}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-1">
        {["Креативность", "ENFJ", "ASE"].map((v) => (
          <div key={v} className="rounded bg-violet-100 px-1 py-1.5 text-center">
            <p className="truncate text-[6.5px] font-bold text-violet-800">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-1">
        {[92, 88, 85, 74].map((w) => (
          <div key={w} className="h-1 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-600"
              style={{ width: `${w}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-0.5">
        <div className="h-0.5 w-full rounded bg-stone-100" />
        <div className="h-0.5 w-4/5 rounded bg-stone-100" />
        <div className="h-0.5 w-2/3 rounded bg-stone-100" />
      </div>
    </div>
  );
}

// Шкалы MBTI — как в референсном отчёте: один трек на всю ширину, бар
// закреплён у края выигравшего полюса и тянется к середине; процент — между
// треком и правой подписью, выигравший полюс выделен жирным
export function MbtiBars({ compact = false }: { compact?: boolean }) {
  const label = compact ? "text-[11px]" : "text-xs";
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {mbtiScales.map((s) => {
        const leftWin = s.side === "left";
        const track = (
          <div className={`relative flex-1 overflow-hidden rounded-full bg-stone-100 ${compact ? "h-3" : "h-4"}`}>
            <div
              className={`absolute inset-y-0 rounded-full ${
                leftWin
                  ? "left-0 bg-gradient-to-r from-violet-600 to-indigo-400"
                  : "right-0 bg-gradient-to-l from-violet-600 to-indigo-400"
              }`}
              style={{ width: `${s.value}%` }}
            />
          </div>
        );
        const pct = <span className="font-mono font-bold text-violet-700">{s.value}%</span>;
        return (
          <div key={s.left}>
            {/* Телефон: подписи над треком, процент у выигравшего полюса */}
            <div className="sm:hidden">
              <div className={`mb-1.5 flex items-baseline justify-between gap-3 ${compact ? "text-xs" : "text-[13px]"}`}>
                <span className={leftWin ? "font-bold text-violet-800" : "text-stone-400"}>
                  {leftWin && <>{pct} </>}
                  {s.left}
                </span>
                <span className={`text-right ${leftWin ? "text-stone-400" : "font-bold text-violet-800"}`}>
                  {s.right}
                  {!leftWin && <> {pct}</>}
                </span>
              </div>
              {track}
            </div>

            {/* Планшет и шире: подпись · трек · % · подпись — как в отчёте */}
            <div className="hidden items-center gap-3 sm:flex">
              <span
                className={`flex-none text-right ${compact ? "w-24" : "w-32"} ${label} ${
                  leftWin ? "font-bold text-violet-800" : "font-medium text-stone-400"
                }`}
              >
                {s.left}
              </span>
              {track}
              <span className={`w-10 flex-none text-right font-bold text-violet-700 ${compact ? "text-xs" : "text-sm"}`}>
                {s.value}%
              </span>
              <span
                className={`flex-none ${compact ? "w-24" : "w-32"} ${label} ${
                  leftWin ? "font-medium text-stone-400" : "font-bold text-violet-800"
                }`}
              >
                {s.right}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
