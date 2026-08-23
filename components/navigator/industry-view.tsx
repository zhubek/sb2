"use client";

import { ArrowRight, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { industryIcon } from "@/components/navigator/industry-icons";
import { plural } from "@/lib/nav/types";

export interface ProfView {
  name: string;
  desc: string | null;
  ops: { code: string; name: string; v: number; c: number }[];
  uv?: number;
  uc?: number;
}
export interface GroupView {
  name: string;
  about?: string | null;
  profs: ProfView[];
}
export interface IndustryView {
  name: string;
  desc: string;
  c: string;
  cl: string;
  stats: { p: number; g: number; vop: number; cop: number };
  groups: GroupView[];
}

// Страница отрасли: шапка со статистикой, направления с профессиями,
// шторка профессии «Где учат», одна кнопка — в навигатор
export default function IndustryPage({ ind }: { ind: IndustryView }) {
  const Icon = industryIcon(ind.name);
  const [open, setOpen] = useState<string | null>(ind.groups[0]?.name ?? null);
  const [prof, setProf] = useState<{ p: ProfView; g: string } | null>(null);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/universities/industries" className="text-sm text-stone-400 hover:text-stone-600">
        ← Все отрасли
      </Link>

      {/* Шапка */}
      <div className="mt-5 rounded-3xl p-7 text-white" style={{ background: `linear-gradient(150deg, ${ind.c}, ${ind.c}CC)` }}>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Icon size={24} />
        </span>
        <h1 className="font-display mt-4 text-2xl leading-snug font-semibold md:text-3xl">{ind.name}</h1>
        <p className="mt-2 max-w-xl text-sm opacity-90">{ind.desc}</p>
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {(
            [
              [ind.stats.p, "профессий"],
              [ind.stats.g, "направлений"],
              [ind.stats.vop + ind.stats.cop, "программ"],
            ] as const
          ).map(([n, l]) => (
            <div key={l} className="rounded-2xl bg-white/15 px-4 py-3">
              <p className="font-display text-2xl font-semibold">{n}</p>
              <p className="text-xs opacity-85">{l}</p>
            </div>
          ))}
        </div>
        <Link
          href={`/universities?industry=${encodeURIComponent(ind.name)}`}
          className="group mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
        >
          Смотреть, где этому учат
          <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Направления и профессии */}
      <p className="mt-8 mb-3 text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">Направления и профессии</p>
      <div className="space-y-2.5">
        {ind.groups.map((g) => {
          const on = open === g.name;
          return (
            <div key={g.name} className="rounded-2xl border border-stone-200 bg-white">
              <button onClick={() => setOpen(on ? null : g.name)} className="flex w-full items-center gap-3 px-5 py-4 text-left">
                <span className="flex-1 font-medium">{g.name}</span>
                <span className="rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold" style={{ background: ind.cl, color: ind.c }}>
                  {g.profs.length}
                </span>
                <ChevronDown size={16} className={`text-stone-300 transition ${on ? "rotate-180" : ""}`} />
              </button>
              {on && (
                <div className="border-t border-stone-100 px-5 pt-3 pb-4">
                  {g.about && <p className="mb-3 text-sm leading-relaxed text-stone-500">{g.about}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {g.profs.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setProf({ p, g: g.name })}
                        className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Шторка профессии */}
      {prof && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-stone-900/50 px-4 pb-4 sm:items-center" onClick={() => setProf(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold">{prof.p.name}</h3>
                <p className="mt-0.5 text-xs text-stone-400">{prof.g} · {ind.name}</p>
              </div>
              <button onClick={() => setProf(null)} aria-label="Закрыть" className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
                <X size={17} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              {prof.p.desc ?? `«${prof.p.name}» — одна из профессий направления «${prof.g}».`}
            </p>
            <p className="mt-5 text-xs font-semibold tracking-[0.12em] uppercase" style={{ color: ind.c }}>
              Где учат этой профессии
            </p>
            <p className="mt-1 text-xs text-stone-400">
              {prof.p.ops.length} {plural(prof.p.ops.length, ["программа", "программы", "программ"])}
              {prof.p.uv ? `, вузов с такими программами — ${prof.p.uv}` : ""}
              {prof.p.uc ? `, колледжей — ${prof.p.uc}` : ""}
            </p>
            <div className="mt-3 space-y-2">
              {prof.p.ops.slice(0, 7).map((o) => (
                <div key={o.code + o.name} className="rounded-xl border border-stone-200 px-4 py-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] font-semibold" style={{ color: ind.c }}>{o.code}</span>
                    <span className="text-sm font-medium">{o.name}</span>
                  </div>
                  <div className="mt-1.5 flex gap-1.5">
                    {o.v > 0 && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-800">{o.v} {plural(o.v, ["вуз", "вуза", "вузов"])}</span>}
                    {o.c > 0 && <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-800">{o.c} {plural(o.c, ["колледж", "колледжа", "колледжей"])}</span>}
                    {!o.v && !o.c && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-500">нет данных</span>}
                  </div>
                </div>
              ))}
            </div>
            {prof.p.ops.length > 7 && (
              <p className="mt-2 text-xs font-medium text-stone-400">и ещё {prof.p.ops.length - 7} {plural(prof.p.ops.length - 7, ["программа", "программы", "программ"])} — в навигаторе</p>
            )}
            <Link
              href={`/universities?industry=${encodeURIComponent(ind.name)}`}
              className="mt-5 block rounded-2xl bg-violet-500 py-3 text-center text-sm font-medium text-white transition hover:bg-violet-600"
            >
              Открыть навигатор
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
