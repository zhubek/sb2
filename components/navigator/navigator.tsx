"use client";

import {
  BedDouble,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  Shield,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import institutionsJson from "@/lib/nav/institutions.json";
import gopsJson from "@/lib/nav/gops-compact.json";
import nogopJson from "@/lib/nav/nogop-compact.json";
import collegeJson from "@/lib/nav/college-programs.json";
import {
  type CollegeProgram,
  type GopCompact,
  type Kind,
  KIND,
  type NavInst,
  type NoGopCompact,
  PMAX,
  fmt,
  industries,
  initials,
  obls,
  plural,
  priceLabel,
  priceShort,
  regionCities,
} from "@/lib/nav/types";

const INSTS = institutionsJson as unknown as NavInst[];
const GOPS = gopsJson as unknown as GopCompact[];
const NOGOP = nogopJson as unknown as Record<string, NoGopCompact[]>;
const CPROG = (collegeJson as unknown as { programs: CollegeProgram[] }).programs;
const BY_IDX = new Map(INSTS.map((d) => [d.i, d]));
const PAGE = 40;

interface Filters {
  q: string;
  kind: Kind;
  obls: string[];
  locs: string[];
  branches: number[];
  price: number;
  score: number;
  dorm: boolean;
  mil: boolean;
}

function instPasses(d: NavInst, f: Filters, ignoreKind = false) {
  if (!ignoreKind && d.kind !== f.kind) return false;
  if (f.obls.length && !f.obls.includes(d.obl)) return false;
  if (f.locs.length && !f.locs.includes(d.city)) return false;
  if (f.branches.length && !d.inds.some((i) => f.branches.includes(i))) return false;
  if (f.price < PMAX && d.price != null && d.price > f.price) return false;
  if (f.score > 0 && d.kind === "v" && d.th != null && d.th > f.score) return false;
  if (f.dorm && !d.dorm) return false;
  if (f.mil && !(d.kind === "v" && d.mil)) return false;
  return true;
}

function Chip({
  on,
  onClick,
  children,
  tone = "violet",
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "violet" | "teal" | "purple";
}) {
  const onCls = {
    violet: "border-violet-500 bg-violet-500 text-white",
    teal: "border-teal-500 bg-teal-500 text-white",
    purple: "border-fuchsia-600 bg-fuchsia-600 text-white",
  }[tone];
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
        on ? onCls : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function Navigator({ presetIndustry = null }: { presetIndustry?: string | null }) {
  const presetIdx = industries.findIndex((x) => x.name === presetIndustry);
  const [view, setView] = useState<"inst" | "op">("inst");
  const [f, setF] = useState<Filters>({
    q: "",
    kind: "v",
    obls: [],
    locs: [],
    branches: presetIdx >= 0 ? [presetIdx] : [],
    price: PMAX,
    score: 0,
    dorm: false,
    mil: false,
  });
  const [fav, setFav] = useState<Set<string>>(new Set());
  const [limit, setLimit] = useState(PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const [openCp, setOpenCp] = useState<string | null>(null);

  function set<K extends keyof Filters>(k: K, v: Filters[K]) {
    setF((s) => ({ ...s, [k]: v }));
    setLimit(PAGE);
  }
  function toggleIn<T>(arr: T[], v: T) {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }
  const q = f.q.trim().toLowerCase();

  // ── Заведения ───────────────────────────────────────────────────────────
  const instAll = useMemo(
    () =>
      INSTS.filter((d) => {
        if (!instPasses(d, f, true)) return false;
        if (q && !`${d.name} ${d.city} ${d.country ?? ""}`.toLowerCase().includes(q)) return false;
        return true;
      }),
    [f, q]
  );
  const insts = useMemo(
    () => instAll.filter((d) => d.kind === f.kind).sort((a, b) => b.nOps - a.nOps),
    [instAll, f.kind]
  );
  const kindCounts = useMemo(
    () => ({
      v: instAll.filter((d) => d.kind === "v").length,
      c: instAll.filter((d) => d.kind === "c").length,
      a: instAll.filter((d) => d.kind === "a").length,
    }),
    [instAll]
  );

  // ── Программы вузов: ГОП + программы вне ГОП ─────────────────────────────
  const gopUnis = (g: GopCompact) =>
    Object.entries(g.univ).filter(([ui, u]) => {
      const d = BY_IDX.get(Number(ui));
      if (!d || !instPasses(d, { ...f, kind: "v" })) return false;
      if (f.price < PMAX && u.p != null && u.p > f.price) return false;
      if (f.score > 0 && u.g != null && u.g > f.score) return false;
      return true;
    });
  const gops = useMemo(
    () =>
      GOPS.filter((g) => {
        if (f.branches.length && !f.branches.includes(g.ind)) return false;
        if (q && !`${g.code} ${g.name}`.toLowerCase().includes(q)) return false;
        return gopUnis(g).length > 0;
      }).sort((a, b) => a.name.localeCompare(b.name, "ru")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [f, q]
  );
  const nogops = useMemo(() => {
    const out: { d: NavInst; op: NoGopCompact }[] = [];
    Object.entries(NOGOP).forEach(([ui, arr]) => {
      const d = BY_IDX.get(Number(ui));
      if (!d || !instPasses(d, { ...f, kind: "v" })) return;
      arr.forEach((op) => {
        if (f.branches.length && !f.branches.includes(op.ind)) return;
        if (q && !`${op.name} ${d.name}`.toLowerCase().includes(q)) return;
        if (f.price < PMAX && op.p != null && op.p > f.price) return;
        if (f.score > 0 && op.t != null && op.t > f.score) return;
        out.push({ d, op });
      });
    });
    return out;
  }, [f, q]);

  // ── Программы колледжей ──────────────────────────────────────────────────
  const cprogs = useMemo(
    () =>
      CPROG.map((p) => ({
        p,
        cols: p.cols.filter((ci) => {
          const d = BY_IDX.get(ci);
          return d && instPasses(d, { ...f, kind: "c" });
        }),
      }))
        .filter(({ p, cols }) => {
          if (f.branches.length && !f.branches.includes(p.ind)) return false;
          if (q && !`${p.code} ${p.name} ${p.g}`.toLowerCase().includes(q)) return false;
          return cols.length > 0;
        })
        .sort((a, b) => b.cols.length - a.cols.length),
    [f, q]
  );

  const kind = view === "op" && f.kind === "a" ? "v" : f.kind;
  const count =
    view === "inst"
      ? `${insts.length} ${plural(insts.length, ["заведение", "заведения", "заведений"])}`
      : kind === "v"
        ? `${gops.length + nogops.length} ${plural(gops.length + nogops.length, ["карточка", "карточки", "карточек"])} · ${gops.reduce((a, g) => a + gopUnis(g).length, 0) + nogops.length} программ`
        : `${cprogs.length} ${plural(cprogs.length, ["программа", "программы", "программ"])}`;

  const activeFilters =
    f.obls.length + f.locs.length + f.branches.length + (f.dorm ? 1 : 0) + (f.mil ? 1 : 0) + (f.price < PMAX ? 1 : 0) + (f.score > 0 ? 1 : 0);
  const locOptions = useMemo(() => {
    const s = new Set<string>();
    f.obls.forEach((o) => (regionCities[o] ?? []).forEach((c) => s.add(c)));
    return [...s].sort((a, b) => a.localeCompare(b, "ru"));
  }, [f.obls]);

  function reset() {
    setF({ q: "", kind: "v", obls: [], locs: [], branches: [], price: PMAX, score: 0, dorm: false, mil: false });
    setLimit(PAGE);
  }
  function toggleFav(key: string) {
    setFav((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  }

  // Список: заведения / ГОП+вне ГОП / колледжные программы
  const gopItems = useMemo(
    () =>
      [
        ...gops.map((g) => ({ t: g.name, key: "g" + g.code, node: <GopCard key={"g" + g.code} g={g} n={gopUnis(g).length} /> })),
        ...nogops.map(({ d, op }) => ({ t: op.name, key: `n${d.i}-${op.k}`, node: <NoGopCard key={`n${d.i}-${op.k}`} d={d} op={op} /> })),
      ].sort((a, b) => a.t.localeCompare(b.t, "ru")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gops, nogops]
  );
  const total = view === "inst" ? insts.length : kind === "v" ? gopItems.length : cprogs.length;

  return (
    <div className="space-y-5">
      {/* Режим + избранное */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-medium">
          {(
            [
              ["inst", "Заведения"],
              ["op", "Программы"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => {
                setView(k);
                if (k === "op" && f.kind === "a") set("kind", "v");
                setLimit(PAGE);
              }}
              className={`rounded-lg px-5 py-1.5 transition ${
                view === k ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600">
          <Star size={13} className={fav.size ? "text-amber-400" : ""} fill={fav.size ? "currentColor" : "none"} />
          Избранное · {fav.size}
        </span>
      </div>

      {/* Поиск */}
      <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 transition focus-within:border-violet-300">
        <Search size={16} className="shrink-0 text-stone-400" />
        <input
          value={f.q}
          onChange={(e) => set("q", e.target.value)}
          placeholder={view === "inst" ? "Название, город или профессия" : "Группа, специальность или код"}
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
        {f.q && (
          <button onClick={() => set("q", "")} aria-label="Очистить" className="text-stone-400 hover:text-stone-600">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Тип заведения — чипы со счётчиками */}
      <div className="flex flex-wrap items-center gap-2">
        <Chip on={kind === "v"} onClick={() => set("kind", "v")}>
          Вузы <span className="ml-1 font-mono opacity-70">{kindCounts.v}</span>
        </Chip>
        <Chip on={kind === "c"} onClick={() => set("kind", "c")} tone="teal">
          Колледжи <span className="ml-1 font-mono opacity-70">{kindCounts.c}</span>
        </Chip>
        {view === "inst" && (
          <Chip on={kind === "a"} onClick={() => set("kind", "a")} tone="purple">
            Зарубеж <span className="ml-1 font-mono opacity-70">{kindCounts.a}</span>
          </Chip>
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50 lg:hidden"
        >
          <SlidersHorizontal size={13} />
          Фильтры
          {activeFilters > 0 && (
            <span className="rounded-full bg-violet-500 px-1.5 text-[10px] text-white">{activeFilters}</span>
          )}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[272px_1fr]">
        {/* Панель фильтров */}
        <aside className={`${showFilters ? "block" : "hidden"} space-y-5 self-start rounded-2xl border border-stone-200 bg-white p-5 lg:sticky lg:top-20 lg:block`}>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Фильтры</p>
            {activeFilters > 0 && (
              <button onClick={reset} className="text-xs font-medium text-violet-600 hover:text-violet-700">
                Сбросить
              </button>
            )}
          </div>

          <FilterGroup label="Область" count={f.obls.length}>
            <CheckList
              options={obls.map((o) => ({ value: o, label: o.replace("область", "обл.") }))}
              selected={f.obls}
              onToggle={(o) => {
                const next = toggleIn(f.obls, o);
                const allowed = new Set(next.flatMap((x) => regionCities[x] ?? []));
                setF((s) => ({ ...s, obls: next, locs: next.length ? s.locs.filter((l) => allowed.has(l)) : [] }));
                setLimit(PAGE);
              }}
            />
          </FilterGroup>

          {locOptions.length > 0 && (
            <FilterGroup label="Город / район" count={f.locs.length}>
              <CheckList
                options={locOptions.map((c) => ({ value: c, label: c }))}
                selected={f.locs}
                onToggle={(c) => set("locs", toggleIn(f.locs, c))}
              />
            </FilterGroup>
          )}

          <FilterGroup label="Отрасль" count={f.branches.length}>
            <CheckList
              options={industries.map((ind, i) => ({ value: i, label: ind.short, color: ind.c }))}
              selected={f.branches}
              onToggle={(i) => set("branches", toggleIn(f.branches, i))}
            />
          </FilterGroup>

          <FilterGroup label="Стоимость в год">
            <input
              type="range"
              min={0}
              max={PMAX}
              step={50000}
              value={f.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <p className="mt-1 font-mono text-xs text-stone-500">
              {f.price >= PMAX ? "любая" : `до ${fmt(f.price)} ₸`}
            </p>
          </FilterGroup>

          {kind === "v" && (
            <FilterGroup label="Порог гранта (балл ЕНТ)">
              <input
                type="range"
                min={0}
                max={140}
                step={5}
                value={f.score}
                onChange={(e) => set("score", Number(e.target.value))}
                className="w-full accent-violet-500"
              />
              <p className="mt-1 font-mono text-xs text-stone-500">
                {f.score > 0 ? `мой балл: ${f.score}` : "не учитывать"}
              </p>
            </FilterGroup>
          )}

          {kind !== "a" && (
            <FilterGroup label="Дополнительно">
              <div className="flex flex-wrap gap-1.5">
                <Chip on={f.dorm} onClick={() => set("dorm", !f.dorm)}>Есть общежитие</Chip>
                {kind === "v" && (
                  <Chip on={f.mil} onClick={() => set("mil", !f.mil)}>Есть военная кафедра</Chip>
                )}
              </div>
            </FilterGroup>
          )}
        </aside>

        {/* Список */}
        <div className="min-w-0 space-y-3">
          <p className="font-mono text-sm text-stone-400">{count}</p>

          {total === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-200 py-12 text-center text-stone-400">
              Ничего не нашлось. Попробуйте убрать один из фильтров.
            </div>
          )}

          {view === "inst" &&
            insts.slice(0, limit).map((d) => (
              <InstCard key={d.i} d={d} fav={fav.has("i" + d.i)} onFav={() => toggleFav("i" + d.i)} />
            ))}

          {view === "op" && kind === "v" && gopItems.slice(0, limit).map((x) => x.node)}

          {view === "op" &&
            kind === "c" &&
            cprogs.slice(0, limit).map(({ p, cols }) => (
              <CollegeProgramCard
                key={p.code + p.name}
                p={p}
                cols={cols}
                open={openCp === p.code + p.name}
                onToggle={() => setOpenCp(openCp === p.code + p.name ? null : p.code + p.name)}
              />
            ))}

          {limit < total && (
            <button
              onClick={() => setLimit(limit + PAGE)}
              className="w-full rounded-2xl border border-stone-200 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              Показать ещё ({total - limit})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, count, children }: { label: string; count?: number; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
        {label}
        {count ? <span className="rounded-full bg-violet-500 px-1.5 py-px font-mono text-[10px] text-white">{count}</span> : null}
      </p>
      {children}
    </div>
  );
}

// Компактный список с чекбоксами: выбранные — сверху, остальное — по «Показать все»
function CheckList<T extends string | number>({
  options,
  selected,
  onToggle,
  visible = 6,
}: {
  options: { value: T; label: string; color?: string }[];
  selected: T[];
  onToggle: (v: T) => void;
  visible?: number;
}) {
  const [all, setAll] = useState(false);
  const sel = options.filter((o) => selected.includes(o.value));
  const rest = options.filter((o) => !selected.includes(o.value));
  const shown = all ? [...sel, ...rest] : [...sel, ...rest.slice(0, Math.max(0, visible - sel.length))];
  const hidden = options.length - shown.length;
  return (
    <div className="-mx-1">
      {shown.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={String(o.value)}
            onClick={() => onToggle(o.value)}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] transition ${
              on ? "font-medium text-stone-900" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <span
              className={`flex h-4 w-4 flex-none items-center justify-center rounded border transition ${
                on ? "border-violet-500 bg-violet-500 text-white" : "border-stone-300 bg-white"
              }`}
            >
              {on && <Check size={11} strokeWidth={3} />}
            </span>
            {o.color && <span className="h-2 w-2 flex-none rounded-full" style={{ background: o.color }} />}
            <span className="truncate">{o.label}</span>
          </button>
        );
      })}
      {(hidden > 0 || all) && (
        <button onClick={() => setAll(!all)} className="mt-1 px-2 text-xs font-medium text-violet-600 hover:text-violet-700">
          {all ? "Свернуть" : `Показать все (${hidden})`}
        </button>
      )}
    </div>
  );
}

// ── Карточки ───────────────────────────────────────────────────────────────

function InstCard({ d, fav, onFav }: { d: NavInst; fav: boolean; onFav: () => void }) {
  const k = KIND[d.kind];
  const isA = d.kind === "a";
  return (
    <div className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-violet-300">
      <Link
        href={`/universities/${d.i}`}
        className="flex h-14 w-14 flex-none items-center justify-center rounded-xl font-mono text-sm font-bold text-white"
        style={{ background: k.color }}
      >
        {initials(d.name)}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: k.color }}>
              {k.label}
            </p>
            <Link href={`/universities/${d.i}`} className="font-display block leading-snug font-medium hover:text-violet-700">
              {d.name}
            </Link>
            <p className="mt-0.5 text-xs text-stone-400">
              {isA ? `${d.country}, ${d.city}` : `${d.city} · ${d.nOps} прогр.`}
            </p>
          </div>
          <button onClick={onFav} aria-label="В избранное" className={`shrink-0 ${fav ? "text-amber-400" : "text-stone-300 hover:text-amber-300"}`}>
            <Star size={18} fill={fav ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {!isA && (
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${d.price === 0 ? "bg-teal-100 text-teal-800" : "bg-stone-100 text-stone-600"}`}>
              {priceLabel(d.price)}
            </span>
          )}
          {d.kind === "v" && d.th != null && (
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-medium text-violet-700">грант от {d.th}</span>
          )}
          {isA && <span className="rounded-full bg-fuchsia-100 px-2.5 py-0.5 text-[11px] font-medium text-fuchsia-800">подробности на странице</span>}
          <span className="ml-auto flex items-center gap-1.5 text-stone-400">
            {d.dorm && <BedDouble size={14} className="text-teal-600" aria-label="Есть общежитие" />}
            {d.kind === "v" && d.mil && <Shield size={14} className="text-violet-600" aria-label="Есть военная кафедра" />}
          </span>
        </div>
      </div>
    </div>
  );
}

function GopCard({ g, n }: { g: GopCompact; n: number }) {
  const cities = Object.keys(g.univ)
    .map((ui) => BY_IDX.get(Number(ui))?.city)
    .filter(Boolean) as string[];
  const cnt: Record<string, number> = {};
  cities.forEach((c) => (cnt[c] = (cnt[c] ?? 0) + 1));
  const top = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]);
  const cityLine = top.length ? `${top[0]}${top.length > 1 ? ` +${top.length - 1}` : ""}` : "";
  return (
    <Link href={`/universities/gop/${g.code}`} className="block rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-violet-300">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold tracking-wide text-violet-600 uppercase">ГОП {g.code}</p>
          <p className="font-display mt-0.5 font-medium">{g.name}</p>
          <p className="mt-1.5 font-mono text-xs text-stone-400">
            <b className="text-stone-700">{n}</b> {plural(n, ["вуз", "вуза", "вузов"])}
            {cityLine && ` · ${cityLine}`}
            {g.dur && ` · ${g.dur}`}
          </p>
        </div>
        <ChevronRight size={17} className="shrink-0 text-stone-300" />
      </div>
    </Link>
  );
}

function NoGopCard({ d, op }: { d: NavInst; op: NoGopCompact }) {
  return (
    <Link href={`/universities/${d.i}?tab=programs`} className="block rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-violet-300">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold tracking-wide text-teal-700 uppercase">Собственная программа · {d.name}</p>
          <p className="font-display mt-0.5 font-medium">{op.name}</p>
          <p className="mt-1.5 font-mono text-xs text-stone-400">
            {d.city} · {priceLabel(op.p)}
            {op.t != null && ` · порог ${op.t}`}
            {op.dur && ` · ${op.dur} ${plural(op.dur, ["год", "года", "лет"])}`}
          </p>
        </div>
        <ChevronRight size={17} className="shrink-0 text-stone-300" />
      </div>
    </Link>
  );
}

function CollegeProgramCard({ p, cols, open, onToggle }: { p: CollegeProgram; cols: number[]; open: boolean; onToggle: () => void }) {
  const prices = cols.map((ci) => BY_IDX.get(ci)?.price).filter((x): x is number => x != null);
  const hasFree = prices.some((x) => x === 0);
  const paid = prices.filter((x) => x > 0);
  const pM = !prices.length ? "Не указана" : hasFree ? "Бесплатно" : priceShort(Math.min(...prices));
  const pS = !prices.length ? "цена" : hasFree && paid.length ? `или ${priceShort(Math.min(...paid))}` : hasFree ? "по гранту" : "в год";
  return (
    <div className="rounded-2xl border border-stone-200 bg-white transition hover:border-teal-300">
      <button onClick={onToggle} className="flex w-full items-start gap-3 p-4 text-left">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold tracking-wide text-teal-700 uppercase">{p.code}</p>
          <p className="font-display mt-0.5 font-medium">{p.name}</p>
          <p className="mt-0.5 text-xs text-stone-500">{p.g}</p>
          <p className="mt-1.5 font-mono text-xs text-stone-400">
            {cols.length} {plural(cols.length, ["колледж", "колледжа", "колледжей"])} · {industries[p.ind]?.short}
          </p>
        </div>
        <div className="flex flex-none gap-4 text-right">
          <div>
            <p className="text-sm font-semibold">{pM}</p>
            <p className="text-[10px] text-stone-400">{pS}</p>
          </div>
          <ChevronDown size={17} className={`mt-1 text-stone-300 transition ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-stone-100 px-4 pt-3 pb-4">
          <p className="mb-2 text-xs font-medium text-stone-500">Где обучают:</p>
          <div className="flex flex-wrap gap-1.5">
            {cols.map((ci) => {
              const d = BY_IDX.get(ci)!;
              return (
                <Link key={ci} href={`/universities/${ci}`} className="rounded-full border border-stone-200 px-3 py-1 text-xs transition hover:border-teal-400 hover:text-teal-700">
                  {d.name} · {d.city}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
