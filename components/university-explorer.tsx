"use client";

import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  ChevronDown,
  Clock,
  GraduationCap,
  Globe,
  Languages,
  ListChecks,
  MapPin,
  Phone,
  School,
  Search,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { UniversityArt } from "@/components/brand-art";
import {
  colleges,
  formatPrice,
  gops,
  recommendedIndustries,
  universities,
} from "@/lib/mock-data";

// Заведения навигатора: вузы + колледжи в одном списке
const institutions = [...universities, ...colleges];

const allPrograms = [...new Set(institutions.flatMap((u) => u.programs))].sort();
const allCities = [...new Set(institutions.map((u) => u.city))].sort();

const priceOptions = [
  { value: "1000000", label: "до 1 млн ₸/год" },
  { value: "2000000", label: "до 2 млн ₸/год" },
  { value: "5000000", label: "до 5 млн ₸/год" },
];

const typeOptions = [
  { value: "university", label: "ВУЗы" },
  { value: "college", label: "Колледжи" },
  { value: "foreign", label: "Зарубежные ВУЗы" },
];

function plural(n: number, forms: [string, string, string]) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

// Программы, входящие в отрасль (для пресета из рекомендаций DeBruce)
function industryPrograms(industryName: string): Set<string> {
  const it = recommendedIndustries.find((i) => i.name === industryName);
  if (!it) return new Set();
  return new Set(
    it.directions
      .flatMap((d) => d.profiles)
      .flatMap((p) => p.programs)
      .map((pr) => pr.name)
  );
}

type CardTab = "overview" | "programs" | "location";

const cardTabs: { key: CardTab; label: string }[] = [
  { key: "overview", label: "Обзор" },
  { key: "programs", label: "Программы" },
  { key: "location", label: "Локация" },
];

export type ExplorerTone = "violet" | "teal";

// Палитры: ученик — stone/violet, педагог — slate/teal
const tones = {
  violet: {
    border: "border-stone-200",
    borderHover: "hover:border-violet-200",
    focusRing: "focus-within:border-violet-300",
    muted: "text-stone-400",
    muted2: "text-stone-500",
    body: "text-stone-600",
    divide: "border-stone-100",
    photo: "from-violet-100 via-stone-50 to-stone-100 text-stone-300",
    chip: "border-stone-200 text-stone-600 hover:bg-stone-50",
    chipOn: "border-violet-200 bg-violet-100 text-violet-700",
    tabOn: "border-violet-600 text-stone-900",
    tabOff: "border-transparent text-stone-400 hover:text-stone-600",
    pill: "bg-violet-100 text-violet-700",
    link: "hover:text-violet-700",
    accentText: "text-violet-600",
    cta: "bg-violet-500 hover:bg-violet-600",
    optionOn: "text-violet-700",
    dashed: "border-stone-200 text-stone-400",
    segOn: "bg-white text-stone-900 shadow-sm",
    segOff: "text-stone-500 hover:text-stone-700",
    codePill: "bg-violet-100 text-violet-800",
  },
  teal: {
    border: "border-slate-200",
    borderHover: "hover:border-teal-300",
    focusRing: "focus-within:border-teal-400",
    muted: "text-slate-400",
    muted2: "text-slate-500",
    body: "text-slate-600",
    divide: "border-slate-100",
    photo: "from-teal-100 via-slate-50 to-slate-100 text-slate-300",
    chip: "border-slate-200 text-slate-600 hover:bg-slate-50",
    chipOn: "border-teal-200 bg-teal-50 text-teal-700",
    tabOn: "border-teal-600 text-slate-900",
    tabOff: "border-transparent text-slate-400 hover:text-slate-600",
    pill: "bg-teal-50 text-teal-700",
    link: "hover:text-teal-700",
    accentText: "text-teal-600",
    cta: "bg-teal-600 hover:bg-teal-700",
    optionOn: "text-teal-700",
    dashed: "border-slate-200 text-slate-400",
    segOn: "bg-white text-slate-900 shadow-sm",
    segOff: "text-slate-500 hover:text-slate-700",
    codePill: "bg-teal-100 text-teal-800",
  },
} as const;

