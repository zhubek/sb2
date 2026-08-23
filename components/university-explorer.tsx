"use client";

import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  ChevronDown,
  Clock,
  GraduationCap,
  Languages,
  ListChecks,
  MapPin,
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

// Двухуровневая география: область → город/район
const cityRegion: Record<string, string> = {
  Алматы: "г. Алматы",
  Астана: "г. Астана",
  Шымкент: "г. Шымкент",
  Каскелен: "Алматинская область",
  Москва: "За рубежом",
  Гонконг: "За рубежом",
};
const allRegions = [...new Set(institutions.map((u) => cityRegion[u.city] ?? "Другое"))].sort();

const priceOptions = [
  { value: "1000000", label: "до 1 млн ₸/год" },
  { value: "2000000", label: "до 2 млн ₸/год" },
  { value: "5000000", label: "до 5 млн ₸/год" },
];

// Типы заведений — видимые чипы (как в прототипе)
const typeChips = [
  { value: "university", label: "Вузы" },
  { value: "college", label: "Колледжи" },
  { value: "foreign", label: "Зарубежные" },
] as const;

const industryOptions = recommendedIndustries.map((i) => ({
  value: i.name,
  label: i.name,
}));

function plural(n: number, forms: [string, string, string]) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

// Программы, входящие в отрасль (для фильтра «Отрасль» и пресета из рекомендаций)
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
    logo: "border-stone-200 bg-stone-50 text-stone-400",
    chip: "border-stone-200 text-stone-600 hover:bg-stone-50",
    chipOn: "border-violet-200 bg-violet-100 text-violet-700",
    pill: "bg-violet-100 text-violet-700",
    link: "hover:text-violet-700",
    accentText: "text-violet-600",
    cta: "bg-violet-500 hover:bg-violet-600",
    optionOn: "text-violet-700",
    dashed: "border-stone-200 text-stone-400",
    segOn: "bg-white text-stone-900 shadow-sm",
    segOff: "text-stone-500 hover:text-stone-700",
    codePill: "bg-violet-100 text-violet-800",
    soft: "bg-stone-50",
  },
  teal: {
    border: "border-slate-200",
    borderHover: "hover:border-teal-300",
    focusRing: "focus-within:border-teal-400",
    muted: "text-slate-400",
    muted2: "text-slate-500",
    body: "text-slate-600",
    divide: "border-slate-100",
    logo: "border-slate-200 bg-slate-50 text-slate-400",
    chip: "border-slate-200 text-slate-600 hover:bg-slate-50",
    chipOn: "border-teal-200 bg-teal-50 text-teal-700",
    pill: "bg-teal-50 text-teal-700",
    link: "hover:text-teal-700",
    accentText: "text-teal-600",
    cta: "bg-teal-600 hover:bg-teal-700",
    optionOn: "text-teal-700",
    dashed: "border-slate-200 text-slate-400",
    segOn: "bg-white text-slate-900 shadow-sm",
    segOff: "text-slate-500 hover:text-slate-700",
    codePill: "bg-teal-100 text-teal-800",
    soft: "bg-slate-50",
  },
} as const;

