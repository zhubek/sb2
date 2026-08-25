"use client";

import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { bullets } from "@/components/navigator/institution-view";
import { type NavInst, fmt, initials, langAbbr, plural } from "@/lib/nav/types";

export interface GopUni {
  d: NavInst;
  k: number; // программ в этом вузе
  p: number | null; // минимальная цена
  g: number | null; // минимальный порог гранта
}
export interface GopInfo {
  code: string;
  name: string;
  ind: string;
  no: number;
  nu: number;
  ent?: string;
  about?: string;
  fit?: string;
  skills?: string;
  format?: string;
  roles?: string;
  notfor?: string;
  accent?: string;
  tint?: string;
  langs?: string[];
  dur?: string;
}

// Страница ГОП: шапка в цвете группы, вкладки «О группе» / «Где учат»
export default function GopView({
  g,
  unis,
  base = "/universities",
  savable = true,
}: {
  g: GopInfo;
  unis: GopUni[];
  base?: string;
  savable?: boolean;
}) {
  const [tab, setTab] = useState<"about" | "where">("about");
  const [fav, setFav] = useState(false);
  const accent = g.accent ?? "#5A5FE8";
  const tint = g.tint ?? "#ECEAFD";

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={base} className="text-sm text-stone-400 hover:text-stone-600">
        ← {base === "/universities" ? "К навигатору" : "К справочнику"}
      </Link>

      <div className="mt-5 rounded-3xl p-5 text-white sm:p-7" style={{ background: accent }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase opacity-80">ГОП {g.code} · {g.ind}</p>
            <h1 className="font-display mt-1 text-xl leading-snug font-semibold sm:text-2xl">{g.name}</h1>
            <p className="mt-2 text-sm opacity-85">
              {g.no} {plural(g.no, ["программа", "программы", "программ"])} в {g.nu} {plural(g.nu, ["вузе", "вузах", "вузах"])}
            </p>
          </div>
          {savable && (
            <button
              onClick={() => setFav(!fav)}
              aria-label="В избранное"
              className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl transition ${fav ? "bg-amber-400 text-stone-900" : "bg-white/15 hover:bg-white/25"}`}
            >
              <Star size={17} fill={fav ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-6 border-b border-stone-200">
        {(
          [
            ["about", "О группе"],
            ["where", `Где учат · ${unis.length}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 pb-2.5 text-sm font-medium transition ${tab === key ? "border-violet-600 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "about" ? (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Q label="Уровень" value="Бакалавриат" />
            <Q label="Срок обучения" value={g.dur ?? "—"} />
            <Q label="Языки обучения" value={g.langs?.length ? g.langs.map(langAbbr).join(" · ") : "—"} />
            <Q label="Предметы ЕНТ" value={g.ent ?? "—"} />
          </div>
          {g.about && <Block title="О чём эта группа">{g.about}</Block>}
          {g.fit && (
            <div className="rounded-2xl px-5 py-4" style={{ background: tint }}>
              <p className="text-sm font-semibold" style={{ color: accent }}>Стоит присмотреться, если</p>
              <ul className="mt-2 space-y-1.5">
                {bullets(g.fit).map((x) => (
                  <li key={x} className="flex gap-2 text-sm text-stone-700">
                    <Check size={15} className="mt-0.5 flex-none" style={{ color: accent }} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {g.skills && <Block title="Чему конкретно научат">{g.skills}</Block>}
          {g.format && <Block title="Формат работы">{g.format}</Block>}
          {g.roles && (
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="font-semibold">Кем можно работать</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {g.roles.split(/\s*;\s*/).filter(Boolean).map((r) => (
                  <span key={r} className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-800">{r}</span>
                ))}
              </div>
            </div>
          )}
          {g.notfor && (
            <div className="rounded-2xl bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-800">Кому точно не подойдёт</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-900/80">{g.notfor}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {unis.map(({ d, k, p, g: th }) => (
            <Link
              key={d.i}
              href={`${base}/${d.i}?tab=programs`}
              className="flex items-center gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-violet-300"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl font-mono text-xs font-bold text-white" style={{ background: accent }}>
                {initials(d.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block truncate font-medium">{d.name}</span>
                <span className="mt-0.5 block text-xs text-stone-400">
                  {d.city}
                  {p != null && ` · ${p === 0 ? "бесплатно" : `от ${fmt(p)} ₸`}`}
                  {th != null && ` · порог ${th}`}
                </span>
              </span>
              <span className="flex-none rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[11px] font-medium text-stone-600">
                {k} ОП
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Q({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
      <p className="text-[11px] font-medium tracking-wide text-stone-400 uppercase">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{children}</p>
    </div>
  );
}