// Чип-фильтр в строке поиска (как в Gmail): кнопка с меню-поповером;
// выбранное значение показывается прямо в чипе, крестик сбрасывает.
function FilterChip({
  label,
  value,
  options,
  onChange,
  tone,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  tone: ExplorerTone;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = tones[tone];
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
          current ? t.chipOn : t.chip
        }`}
      >
        {current ? current.label : label}
        {current ? (
          <X
            size={13}
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setOpen(false);
            }}
          />
        ) : (
          <ChevronDown size={13} />
        )}
      </button>

      {open && (
        <div
          className={`absolute top-full left-0 z-30 mt-1.5 max-h-64 w-56 overflow-y-auto rounded-xl border bg-white p-1 shadow-lg ${t.border}`}
        >
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value === value ? "" : o.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs transition hover:bg-slate-50 ${
                o.value === value ? `font-medium ${t.optionOn}` : "text-slate-700"
              }`}
            >
              {o.label}
              {o.value === value && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UniversityExplorer({
  tone = "violet",
  detailBase = "/universities",
  presetProgram = null,
  presetIndustry = null,
  savable = true,
}: {
  tone?: ExplorerTone;
  detailBase?: string;
  presetProgram?: string | null;
  presetIndustry?: string | null;
  savable?: boolean;
}) {
  const t = tones[tone];
  const [mode, setMode] = useState<"institutions" | "programs">("institutions");
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState(presetProgram ?? "");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyDorm, setOnlyDorm] = useState(false);
  const [onlyMilitary, setOnlyMilitary] = useState(false);
  const [onlyGrants, setOnlyGrants] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [gopLevel, setGopLevel] = useState<"university" | "college">("university");
  const [saved, setSaved] = useState<string[]>(["kaznu", "kimep"]);
  const [tabs, setTabs] = useState<Record<string, CardTab>>({});

  const indPrograms = useMemo(
    () => (presetIndustry ? industryPrograms(presetIndustry) : null),
    [presetIndustry]
  );

  const filtered = useMemo(
    () =>
      institutions.filter((u) => {
        if (
          search &&
          !`${u.name} ${u.shortName} ${u.city}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        if (program && !u.programs.includes(program)) return false;
        if (indPrograms && !u.programs.some((p) => indPrograms.has(p)))
          return false;
        if (type === "university" && (u.foreign || u.kind === "college"))
          return false;
        if (type === "college" && u.kind !== "college") return false;
        if (type === "foreign" && !u.foreign) return false;
        if (city && u.city !== city) return false;
        if (maxPrice && u.priceFrom > Number(maxPrice)) return false;
        if (onlyDorm && !u.dorm) return false;
        if (onlyMilitary && !u.military) return false;
        if (onlyGrants && !u.grants) return false;
        if (onlySaved && !saved.includes(u.id)) return false;
        return true;
      }),
    [search, program, indPrograms, type, city, maxPrice, onlyDorm, onlyMilitary, onlyGrants, onlySaved, saved]
  );

  const filteredGops = useMemo(
    () =>
      gops.filter((g) => {
        if (g.level !== gopLevel) return false;
        if (
          search &&
          !`${g.code ?? ""} ${g.name} ${g.programs.join(" ")}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        if (program && !g.programs.includes(program)) return false;
        if (indPrograms && !g.programs.some((p) => indPrograms.has(p)))
          return false;
        if (maxPrice && g.priceFrom > Number(maxPrice)) return false;
        return true;
      }),
    [gopLevel, search, program, indPrograms, maxPrice]
  );

  function toggleSaved(id: string) {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <div className="space-y-5">
      {/* Режим: заведения или образовательные программы (ГОП) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className={`grid grid-cols-2 rounded-xl p-1 text-sm font-medium ${
            tone === "teal" ? "bg-slate-100" : "bg-stone-100"
          }`}
        >
          {(
            [
              ["institutions", "Заведения"],
              ["programs", "Программы"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`rounded-lg px-4 py-1.5 transition ${
                mode === key ? t.segOn : t.segOff
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {savable && mode === "institutions" && (
          <button
            onClick={() => setOnlySaved(!onlySaved)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              onlySaved ? "border-amber-200 bg-amber-50 text-amber-800" : t.chip
            }`}
          >
            <Star
              size={13}
              className={onlySaved ? "text-amber-500" : ""}
              fill={onlySaved ? "currentColor" : "none"}
            />
            Избранное ({saved.length})
          </button>
        )}

        {mode === "programs" && (
          <div className="flex gap-2">
            {(
              [
                ["university", "ВУЗы"],
                ["college", "Колледжи"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setGopLevel(key)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  gopLevel === key ? t.chipOn : t.chip
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Поиск с фильтрами внутри — как в Gmail: строка + чипы под ней */}
      <div
        className={`rounded-2xl border bg-white transition ${t.border} ${t.focusRing}`}
      >
        <div className="flex items-center gap-3 px-4">
          <Search size={16} className={`shrink-0 ${t.muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              mode === "institutions"
                ? "Поиск по названию или городу…"
                : "Поиск по коду или названию программы…"
            }
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Очистить поиск"
              className={`shrink-0 transition ${t.muted} hover:text-slate-600`}
            >
              <X size={15} />
            </button>
          )}
        </div>
        <div
          className={`flex flex-wrap items-center gap-2 border-t px-3 py-2.5 ${t.divide}`}
        >
          {mode === "institutions" && (
            <FilterChip
              label="Тип заведения"
              value={type}
              options={typeOptions}
              onChange={setType}
              tone={tone}
            />
          )}
          <FilterChip
            label="Программа"
            value={program}
            options={allPrograms.map((p) => ({ value: p, label: p }))}
            onChange={setProgram}
            tone={tone}
          />
          {mode === "institutions" && (
            <FilterChip
              label="Город"
              value={city}
              options={allCities.map((c) => ({ value: c, label: c }))}
              onChange={setCity}
              tone={tone}
            />
          )}
          <FilterChip
            label="Стоимость"
            value={maxPrice}
            options={priceOptions}
            onChange={setMaxPrice}
            tone={tone}
          />
          {mode === "institutions" &&
            (
              [
                ["Гранты и квоты", onlyGrants, setOnlyGrants],
                ["Общежитие", onlyDorm, setOnlyDorm],
                ["Военная кафедра", onlyMilitary, setOnlyMilitary],
              ] as const
            ).map(([label, value, set]) => (
              <button
                key={label}
                onClick={() => set(!value)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  value ? t.chipOn : t.chip
                }`}
              >
                {value && <Check size={13} />}
                {label}
              </button>
            ))}
        </div>
      </div>

      {mode === "institutions" ? (
        <>
          <p className={`font-mono text-sm ${t.muted}`}>
            {onlySaved ? "Избранное: " : "Найдено: "}
            {filtered.length}{" "}
            {plural(filtered.length, ["заведение", "заведения", "заведений"])}
          </p>

          {/* Карточки на всю ширину: фото слева, вкладки внутри */}
          <div className="space-y-4">
            {filtered.map((u) => {
              const tab = tabs[u.id] ?? "overview";
              const isSaved = saved.includes(u.id);
              const isCollege = u.kind === "college";
              return (
                <div
                  key={u.id}
                  className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition sm:flex-row ${t.border} ${t.borderHover}`}
                >
                  {/* Фото (мок-плейсхолдер) */}
                  <div
                    className={`flex h-36 items-center justify-center bg-gradient-to-br sm:h-auto sm:w-52 sm:shrink-0 ${t.photo}`}
                  >
                    {isCollege ? (
                      <School size={52} strokeWidth={1.25} />
                    ) : (
                      <Building2 size={52} strokeWidth={1.25} />
                    )}
                  </div>

                  {/* Контент */}
                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`${detailBase}/${u.id}`}
                          className={`font-display font-medium leading-snug ${t.link}`}
                        >
                          {u.name}
                        </Link>
                        <p
                          className={`mt-1 flex items-center gap-1 text-xs ${t.muted}`}
                        >
                          <MapPin size={12} />
                          {u.city}, {u.country}
                          {isCollege && (
                            <span className="ml-1 rounded bg-teal-50 px-1.5 py-0.5 text-[10px] text-teal-700">
                              колледж
                            </span>
                          )}
                          {u.foreign && (
                            <span className="ml-1 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] text-sky-700">
                              зарубежный
                            </span>
                          )}
                        </p>
                      </div>
                      {savable && (
                        <button
                          onClick={() => toggleSaved(u.id)}
                          aria-label="Сохранить в избранное"
                          className={`shrink-0 transition ${
                            isSaved
                              ? "text-amber-400"
                              : `${t.muted} hover:text-amber-300`
                          }`}
                        >
                          <Star size={19} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                      )}
                    </div>

                    {/* Вкладки карточки */}
                    <div className={`mt-3 flex gap-5 border-b ${t.divide}`}>
                      {cardTabs.map((ct) => (
                        <button
                          key={ct.key}
                          onClick={() => setTabs({ ...tabs, [u.id]: ct.key })}
                          className={`-mb-px border-b-2 pb-2 text-xs font-medium transition ${
                            tab === ct.key ? t.tabOn : t.tabOff
                          }`}
                        >
                          {ct.label}
                        </button>
                      ))}
                    </div>

                    {/* Контент вкладки */}
                    <div className="mt-3 min-h-[72px] flex-1">
                      {tab === "overview" && (
                        <div>
                          <p
                            className={`line-clamp-2 text-sm leading-relaxed ${t.body}`}
                          >
                            {u.description}
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {u.grants && <Tag tone={tone}>Гранты</Tag>}
                            {u.dorm && <Tag tone={tone}>Общежитие</Tag>}
                            {u.military && <Tag tone={tone}>Военная кафедра</Tag>}
                            {u.mobility && (
                              <Tag tone={tone}>Академ. мобильность</Tag>
                            )}
                          </div>
                        </div>
                      )}
                      {tab === "programs" && (
                        <div className="flex flex-wrap gap-1.5">
                          {u.programs.map((p) => (
                            <span
                              key={p}
                              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${t.pill}`}
                            >
                              <GraduationCap size={12} />
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                      {tab === "location" && (
                        <div className={`space-y-1.5 text-sm ${t.body}`}>
                          <p className="flex items-center gap-2">
                            <MapPin size={14} className={t.muted} />
                            {u.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone size={14} className={t.muted} />
                            {u.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Globe size={14} className={t.muted} />
                            <span className={t.accentText}>{u.website}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Факты + переход */}
                    <div
                      className={`mt-3 flex items-center justify-between border-t pt-3 ${t.divide}`}
                    >
                      <div className="flex items-baseline gap-4 text-sm">
                        <span className="font-display font-medium">
                          {formatPrice(u.priceFrom)}
                        </span>
                        <span className={`font-mono text-xs ${t.muted}`}>
                          {u.minScore > 0
                            ? `балл от ${u.minScore}`
                            : "конкурс аттестатов"}
                        </span>
                      </div>
                      <Link
                        href={`${detailBase}/${u.id}`}
                        className={`group flex items-center gap-1.5 rounded-full py-2 pr-4 pl-5 text-xs font-medium text-white transition ${t.cta}`}
                      >
                        Подробнее
                        <ArrowRight
                          size={13}
                          className="transition group-hover:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div
              className={`rounded-2xl border border-dashed py-12 text-center ${t.dashed}`}
            >
              <UniversityArt className="mx-auto h-40 w-52" tone={tone} />
              <p className="mt-3">
                {onlySaved
                  ? "В избранном пока пусто — отмечайте заведения звёздочкой."
                  : "По выбранным фильтрам ничего не найдено. Попробуйте смягчить условия."}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <p className={`font-mono text-sm ${t.muted}`}>
            Найдено: {filteredGops.length}{" "}
            {plural(filteredGops.length, ["программа", "программы", "программ"])}
          </p>

          {/* Карточки ГОП (программы без ГОП — в том же списке и том же виде) */}
          <div className="space-y-4">
            {filteredGops.map((g) => (
              <div
                key={g.id}
                className={`rounded-2xl border bg-white p-5 transition ${t.border} ${t.borderHover}`}
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold ${t.codePill}`}
                  >
                    {g.code ?? "без ГОП"}
                  </span>
                  <h3 className="font-display font-medium">{g.name}</h3>
                </div>

                <p className={`mt-2.5 max-w-3xl text-sm leading-relaxed ${t.body}`}>
                  {g.description}
                </p>

                {/* Факты */}
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div className={`rounded-xl px-3.5 py-3 ${tone === "teal" ? "bg-slate-50" : "bg-stone-50"}`}>
                    <p className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide ${t.muted}`}>
                      <ListChecks size={12} />
                      ЕНТ
                    </p>
                    <p className="mt-1 font-medium">
                      {g.entScore
                        ? `балл от ${g.entScore}`
                        : g.level === "college"
                          ? "конкурс аттестатов"
                          : "внутренний конкурс"}
                    </p>
                    {g.entSubjects && (
                      <p className={`mt-0.5 text-xs ${t.muted2}`}>
                        {g.entSubjects.join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className={`rounded-xl px-3.5 py-3 ${tone === "teal" ? "bg-slate-50" : "bg-stone-50"}`}>
                    <p className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide ${t.muted}`}>
                      <Banknote size={12} />
                      Стоимость
                    </p>
                    <p className="mt-1 font-medium">
                      {formatPrice(g.priceFrom)}
                      {g.priceTo ? ` – ${formatPrice(g.priceTo)}` : ""}
                    </p>
                  </div>
                  <div className={`rounded-xl px-3.5 py-3 ${tone === "teal" ? "bg-slate-50" : "bg-stone-50"}`}>
                    <p className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide ${t.muted}`}>
                      <Languages size={12} />
                      Языки обучения
                    </p>
                    <p className="mt-1 font-medium">{g.languages.join(", ")}</p>
                  </div>
                  <div className={`rounded-xl px-3.5 py-3 ${tone === "teal" ? "bg-slate-50" : "bg-stone-50"}`}>
                    <p className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide ${t.muted}`}>
                      <Clock size={12} />
                      Срок обучения
                    </p>
                    <p className="mt-1 font-medium">{g.duration}</p>
                  </div>
                </div>

                {/* Профессии и входящие ОП */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`mr-1 text-xs font-medium ${t.muted2}`}>
                      Примеры профессий:
                    </span>
                    {g.professions.map((p) => (
                      <Tag key={p} tone={tone}>
                        {p}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`mr-1 text-xs font-medium ${t.muted2}`}>
                      Образовательные программы:
                    </span>
                    {g.programs.map((p) => (
                      <span
                        key={p}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${t.pill}`}
                      >
                        <GraduationCap size={12} />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Заведения, где ведётся обучение */}
                <div className={`mt-4 border-t pt-3 ${t.divide}`}>
                  <span className={`mr-2 text-xs font-medium ${t.muted2}`}>
                    Где обучают:
                  </span>
                  <span className="inline-flex flex-wrap gap-1.5 align-middle">
                    {g.institutionIds.map((id) => {
                      const inst = institutions.find((u) => u.id === id);
                      if (!inst) return null;
                      const isUni = inst.kind !== "college";
                      return isUni ? (
                        <Link
                          key={id}
                          href={`${detailBase}/${id}`}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${t.chip}`}
                        >
                          {inst.shortName}
                        </Link>
                      ) : (
                        <span
                          key={id}
                          className={`rounded-full border px-3 py-1 text-xs ${
                            tone === "teal"
                              ? "border-slate-200 text-slate-500"
                              : "border-stone-200 text-stone-500"
                          }`}
                        >
                          {inst.shortName}
                        </span>
                      );
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredGops.length === 0 && (
            <div
              className={`rounded-2xl border border-dashed py-12 text-center ${t.dashed}`}
            >
              <UniversityArt className="mx-auto h-40 w-52" tone={tone} />
              <p className="mt-3">
                По выбранным фильтрам программ не найдено. Попробуйте смягчить
                условия.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Tag({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: ExplorerTone;
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] ${
        tone === "teal"
          ? "bg-slate-100 text-slate-500"
          : "bg-stone-100 text-stone-500"
      }`}
    >
      {children}
    </span>
  );
}
