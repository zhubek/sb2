import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DownloadPdf from "@/components/download-pdf";
import { currentUser, hollandScales, mbtiScales } from "@/lib/mock-data";
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

// Шкалы Голланда — горизонтальные бары, топ-3 подсвечены
export function HollandBars() {
  const sorted = [...hollandScales].sort((a, b) => b.score - a.score);
  return (
    <div className="space-y-3">
      {sorted.map((s, i) => {
        const top = i < 3;
        return (
          <div key={s.code} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-xs font-bold ${
                top ? "bg-violet-600 text-white" : "bg-stone-100 text-stone-500"
              }`}
            >
              {s.code}
            </span>
            <span className="w-44 flex-none text-sm font-medium text-stone-700">
              {s.name}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full ${top ? "bg-violet-500" : "bg-stone-300"}`}
                style={{ width: `${s.score}%` }}
              />
            </div>
            <span className="w-10 flex-none text-right font-mono text-sm text-stone-600">
              {s.score}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Шкалы MBTI — бар растёт от центра к выигравшему полюсу (как в референсном
// отчёте): слева и справа названия полюсов, посередине разделитель
export function MbtiBars({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {mbtiScales.map((s) => {
        const leftWin = s.side === "left";
        return (
          <div key={s.left}>
            <div
              className={`flex justify-between font-medium ${compact ? "text-[11px]" : "text-xs"}`}
            >
              <span className={leftWin ? "font-semibold text-violet-700" : "text-stone-400"}>
                {s.left}
              </span>
              <span className={leftWin ? "text-stone-400" : "font-semibold text-violet-700"}>
                {s.right}
              </span>
            </div>
            <div className={`mt-1.5 flex items-center ${compact ? "h-2" : "h-2.5"}`}>
              <div className="flex h-full flex-1 justify-end overflow-hidden rounded-l-full bg-stone-100">
                {leftWin && (
                  <div
                    className="h-full rounded-l-full bg-violet-500"
                    style={{ width: `${s.value}%` }}
                  />
                )}
              </div>
              <div className="h-[calc(100%+6px)] w-0.5 flex-none rounded bg-stone-300" />
              <div className="flex h-full flex-1 overflow-hidden rounded-r-full bg-stone-100">
                {!leftWin && (
                  <div
                    className="h-full rounded-r-full bg-violet-500"
                    style={{ width: `${s.value}%` }}
                  />
                )}
              </div>
            </div>
            <p
              className={`mt-1 text-violet-600 ${compact ? "text-[11px]" : "text-xs"} ${
                leftWin ? "text-left" : "text-right"
              }`}
            >
              {s.value}% · {s.winner}
            </p>
          </div>
        );
      })}
    </div>
  );
}
