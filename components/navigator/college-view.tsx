"use client";

import { BedDouble, Check, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { bullets } from "@/components/navigator/institution-view";
import { type NavInst, initials, langAbbr, plural, priceLabel } from "@/lib/nav/types";

export interface CollegeView {
  code: string;
  name: string;
  dir: string; // направление
  ind: string; // отрасль
  langs: string[];
  d9: string[]; // сроки после 9 класса
  d11: string[]; // сроки после 11 класса
  about?: string;
  fit?: string;
  skills?: string;
  format?: string;
  roles?: string;
  notfor?: string;
  cols: NavInst[];
}

const ACCENT = "#0E8A6B";
const TINT = "#ECF7F3";

// Страница специальности колледжа: та же структура, что у ГОП вуза —
// шапка в цвете колледжей, вкладки «О специальности» / «Где учат»
export default function CollegeProgramView({
  p,
  base = "/universities",
  savable = true,
}: {
  p: CollegeView;
  base?: string;
  savable?: boolean;
}) {
  const [tab, setTab] = useState<"about" | "where">("about");
  const [fav, setFav] = useState(false);
  const n = p.cols.length;
  const hasAbout = Boolean(p.about || p.fit || p.skills);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={base} className="text-sm text-stone-400 hover:text-stone-600">
        ← {base === "/universities" ? "К навигатору" : "К справочнику"}
      </Link>

      <div className="mt-5 rounded-3xl p-5 text-white sm:p-7" style={{ background: ACCENT }}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase opacity-80">
              Специальность {p.code} · {p.ind}
            </p>
            <h1 className="font-display mt-1 text-xl leading-snug font-semibold sm:text-2xl">{p.name}</h1>
            <p className="mt-2 text-sm opacity-85">
              {p.dir} · {n} {plural(n, ["колледж", "колледжа", "колледжей"])}
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
            ["about", "О специальности"],
            ["where", `Где учат · ${n}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 pb-2.5 text-sm font-medium transition ${tab === key ? "border-teal-600 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "about" ? (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Q label="Уровень" value="Колледж · ТиПО" />
            <Q label="Языки обучения" value={p.langs.length ? p.langs.map(langAbbr).join(" · ") : "—"} />
            <Q label="После 9 класса" value={p.d9.length ? p.d9.join(" / ") : "—"} />
            <Q label="После 11 класса" value={p.d11.length ? p.d11.join(" / ") : "—"} />
          </div>
          {!hasAbout && (
            <p className="rounded-2xl border border-dashed border-stone-200 py-8 text-center text-sm text-stone-400">
              Описание направления «{p.dir}» уточняется.
            </p>
          )}
          {p.about && <Block title={`О направлении «${p.dir}»`}>{p.about}</Block>}
          {p.fit && (
            <div className="rounded-2xl px-5 py-4" style={{ background: TINT }}>
              <p className="text-sm font-semibold" style={{ color: ACCENT }}>Стоит присмотреться, если</p>
              <ul className="mt-2 space-y-1.5">
                {bullets(p.fit).map((x) => (
                  <li key={x} className="flex gap-2 text-sm text-stone-700">
                    <Check size={15} className="mt-0.5 flex-none" style={{ color: ACCENT }} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {p.skills && <Block title="Чему конкретно научат">{p.skills}</Block>}
          {p.format && <Block title="Формат работы">{p.format}</Block>}
          {p.roles && (
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="font-semibold">Кем можно работать</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {p.roles.split(/\s*;\s*/).filter(Boolean).map((r) => (
                  <span key={r} className="rounded-full bg-teal-100 px-3 py-1 text-xs text-teal-800">{r}</span>
                ))}
              </div>
            </div>
          )}
          {p.notfor && (
            <div className="rounded-2xl bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-800">Кому точно не подойдёт</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-900/80">{p.notfor}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {p.cols.map((d) => (
            <Link
              key={d.i}
              href={`${base}/${d.i}?tab=programs`}
              className="flex items-center gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-teal-300"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl font-mono text-xs font-bold text-white" style={{ background: ACCENT }}>
                {initials(d.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block truncate font-medium">{d.name}</span>
                <span className="mt-0.5 block text-xs text-stone-400">
                  {d.city} · {priceLabel(d.price)}
                </span>
              </span>
              {d.dorm && <BedDouble size={15} className="flex-none text-teal-600" aria-label="Есть общежитие" />}
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
