"use client";
import { useCopy } from "@/lib/cms/client";

import { ContentText } from "@/lib/cms/client";


import {
  BedDouble,
  Check,
  ChevronDown,
  Globe,
  Camera,
  Mail,
  MapPin,
  Phone,
  Plane,
  Shield,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { instagramUrl } from "@/lib/nav/instagram";
import { KIND, type NavInst, fmt, initials, langAbbr, plural, priceLabel } from "@/lib/nav/types";

export interface ViewOp {
  contentId?: string;
  code: string;
  name: string;
  p?: number | null;
  t?: number | null;
  e?: string[];
  l?: string;
  dur?: number | string;
}
export interface ViewGroup {
  code: string; // код ГОП или "" для групп по отрасли/направлению
  label?: string; // подпись над названием: «ГОП 6B061», «Направление», «Отрасль»
  name: string;
  ind?: string;
  dur?: string;
  langs?: string[];
  ent?: string;
  about?: string;
  fit?: string;
  skills?: string;
  format?: string;
  roles?: string;
  notfor?: string;
  accent?: string;
  tint?: string;
  ops: ViewOp[];
}
export interface ViewDetail {
  about: string;
  addr?: string | null;
  phone?: string | null;
  email?: string | null;
  site?: string | null;
  ig?: string | null;
  spec?: string | null;
  priceTxt?: string | null;
  lang?: string | null;
  docs?: string | null;
}

export function bullets(txt: string) {
  const parts = txt.split(/\s*•\s*/).map((x) => x.trim()).filter(Boolean);
  return parts.length < 2 ? [txt] : parts;
}

// Страница заведения: шапка по типу, две вкладки — «О заведении» и «Программы»
export default function InstitutionView({
  d,
  detail,
  groups,
  initialTab = "about",
  base = "/universities",
  savable = true,
}: {
  d: NavInst;
  detail: ViewDetail;
  groups: ViewGroup[];
  initialTab?: "about" | "programs";
  base?: string;
  savable?: boolean;
}) {
  const pageCopy = useCopy("copy.components.navigator.institution-view");
  const [tab, setTab] = useState<"about" | "programs">(initialTab);
  const [fav, setFav] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const k = KIND[d.kind];
  const isA = d.kind === "a";
  const isV = d.kind === "v";
  const nOps = groups.reduce((a, g) => a + g.ops.length, 0);
  const instagram = instagramUrl(detail.ig);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={base} className="text-sm text-stone-400 hover:text-stone-600">
        ← {base === "/universities" ? pageCopy("x001","К навигатору") : pageCopy("x002","К справочнику")}
      </Link>

      {/* Шапка */}
      <div className="mt-5 overflow-hidden rounded-3xl p-5 text-white sm:p-7" style={{ background: k.color }}>
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white/15 font-mono text-base font-bold sm:h-16 sm:w-16 sm:text-lg">
            {initials(d.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase opacity-80">{k.label}</p>
            <h1 className="font-display mt-1 text-xl leading-snug font-semibold sm:text-2xl">{d.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm opacity-80">
              <MapPin size={14} />
              {isA ? `${d.country}, ${d.city}` : d.city}
            </p>
          </div>
          {savable && (
            <button
              onClick={() => setFav(!fav)}
              className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl transition ${fav ? "bg-amber-400 text-stone-900" : "bg-white/15 hover:bg-white/25"}`}
              aria-label={pageCopy("x003","В избранное")}
            >
              <Star size={17} fill={fav ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>

      {/* Вкладки */}
      <div className="mt-5 flex gap-6 border-b border-stone-200">
        {(
          [
            ["about", pageCopy("x004","О заведении")],
            ["programs", `Программы · ${nOps}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 pb-2.5 text-sm font-medium transition ${
              tab === key ? "border-violet-600 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "about" ? (
        <div className="mt-5 space-y-5">
          {/* Ключевые факты */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {isA ? (
              <>
                <Fact label={pageCopy("x005","Стоимость")} value={(detail.priceTxt ?? pageCopy("x006","см. на сайте")).split(";")[0]} wide />
                <Fact label={pageCopy("x007","Язык обучения")} value={(detail.lang ?? "—").split(/[.(]/)[0]} wide />
              </>
            ) : (
              <>
                <Fact label={pageCopy("x008","Стоимость в год")} value={priceLabel(d.price)} />
                {isV && <Fact label={pageCopy("x009","Порог гранта")} value={d.th != null ? `от ${d.th} б.` : "—"} />}
                <Fact label={pageCopy("x010","Общежитие")} value={d.dorm ? pageCopy("x011","Есть") : pageCopy("x012","Нет")} icon={<BedDouble size={14} />} ok={d.dorm} />
                {isV && <Fact label={pageCopy("x013","Военная кафедра")} value={d.mil ? pageCopy("x014","Есть") : pageCopy("x015","Нет")} icon={<Shield size={14} />} ok={d.mil} />}
              </>
            )}
          </div>

          <p className="leading-relaxed text-stone-600">{detail.about}</p>

          {isA && detail.spec && (
            <Section title={pageCopy("x016","Сильные направления")}>
              <p className="text-sm leading-relaxed text-stone-600">{detail.spec}</p>
            </Section>
          )}
          {isA && detail.docs && (
            <Section title={pageCopy("x017","Документы для поступления")}>
              <ul className="space-y-1.5">
                {detail.docs.split(/\n|•/).map((x) => x.trim()).filter(Boolean).map((x) => (
                  <li key={x} className="flex gap-2 text-sm text-stone-600">
                    <Check size={14} className="mt-0.5 flex-none text-teal-600" />
                    {x}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Академическая мобильность — отдельный блок */}
          {isV && d.mob && (
            <section className="rounded-2xl border border-sky-200 bg-sky-100/50 p-5">
              <h2 className="flex items-center gap-2 font-semibold text-sky-900">
                <Plane size={16} className="text-sky-600" />
                <ContentText id="copy.components.navigator.institution-view.001" fallback="Академическая мобильность" /></h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                <ContentText id="copy.components.navigator.institution-view.002" fallback="Вуз участвует в программах академической мобильности: семестр или год в вузе-партнёре с перезачётом кредитов, двудипломные треки и летние школы. Отбор — по GPA и мотивационному письму." /></p>
            </section>
          )}

          {(detail.addr || detail.phone || detail.email || detail.site || detail.ig) && (
            <Section title={pageCopy("x018","Контакты")}>
              <div className="space-y-2 text-sm text-stone-600">
                {detail.addr && <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 flex-none text-stone-400" />{detail.addr}</p>}
                {detail.phone && <p className="flex items-center gap-2"><Phone size={15} className="text-stone-400" />{detail.phone}</p>}
                {detail.email && <p className="flex items-center gap-2"><Mail size={15} className="text-stone-400" />{detail.email}</p>}
                {detail.site && (
                  <p className="flex items-center gap-2">
                    <Globe size={15} className="text-stone-400" />
                    <span className="font-medium text-violet-600">{detail.site.replace(/^https?:\/\//, "")}</span>
                  </p>
                )}
                {detail.ig && (
                  <p className="flex items-start gap-2">
                    <Camera size={15} aria-label="Instagram" className="mt-0.5 flex-none text-stone-400" />
                    {instagram ? <a href={instagram} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all font-medium text-violet-600 hover:underline">{detail.ig.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, "@").replace(/\/$/, "")}</a> : <span className="min-w-0 break-all">{detail.ig}</span>}
                  </p>
                )}
              </div>
            </Section>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {groups.length === 0 && (
            <p className="rounded-2xl border border-dashed border-stone-200 py-10 text-center text-sm text-stone-400">
              {isA ? pageCopy("x019","Программы зарубежного вуза — на его сайте.") : pageCopy("x020","Список программ уточняется.")}
            </p>
          )}
          {groups.map((g) => (
            <GroupCard key={g.code || g.name} g={g} kind={d.kind} open={open === (g.code || g.name)} onToggle={() => setOpen(open === (g.code || g.name) ? null : g.code || g.name)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Fact({ label, value, icon, ok, wide }: { label: string; value: string; icon?: React.ReactNode; ok?: boolean; wide?: boolean }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white p-4 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="flex items-center gap-1.5 text-xs text-stone-400">{icon}{label}</p>
      <p className={`font-display mt-1 font-medium ${ok === false ? "text-stone-400" : ok ? "text-teal-700" : ""}`}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

// ГОП внутри вуза: строка → раскрытие с вкладками «О группе» / «Программы»
function GroupCard({ g, kind, open, onToggle }: { g: ViewGroup; kind: NavInst["kind"]; open: boolean; onToggle: () => void }) {
  const pageCopy = useCopy("copy.components.navigator.institution-view");
  const [sub, setSub] = useState<"about" | "ops">("about");
  const accent = g.accent ?? (kind === "c" ? "#0E8A6B" : "#5A5FE8");
  const hasAbout = Boolean(g.about || g.fit || g.skills);
  const ops = [...g.ops].sort((a, b) => (a.t ?? 999) - (b.t ?? 999));
  return (
    <div className="rounded-2xl border border-stone-200 bg-white transition hover:border-violet-200">
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left">
        <span className="h-10 w-1.5 flex-none rounded-full" style={{ background: accent }} />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold tracking-wide uppercase" style={{ color: accent }}>
            {g.label ?? (g.code ? `ГОП ${g.code}` : pageCopy("x021","Программы"))}{g.ind ? ` · ${g.ind}` : ""}
          </p>
          <p className="font-display mt-0.5 font-medium">{g.name}</p>
          <p className="mt-0.5 font-mono text-xs text-stone-400">
            {g.ops.length} {plural(g.ops.length, [pageCopy("x022","программа"), pageCopy("x023","программы"), pageCopy("x024","программ")])}
            {g.dur && ` · ${g.dur}`}
          </p>
        </div>
        <ChevronDown size={17} className={`shrink-0 text-stone-300 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-stone-100 px-4 pt-3 pb-4">
          {hasAbout && (
            <div className="mb-3 flex gap-5 border-b border-stone-100">
              {(
                [
                  ["about", pageCopy("x025","О группе")],
                  ["ops", `Программы · ${g.ops.length}`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSub(key)}
                  className={`-mb-px border-b-2 pb-2 text-xs font-medium transition ${sub === key ? "border-violet-600 text-stone-900" : "border-transparent text-stone-400"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {hasAbout && sub === "about" ? (
            <div className="space-y-3.5">
              <div className="grid gap-2.5 text-sm sm:grid-cols-3">
                {g.dur && <Q label={pageCopy("x026","Срок")} value={g.dur} />}
                {g.langs && g.langs.length > 0 && <Q label={pageCopy("x027","Языки")} value={g.langs.map(langAbbr).join(" · ")} />}
                {g.ent && <Q label={pageCopy("x028","Предметы ЕНТ")} value={g.ent} />}
              </div>
              {g.about && <Block title={pageCopy("x029","О чём эта группа")}>{g.about}</Block>}
              {g.fit && (
                <div className="rounded-xl px-4 py-3.5" style={{ background: g.tint ?? "#ECEAFD" }}>
                  <p className="text-xs font-semibold" style={{ color: accent }}><ContentText id="copy.components.navigator.institution-view.003" fallback="Стоит присмотреться, если" /></p>
                  <ul className="mt-2 space-y-1.5">
                    {bullets(g.fit).map((x) => (
                      <li key={x} className="flex gap-2 text-sm text-stone-700">
                        <Check size={14} className="mt-0.5 flex-none" style={{ color: accent }} />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {g.skills && <Block title={pageCopy("x030","Чему конкретно научат")}>{g.skills}</Block>}
              {g.format && <Block title={pageCopy("x031","Формат работы")}>{g.format}</Block>}
              {g.roles && (
                <div>
                  <p className="text-sm font-semibold"><ContentText id="copy.components.navigator.institution-view.004" fallback="Кем можно работать" /></p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {g.roles.split(/\s*;\s*/).filter(Boolean).map((r) => (
                      <span key={r} className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-800">{r}</span>
                    ))}
                  </div>
                </div>
              )}
              {g.notfor && (
                <div className="rounded-xl bg-amber-50 px-4 py-3">
                  <p className="text-xs font-semibold text-amber-800"><ContentText id="copy.components.navigator.institution-view.005" fallback="Кому точно не подойдёт" /></p>
                  <p className="mt-1 text-sm leading-relaxed text-amber-900/80">{g.notfor}</p>
                </div>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {ops.map((o) => (
                <li key={o.code + o.name} className="flex items-start justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{o.contentId?<Link className="hover:text-violet-600 hover:underline" href={`/universities/program/${o.contentId}`}>{o.name}</Link>:o.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-stone-400">
                      {o.code && <span className="font-semibold text-stone-500">{o.code}</span>}
                      {o.code && (o.l || o.dur || (o.e && o.e.length > 0)) ? " · " : ""}
                      {o.dur && `${o.dur}`}
                      {o.dur && o.l ? " · " : ""}
                      {o.l && `${o.l.split(/[,;]/).map((x) => langAbbr(x.trim())).join(" · ")}`}
                      {o.e && o.e.length > 0 && ` · ЕНТ: ${o.e.join(" + ")}`}
                    </p>
                  </div>
                  <div className="flex flex-none flex-col items-end gap-1">
                    {o.p != null && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${o.p === 0 ? "bg-teal-100 text-teal-800" : "bg-stone-100 text-stone-600"}`}>
                        {o.p === 0 ? pageCopy("x032","бесплатно") : `${fmt(o.p)} ₸`}
                      </span>
                    )}
                    {o.t != null && <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-medium text-violet-700"><ContentText id="copy.components.navigator.institution-view.006" fallback="грант от " />{o.t}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Q({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-50 px-3.5 py-2.5">
      <p className="text-[11px] font-medium tracking-wide text-stone-400 uppercase">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-stone-600">{children}</p>
    </div>
  );
}