// Чип-фильтр в строке поиска: кнопка с меню-поповером
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
          className={`absolute top-full left-0 z-30 mt-1.5 max-h-64 w-60 overflow-y-auto rounded-xl border bg-white p-1 shadow-lg ${t.border}`}
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
  const [industry, setIndustry] = useState(presetIndustry ?? "");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyDorm, setOnlyDorm] = useState(false);
  const [onlyMilitary, setOnlyMilitary] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [gopLevel, setGopLevel] = useState<"university" | "college">("university");
  const [saved, setSaved] = useState<string[]>(["kaznu", "kimep"]);
  const [openGop, setOpenGop] = useState<string | null>(null);

  // Города выбранной области (или все)
  const cityOptions = useMemo(() => {
    const cities = [
      ...new Set(
        institutions
          .filter((u) => !region || (cityRegion[u.city] ?? "Другое") === region)
          .map((u) => u.city)
      ),
    ].sort();
    return cities.map((c) => ({ value: c, label: c }));
  }, [region]);

  const indPrograms = useMemo(
    () => (industry ? industryPrograms(industry) : null),
    [industry]
  );

  const counts = useMemo(
    () => ({
      university: institutions.filter((u) => !u.foreign && u.kind !== "college").length,
      college: institutions.filter((u) => u.kind === "college").length,
      foreign: institutions.filter((u) => u.foreign).length,
    }),
    []
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
        if (presetProgram && !u.programs.includes(presetProgram)) return false;
        if (indPrograms && !u.programs.some((p) => indPrograms.has(p)))
          return false;
        if (type === "university" && (u.foreign || u.kind === "college"))
          return false;
        if (type === "college" && u.kind !== "college") return false;
        if (type === "foreign" && !u.foreign) return false;
        if (region && (cityRegion[u.city] ?? "Другое") !== region) return false;
        if (city && u.city !== city) return false;
        if (maxPrice && u.priceFrom > Number(maxPrice)) return false;
        if (onlyDorm && !u.dorm) return false;
        if (onlyMilitary && !u.military) return false;
        if (onlySaved && !saved.includes(u.id)) return false;
        return true;
      }),
    [search, presetProgram, indPrograms, type, region, city, maxPrice, onlyDorm, onlyMilitary, onlySaved, saved]
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
        if (presetProgram && !g.programs.includes(presetProgram)) return false;
        if (indPrograms && !g.programs.some((p) => indPrograms.has(p)))
          return false;
        if (maxPrice && g.priceFrom > Number(maxPrice)) return false;
        return true;
      }),
    [gopLevel, search, presetProgram, indPrograms, maxPrice]
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
                ["university", "Вузы"],
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

      {/* Поиск с фильтрами внутри: строка + чипы под ней */}
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
          {/* Тип заведения — видимые чипы */}
          {mode === "institutions" &&
            typeChips.map((tc) => (
              <button
                key={tc.value}
                onClick={() => setType(type === tc.value ? "" : tc.value)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  type === tc.value ? t.chipOn : t.chip
                }`}
              >
                {tc.label}
                <span className={`font-mono text-[10px] ${type === tc.value ? "" : t.muted}`}>
                  {counts[tc.value]}
                </span>
              </button>
            ))}
          {mode === "institutions" && (
            <span className={`mx-1 h-4 w-px ${tone === "teal" ? "bg-slate-200" : "bg-stone-200"}`} />
          )}

          <FilterChip
            label="Отрасль"
            value={industry}
            options={industryOptions}
            onChange={setIndustry}
            tone={tone}
          />
          {mode === "institutions" && (
            <FilterChip
              label="Область"
              value={region}
              options={allRegions.map((r) => ({ value: r, label: r }))}
              onChange={(v) => {
                setRegion(v);
                setCity(""); // город зависит от области
              }}
              tone={tone}
            />
          )}
          {mode === "institutions" && (
            <FilterChip
              label="Город / район"
              value={city}
              options={cityOptions}
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

          {/* Карточки: логотип-квадрат + обзор, одно действие — «Подробнее» */}
          <div className="space-y-4">
            {filtered.map((u) => {
              const isSaved = saved.includes(u.id);
              const isCollege = u.kind === "college";
              return (
                <div
                  key={u.id}
                  className={`rounded-2xl border bg-white p-5 transition ${t.border} ${t.borderHover}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Маленький квадрат-логотип заведения */}
                    <div
                      className={`flex h-14 w-14 flex-none items-center justify-center rounded-xl border ${t.logo}`}
                    >
                      {isCollege ? (
                        <School size={24} strokeWidth={1.5} />
                      ) : (
                        <Building2 size={24} strokeWidth={1.5} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
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

                      <p className={`mt-2.5 line-clamp-2 text-sm leading-relaxed ${t.body}`}>
                        {u.description}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {u.grants && <Tag tone={tone}>Гранты</Tag>}
                        {u.dorm && !u.foreign && <Tag tone={tone}>Общежитие</Tag>}
                        {u.military && !isCollege && !u.foreign && (
                          <Tag tone={tone}>Военная кафедра</Tag>
                        )}
                        {u.mobility && !isCollege && !u.foreign && (
                          <Tag tone={tone}>Академ. мобильность</Tag>
                        )}
                      </div>

                      <div
                        className={`mt-3.5 flex items-center justify-between border-t pt-3.5 ${t.divide}`}
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

          {/* Список ГОП: минимум в строке, подробности — по клику */}
          <div className="space-y-3">
            {filteredGops.map((g) => {
              const isOpen = openGop === g.id;
              return (
                <div
                  key={g.id}
                  className={`rounded-2xl border bg-white transition ${t.border} ${isOpen ? "" : t.borderHover}`}
                >
                  {/* Свёрнутая строка: код, название, минимальные факты */}
                  <button
                    onClick={() => setOpenGop(isOpen ? null : g.id)}
                    className="flex w-full items-center gap-3 p-5 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold ${t.codePill}`}
                        >
                          {g.code ?? "без ГОП"}
                        </span>
                        <h3 className="font-display font-medium">{g.name}</h3>
                      </div>
                      <p className={`mt-1.5 font-mono text-xs ${t.muted}`}>
                        {g.institutionIds.length}{" "}
                        {plural(g.institutionIds.length, [
                          g.level === "college" ? "колледж" : "вуз",
                          g.level === "college" ? "колледжа" : "вуза",
                          g.level === "college" ? "колледжей" : "вузов",
                        ])}{" "}
                        · {g.duration} · {formatPrice(g.priceFrom)}
                      </p>
                    </div>
                    <ChevronDown
                      size={17}
                      className={`shrink-0 transition ${t.muted} ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Развёрнутые подробности */}
                  {isOpen && (
                    <div className={`border-t px-5 pt-4 pb-5 ${t.divide}`}>
                      <p className={`max-w-3xl text-sm leading-relaxed ${t.body}`}>
                        {g.about ?? g.description}
                      </p>

                      {/* Факты */}
                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <div className={`rounded-xl px-3.5 py-3 ${t.soft}`}>
                          <p className={`flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase ${t.muted}`}>
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
                        <div className={`rounded-xl px-3.5 py-3 ${t.soft}`}>
                          <p className={`flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase ${t.muted}`}>
                            <Banknote size={12} />
                            Стоимость
                          </p>
                          <p className="mt-1 font-medium">
                            {formatPrice(g.priceFrom)}
                            {g.priceTo ? ` – ${formatPrice(g.priceTo)}` : ""}
                          </p>
                        </div>
                        <div className={`rounded-xl px-3.5 py-3 ${t.soft}`}>
                          <p className={`flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase ${t.muted}`}>
                            <Languages size={12} />
                            Языки обучения
                          </p>
                          <p className="mt-1 font-medium">{g.languages.join(", ")}</p>
                        </div>
                        <div className={`rounded-xl px-3.5 py-3 ${t.soft}`}>
                          <p className={`flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase ${t.muted}`}>
                            <Clock size={12} />
                            Срок обучения
                          </p>
                          <p className="mt-1 font-medium">{g.duration}</p>
                        </div>
                      </div>

                      {/* Стоит присмотреться / чему научат / формат / кому не подойдёт */}
                      {g.lookIf && (
                        <div className={`mt-4 rounded-xl px-4 py-3.5 ${tone === "teal" ? "bg-teal-50" : "bg-violet-100/60"}`}>
                          <p className={`text-xs font-semibold ${t.accentText}`}>
                            Стоит присмотреться, если
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {g.lookIf.map((li) => (
                              <li key={li} className={`flex gap-2 text-sm ${t.body}`}>
                                <Check size={14} className={`mt-0.5 flex-none ${t.accentText}`} />
                                {li}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {g.learn && (
                        <div className="mt-3.5">
                          <p className="text-sm font-semibold">Чему конкретно научат</p>
                          <p className={`mt-1 text-sm leading-relaxed ${t.body}`}>{g.learn}</p>
                        </div>
                      )}
                      {g.format && (
                        <div className="mt-3.5">
                          <p className="text-sm font-semibold">Формат работы</p>
                          <p className={`mt-1 text-sm leading-relaxed ${t.body}`}>{g.format}</p>
                        </div>
                      )}

                      {/* Кем можно работать + входящие ОП */}
                      <div className="mt-4 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`mr-1 text-xs font-medium ${t.muted2}`}>
                            Кем можно работать:
                          </span>
                          {g.professions.map((p) => (
                            <span
                              key={p}
                              className={`rounded-full px-3 py-1 text-xs ${t.pill}`}
                            >
                              {p}
                            </span>
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

                      {g.notFor && (
                        <div className="mt-3.5 rounded-xl bg-amber-50 px-4 py-3">
                          <p className="text-xs font-semibold text-amber-800">
                            Кому точно не подойдёт
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-amber-900/80">
                            {g.notFor}
                          </p>
                        </div>
                      )}

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
                  )}
                </div>
              );
            })}
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
