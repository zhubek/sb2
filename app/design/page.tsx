"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useState } from "react";
import {
  CertificateArt,
  compassMarks,
  iconFamily,
} from "@/components/compass-marks";
import LazyLottie from "@/components/lazy-lottie";
import gallery from "@/lib/lottie-gallery.json";
import {
  IlluCompass,
  IlluFolder,
  IlluJourney,
  IlluPuzzle,
  IlluRobot,
  IlluRocket,
  IlluSkills,
  IlluUniversity,
} from "@/components/illustrations";

// ─── Токены трёх контекстов ──────────────────────────────────────────────────
// Классы записаны литералами (требование Tailwind JIT) — копируйте как есть.

type SystemKey = "student" | "teacher" | "admin";

const systems = {
  student: {
    title: "Платформа ученика",
    subtitle:
      "Редакционный тёплый стиль: бумажный фон, шрифт Unbounded в заголовках, чернильные кнопки, violet-акцент, янтарные стикеры.",
    accentName: "violet + amber (стикеры)",
    neutralName: "нейтральные, фон #fcfbfd",
    radiusName: "rounded-full (кнопки) / rounded-2xl (карточки)",
    navNote: "Словомарка + подчёркивание активного пункта, чек-лист у имени",
    card: "rounded-2xl border border-stone-200 bg-white p-6",
    cardTinted: "rounded-2xl bg-stone-900 p-6 text-white",
    cardDashed:
      "rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center",
    btnPrimary:
      "rounded-2xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600",
    btnSecondary:
      "rounded-full border border-stone-300 bg-white px-6 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-900",
    btnPill:
      "rounded bg-amber-300 px-2 py-0.5 text-[11px] font-semibold text-stone-900",
    link: "text-sm font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-violet-600",
    input:
      "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100",
    chipOn: "rounded-full border border-violet-600 bg-violet-600 px-3.5 py-1.5 text-sm text-white",
    chipOff:
      "rounded-full border border-stone-200 px-3.5 py-1.5 text-sm text-stone-600 hover:bg-stone-50",
    badgeOk: "rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800",
    badgeNo: "rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-500",
    badgeFlag: "-rotate-1 rounded bg-amber-300 px-2 py-0.5 text-[11px] font-semibold",
    bar: "bg-violet-600",
    barTrack: "bg-stone-200",
    aiBubble: "rounded-2xl bg-white px-4 py-3 text-sm text-stone-800 shadow-sm",
    userBubble: "rounded-2xl bg-stone-900 px-4 py-3 text-sm text-white",
    hintChip:
      "rounded-full border border-violet-200 bg-violet-100 px-3.5 py-1.5 text-xs text-violet-700 hover:bg-violet-200",
    accents: [
      ["violet-100", "bg-violet-100", "фоны-подложки, ховеры подсказок"],
      ["violet-600", "bg-violet-600", "акцент: активные состояния, бары, ссылки"],
      ["violet-700", "bg-violet-700", "ховер чернильных кнопок"],
      ["amber-300", "bg-amber-300", "стикеры, выделения (повёрнутые бейджи)"],
      ["stone-900", "bg-stone-900", "кнопки, тёмные карты, аватар"],
    ],
    neutrals: [
      ["#fcfbfd", "bg-[#fcfbfd] border border-stone-200", "фон страниц"],
      ["white", "bg-white border border-stone-200", "карточки, поля"],
      ["stone-200", "bg-stone-200", "границы, треки, разделители"],
      ["stone-400", "bg-stone-400", "подписи, брови-лейблы"],
      ["stone-600", "bg-stone-600", "второстепенный текст"],
      ["stone-900", "bg-stone-900", "основной текст, чернильные поверхности"],
    ],
  },
  teacher: {
    title: "Платформа педагога",
    subtitle:
      "Рабочий инструмент: плотнее, строже, тёмный сайдбар, teal-акцент, slate-нейтрали.",
    accentName: "teal",
    neutralName: "slate",
    radiusName: "rounded-xl (карточки и контролы)",
    navNote: "Тёмный сайдбар slate-900 + кнопка «Спросить AI»",
    card: "rounded-xl border border-slate-200 bg-white p-6",
    cardTinted: "rounded-xl border border-teal-200 bg-teal-50 p-6",
    cardDashed:
      "rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center",
    btnPrimary:
      "rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700",
    btnSecondary:
      "rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50",
    btnPill:
      "rounded-lg bg-teal-50 px-3.5 py-2 text-xs font-medium text-teal-700 transition hover:bg-teal-100",
    link: "text-sm font-medium text-teal-600 hover:text-teal-700",
    input:
      "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100",
    chipOn: "rounded-full border border-teal-600 bg-teal-600 px-3.5 py-1.5 text-sm text-white",
    chipOff:
      "rounded-full border border-slate-200 px-3.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50",
    badgeOk: "rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700",
    badgeNo: "rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500",
    badgeFlag: "rounded-full bg-teal-600 px-2.5 py-0.5 text-xs font-medium text-white",
    bar: "bg-teal-600",
    barTrack: "bg-slate-100",
    aiBubble: "rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-800",
    userBubble: "rounded-xl bg-teal-600 px-4 py-3 text-sm text-white",
    hintChip:
      "rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs text-teal-700 hover:bg-teal-100",
    accents: [
      ["teal-50", "bg-teal-50", "фоны-подложки, ховеры"],
      ["teal-100", "bg-teal-100", "лёгкие заливки"],
      ["teal-200", "bg-teal-200", "границы выделенных карточек"],
      ["teal-400", "bg-teal-400", "акцент в тёмном сайдбаре"],
      ["teal-500", "bg-teal-500", "логотип-марка"],
      ["teal-600", "bg-teal-600", "основной акцент: кнопки, бары"],
      ["teal-700", "bg-teal-700", "ховер акцента"],
    ],
    neutrals: [
      ["white", "bg-white border border-slate-200", "поверхности карточек"],
      ["slate-50", "bg-slate-50", "фон страниц"],
      ["slate-100", "bg-slate-100", "треки, сегмент-контролы"],
      ["slate-200", "bg-slate-200", "границы"],
      ["slate-400", "bg-slate-400", "подписи"],
      ["slate-800", "bg-slate-800", "активный пункт сайдбара"],
      ["slate-900", "bg-slate-900", "сайдбар"],
    ],
  },
  admin: {
    title: "Админ-панель",
    subtitle:
      "Контент-менеджмент платформы: токены ученика + тёмный сайдбар zinc-950, таблицы-first.",
    accentName: "indigo (как у ученика)",
    neutralName: "zinc",
    radiusName: "rounded-2xl (карточки) / rounded-xl (кнопки)",
    navNote: "Тёмный сайдбар zinc-950, эмодзи-иконки разделов",
    card: "rounded-2xl border border-zinc-200 bg-white p-6",
    cardTinted: "rounded-2xl border border-amber-200 bg-amber-50 p-6",
    cardDashed:
      "rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center",
    btnPrimary:
      "rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700",
    btnSecondary:
      "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-50",
    btnPill:
      "rounded-lg bg-indigo-50 px-3.5 py-2 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100",
    link: "text-xs font-medium text-indigo-600 hover:text-indigo-700",
    input:
      "w-64 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400",
    chipOn: "rounded-lg bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-900 shadow-sm",
    chipOff: "rounded-lg px-3.5 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700",
    badgeOk: "rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700",
    badgeNo: "rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500",
    badgeFlag: "rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-medium text-white",
    bar: "bg-indigo-600",
    barTrack: "bg-zinc-100",
    aiBubble: "rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-800",
    userBubble: "rounded-2xl bg-indigo-600 px-4 py-3 text-sm text-white",
    hintChip:
      "rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs text-indigo-700",
    accents: [
      ["indigo-600", "bg-indigo-600", "кнопки действий"],
      ["indigo-50", "bg-indigo-50", "подложки"],
      ["amber-50", "bg-amber-50", "служебные предупреждения"],
      ["sky-50", "bg-sky-50", "метки «зарубежный»"],
      ["emerald-50", "bg-emerald-50", "статус «Активен»"],
    ],
    neutrals: [
      ["zinc-950", "bg-zinc-950", "сайдбар"],
      ["zinc-800", "bg-zinc-800", "активный пункт сайдбара"],
      ["zinc-100", "bg-zinc-100", "прогресс-точки, бейджи"],
      ["zinc-50", "bg-zinc-50", "фон, ховер строк таблиц"],
      ["white", "bg-white border border-zinc-200", "карточки и таблицы"],
    ],
  },
} as const;

type TabKey = SystemKey | "illustrations";

const tabs: { key: TabKey; label: string }[] = [
  { key: "student", label: "Ученик" },
  { key: "teacher", label: "Педагог" },
  { key: "admin", label: "Админ" },
  { key: "illustrations", label: "Иллюстрации" },
];

// Скачанные Lottie-анимации (public/lottie/, LottieFiles · Lottie Simple License)
const lotties = [
  {
    file: "/lottie/robot-think.lottie",
    name: "robot-think",
    size: "6 КБ",
    use: "Экран «Обрабатываем ваши ответы» в тестах — уже используется",
    src: "https://lottiefiles.com/animations/robot-think-dDsY6lDNzq",
  },
  {
    file: "/lottie/education.lottie",
    name: "education",
    size: "49 КБ",
    use: "Кандидат: герой лендинга",
    src: "https://lottiefiles.com/animations/education-7xFGdFHimR",
  },
  {
    file: "/lottie/student.lottie",
    name: "student",
    size: "29 КБ",
    use: "Кандидат: онбординг, приветствие",
    src: "https://lottiefiles.com/animations/student-jnbONfwfAL",
  },
  {
    file: "/lottie/learning.lottie",
    name: "learning",
    size: "19 КБ",
    use: "Кандидат: раздел «Тесты», обучение",
    src: "https://lottiefiles.com/animations/learn-object-onflecjO5M",
  },
  {
    file: "/lottie/graduation.lottie",
    name: "graduation",
    size: "9 КБ",
    use: "Кандидат: выбор программы, финал пути",
    src: "https://lottiefiles.com/animations/college-graduation-2CAklbbKea",
  },
  {
    file: "/lottie/trophy.lottie",
    name: "trophy",
    size: "129 КБ",
    use: "Кандидат: портфолио, достижения",
    src: "https://lottiefiles.com/animations/6-1mo3C04OXC",
  },
  {
    file: "/lottie/confetti.lottie",
    name: "confetti",
    size: "11 КБ",
    use: "Кандидат: все 3 теста пройдены, отчёт готов",
    src: "https://lottiefiles.com/animations/%E6%B2%99%E6%B9%96-9fDmLhfAme",
  },
];

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="font-semibold">{title}</h2>
      {note && <p className="mt-1 text-sm text-zinc-500">{note}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Recipe({ code }: { code: string }) {
  return (
    <code className="mt-2 block overflow-x-auto rounded-lg bg-zinc-50 px-3 py-2 font-mono text-[11px] leading-relaxed text-zinc-500">
      {code}
    </code>
  );
}

const galleryCategories = [...new Set(gallery.map((g) => g.category))];

export default function DesignSystemPage() {
  const [tab, setTab] = useState<TabKey>("student");
  const [galleryCat, setGalleryCat] = useState<string>("Все");
  const s = systems[tab === "illustrations" ? "student" : tab];
  const galleryItems =
    galleryCat === "Все"
      ? gallery
      : gallery.filter((g) => g.category === galleryCat);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Шапка страницы */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
              DS
            </span>
            <span className="text-sm font-semibold">Дизайн-система</span>
          </div>
          <div className="flex rounded-xl bg-zinc-100 p-1 text-sm font-medium">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-4 py-1.5 transition ${
                  tab === t.key
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-600">
            На платформу →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        {tab === "illustrations" ? (
          <>
            <div>
              <h1 className="text-2xl font-bold">Иллюстрации и анимации</h1>
              <p className="mt-1 text-zinc-500">
                Общая графическая библиотека платформы: SVG-иллюстрации в
                фирменной палитре и Lottie-анимации для ключевых моментов.
              </p>
            </div>

            {/* Компас: варианты фирменного знака */}
            <Section
              title="Компас — одна форма, разные анимации"
              note="Минимальный знак (components/compass-marks.tsx): круг + наклонный ромб, ничего лишнего. 6 вариантов движения; «Морф» — ромб перетекает в стрелку и обратно. Lottie-референсы справа для сравнения."
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {compassMarks.map((m) => {
                  const Mark = m.node;
                  return (
                    <div
                      key={m.id}
                      className="flex flex-col items-center rounded-xl border border-zinc-100 p-5 text-center"
                    >
                      <Mark className="h-20 w-20" />
                      <p className="mt-3 text-sm font-medium">{m.name}</p>
                      <p className="mt-1 text-xs text-zinc-400">{m.desc}</p>
                      <p className="mt-1.5 font-mono text-[10px] text-zinc-300">
                        SVG · ~1 КБ
                      </p>
                    </div>
                  );
                })}
                {[
                  { id: "1510195", name: "Lottie-референс", file: "/lottie/gallery/1510195.lottie" },
                  { id: "66750", name: "Lottie · текущий", file: "/lottie/gallery/66750.lottie" },
                ].map((l) => (
                  <div
                    key={l.id}
                    className="flex flex-col items-center rounded-xl border border-dashed border-zinc-200 p-5 text-center"
                  >
                    <LazyLottie src={l.file} className="h-20 w-20" />
                    <p className="mt-3 text-sm font-medium">{l.name}</p>
                    <p className="mt-1 font-mono text-[10px] text-zinc-300">
                      #{l.id} · Lottie
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 mb-3 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                Семейство иконок в том же языке
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {iconFamily.map((m) => {
                  const Icon = m.node;
                  return (
                    <div
                      key={m.id}
                      className="flex flex-col items-center rounded-xl border border-zinc-100 p-5 text-center"
                    >
                      <Icon className="h-20 w-20" />
                      <p className="mt-3 text-sm font-medium">{m.name}</p>
                      <p className="mt-1 text-xs text-zinc-400">{m.desc}</p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 mb-3 text-xs font-medium tracking-wide text-zinc-400 uppercase">
                Крупные иллюстрации
              </p>
              <div className="flex items-center gap-6 rounded-xl border border-zinc-100 p-6">
                <CertificateArt className="w-72 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Сертификат</p>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed text-zinc-400">
                    Крупная SVG-иллюстрация: документ статичен, фирменный
                    знак-печать в правом нижнем углу периодически дрожит.
                    Для портфолио, достижений и экранов «документ готов».
                  </p>
                </div>
              </div>
            </Section>

            {/* SVG-библиотека */}
            <Section
              title="SVG-иллюстрации (components/illustrations.tsx)"
              note="Индиго-палитра, нарисованы вручную, анимированы CSS-классами. Используйте для пустых состояний, интро тестов и онбординга."
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["IlluJourney", <IlluJourney key="j" className="w-full" />],
                  ["IlluSkills", <IlluSkills key="s" className="w-full" />],
                  ["IlluRobot", <IlluRobot key="r" className="w-full" />],
                  [
                    "IlluUniversity",
                    <IlluUniversity key="u" className="w-full" />,
                  ],
                  ["IlluCompass", <IlluCompass key="c" className="w-full" />],
                  ["IlluPuzzle", <IlluPuzzle key="p" className="w-full" />],
                  ["IlluFolder", <IlluFolder key="f" className="w-full" />],
                  ["IlluRocket", <IlluRocket key="k" className="w-full" />],
                ].map(([name, node]) => (
                  <div
                    key={name as string}
                    className="rounded-xl border border-zinc-100 p-3 text-center"
                  >
                    {node}
                    <p className="mt-1 font-mono text-[11px] text-zinc-400">
                      {name as string}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* CSS-анимации */}
            <Section
              title="CSS-анимации иллюстраций"
              note="Классы из globals.css; все отключаются при prefers-reduced-motion."
            >
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                {[
                  ["illu-float", "плавное парение вверх-вниз (шапочка, медаль, пазлы)"],
                  ["illu-dash", "бегущий пунктир пути (герой лендинга)"],
                  ["illu-grow", "рост столбцов от базовой линии (навыки)"],
                  ["illu-blink", "моргание глаз робота"],
                  ["illu-wobble", "покачивание стрелки компаса"],
                  ["illu-flame", "мерцание пламени ракеты"],
                  ["illu-pulse", "пульсация искр и индикаторов"],
                ].map(([cls, desc]) => (
                  <div key={cls} className="flex items-baseline gap-2">
                    <code className="shrink-0 rounded bg-zinc-50 px-1.5 py-0.5 font-mono text-xs text-indigo-600">
                      {cls}
                    </code>
                    <span className="text-zinc-600">{desc}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Lottie-галерея */}
            <Section
              title="Lottie-анимации (public/lottie/)"
              note="Скачаны с LottieFiles (Lottie Simple License). Рендер: <DotLottieReact src='/lottie/….lottie' loop autoplay />. Поиск новых: node scripts/lottie-search.mjs «ключевые слова»."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lotties.map((l) => (
                  <div
                    key={l.name}
                    className="flex flex-col rounded-xl border border-zinc-100 p-4"
                  >
                    <DotLottieReact
                      src={l.file}
                      loop
                      autoplay
                      className="mx-auto h-36 w-full"
                    />
                    <p className="mt-2 font-mono text-xs">
                      {l.name}.lottie{" "}
                      <span className="text-zinc-400">· {l.size}</span>
                    </p>
                    <p className="mt-1 flex-1 text-xs text-zinc-500">{l.use}</p>
                    <a
                      href={l.src}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Источник на LottieFiles →
                    </a>
                  </div>
                ))}
              </div>
            </Section>

            {/* Полная галерея для выбора */}
            <Section
              title={`Галерея для выбора · ${gallery.length} анимаций`}
              note="Собрано скриптом scripts/lottie-harvest.mjs по тематикам платформы (LottieFiles, Lottie Simple License). Плееры загружаются лениво при прокрутке. Выберите понравившиеся — и мы поставим их на страницы (при необходимости перекрасив в палитру)."
            >
              <div className="mb-5 flex flex-wrap gap-2">
                {["Все", ...galleryCategories].map((c) => (
                  <button
                    key={c}
                    onClick={() => setGalleryCat(c)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      galleryCat === c
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {c}
                    {c !== "Все" && (
                      <span className="ml-1 opacity-60">
                        {gallery.filter((g) => g.category === c).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {galleryItems.map((g) => (
                  <div
                    key={g.id}
                    className="flex flex-col rounded-xl border border-zinc-100 p-3"
                  >
                    <LazyLottie src={g.file} className="h-28 w-full" />
                    <p
                      className="mt-2 truncate text-xs font-medium"
                      title={g.name}
                    >
                      {g.name}
                    </p>
                    <p className="mt-0.5 flex-1 font-mono text-[10px] text-zinc-400">
                      #{g.id} · {g.sizeKB} КБ · {g.category}
                    </p>
                    <a
                      href={g.src}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Источник →
                    </a>
                  </div>
                ))}
              </div>
            </Section>
          </>
        ) : (
          <>
        <div>
          <h1 className="text-2xl font-bold">{s.title}</h1>
          <p className="mt-1 text-zinc-500">{s.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600">
              Акцент: {s.accentName}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600">
              Нейтрали: {s.neutralName}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600">
              Скругления: {s.radiusName}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600">
              Навигация: {s.navNote}
            </span>
          </div>
        </div>

        {/* Цвета */}
        <Section
          title="Цвета"
          note="Один акцентный цвет на систему. Семантика едина для всех: emerald — успех, amber — внимание/награда, rose — ошибка."
        >
          <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
            Акцент
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {s.accents.map(([name, cls, usage]) => (
              <div key={name} className="flex items-center gap-3">
                <span className={`h-9 w-9 shrink-0 rounded-lg ${cls}`} />
                <div className="min-w-0">
                  <p className="font-mono text-xs">{name}</p>
                  <p className="truncate text-xs text-zinc-400">{usage}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs font-medium tracking-wide text-zinc-400 uppercase">
            Нейтрали
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {s.neutrals.map(([name, cls, usage]) => (
              <div key={name} className="flex items-center gap-3">
                <span className={`h-9 w-9 shrink-0 rounded-lg ${cls}`} />
                <div className="min-w-0">
                  <p className="font-mono text-xs">{name}</p>
                  <p className="truncate text-xs text-zinc-400">{usage}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs font-medium tracking-wide text-zinc-400 uppercase">
            Семантика (общая)
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              emerald · успех / пройден
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              amber · внимание / награда
            </span>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
              rose · ошибка
            </span>
          </div>
        </Section>

        {/* Типографика */}
        <Section
          title="Типографика"
          note="Системный шрифт (ui-sans-serif). Иерархия — размером и весом, не цветом."
        >
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold">Заголовок страницы</p>
              <Recipe code="text-2xl font-bold" />
            </div>
            <div>
              <p className="font-semibold">Заголовок секции / карточки</p>
              <Recipe code="font-semibold" />
            </div>
            <div>
              <p className="text-sm text-zinc-600">
                Основной текст — описания, параграфы, пояснения.
              </p>
              <Recipe code="text-sm text-zinc-600 (педагог: text-slate-600)" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">
                Подпись — даты, метаданные, вспомогательные подсказки
              </p>
              <Recipe code="text-xs text-zinc-400" />
            </div>
          </div>
        </Section>

        {/* Кнопки */}
        <Section title="Кнопки и ссылки" note="Один основной CTA на экран.">
          <div className="flex flex-wrap items-center gap-3">
            <button className={s.btnPrimary}>Основное действие</button>
            <button className={s.btnSecondary}>Второстепенное</button>
            <button className={s.btnPill}>Подробнее</button>
            <button className={`${s.btnPrimary} cursor-not-allowed opacity-40`}>
              Недоступно
            </button>
            <a href="#" className={s.link}>
              Текстовая ссылка →
            </a>
          </div>
          <Recipe code={s.btnPrimary} />
        </Section>

        {/* Бейджи */}
        <Section title="Бейджи и статусы">
          <div className="flex flex-wrap items-center gap-2">
            <span className={s.badgeOk}>Пройден</span>
            <span className={s.badgeNo}>Не пройден</span>
            <span className={s.badgeFlag}>Флагманский тест</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
              Скоро
            </span>
          </div>
          <Recipe code={s.badgeOk} />
        </Section>

        {/* Карточки */}
        <Section title="Карточки и поверхности">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className={s.card}>
              <p className="font-semibold">Стандартная</p>
              <p className="mt-1 text-sm text-zinc-500">
                Основной контейнер контента
              </p>
            </div>
            <div className={s.cardTinted}>
              <p className="font-semibold">Выделенная</p>
              <p className="mt-1 text-sm text-zinc-600">
                Акцентные блоки: отчёт, рекомендации
              </p>
            </div>
            <div className={s.cardDashed}>
              <p className="font-semibold">Пустое состояние</p>
              <p className="mt-1 text-sm text-zinc-500">
                Нет данных + иллюстрация + CTA
              </p>
            </div>
          </div>
          <Recipe code={s.card} />
        </Section>

        {/* Формы */}
        <Section title="Формы и фильтры">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <input placeholder="Текстовое поле" className={s.input} />
              <select className={s.input}>
                <option>Выпадающий список</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Фильтры-чипы</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button className={s.chipOn}>Выбрано</button>
                <button className={s.chipOff}>Не выбрано</button>
                <button className={s.chipOff}>Ещё фильтр</button>
              </div>
            </div>
          </div>
          <Recipe code={s.input} />
        </Section>

        {/* Прогресс и данные */}
        <Section
          title="Прогресс и данные"
          note="Одна серия — один цвет; подписи несут идентичность, тултип по ховеру."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Прогресс-бар</span>
                  <span className="font-medium text-zinc-500">64%</span>
                </div>
                <div className={`mt-1.5 h-2 overflow-hidden rounded-full ${s.barTrack}`}>
                  <div className={`h-full w-2/3 rounded-full ${s.bar}`} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Горизонтальный бар (BarList)</span>
                  <span className="font-medium text-zinc-500">96</span>
                </div>
                <div className={`mt-1.5 h-2 overflow-hidden rounded-full ${s.barTrack}`}>
                  <div className={`h-full w-full rounded-full ${s.bar}`} />
                </div>
                <div className="mt-1.5 flex justify-between text-sm">
                  <span>Вторая строка</span>
                  <span className="font-medium text-zinc-500">55</span>
                </div>
                <div className={`mt-1.5 h-2 overflow-hidden rounded-full ${s.barTrack}`}>
                  <div className={`h-full w-3/5 rounded-full ${s.bar}`} />
                </div>
              </div>
            </div>
            <div className={s.card}>
              <p className="text-2xl font-bold">412</p>
              <p className="mt-1 text-sm text-zinc-500">
                Стат-карточка: число + подпись
              </p>
            </div>
          </div>
        </Section>

        {/* Чат */}
        <Section title="Чат с ИИ">
          <div className="max-w-md space-y-2">
            <div className={`${s.aiBubble} max-w-[85%]`}>
              Сообщение ассистента — нейтральная подложка.
            </div>
            <div className={`${s.userBubble} ml-auto max-w-[85%]`}>
              Сообщение пользователя — акцентная.
            </div>
            <div className="flex gap-2 pt-1">
              <button className={s.hintChip}>Шаблон вопроса</button>
              <button className={s.hintChip}>Ещё подсказка</button>
            </div>
          </div>
        </Section>

        {/* Соответствие токенов */}
        <Section
          title="Соответствие токенов между системами"
          note="Новые страницы собираются из этих пар — меняется только контекст."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs text-zinc-400">
                  <th className="py-2 pr-4 font-medium">Роль</th>
                  <th className="py-2 pr-4 font-medium">Ученик</th>
                  <th className="py-2 pr-4 font-medium">Педагог</th>
                  <th className="py-2 font-medium">Админ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 font-mono text-xs">
                <tr>
                  <td className="py-2.5 pr-4 font-sans">Акцент</td>
                  <td className="py-2.5 pr-4">indigo-600</td>
                  <td className="py-2.5 pr-4">teal-600</td>
                  <td className="py-2.5">indigo-600</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans">Нейтрали</td>
                  <td className="py-2.5 pr-4">zinc-*</td>
                  <td className="py-2.5 pr-4">slate-*</td>
                  <td className="py-2.5">zinc-*</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans">Карточка</td>
                  <td className="py-2.5 pr-4">rounded-2xl</td>
                  <td className="py-2.5 pr-4">rounded-xl</td>
                  <td className="py-2.5">rounded-2xl</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans">Навигация</td>
                  <td className="py-2.5 pr-4 font-sans">светлый топбар</td>
                  <td className="py-2.5 pr-4 font-sans">сайдбар slate-900</td>
                  <td className="py-2.5 font-sans">сайдбар zinc-950</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans">ИИ-доступ</td>
                  <td className="py-2.5 pr-4 font-sans">виджет-чат + страница</td>
                  <td className="py-2.5 pr-4 font-sans">кнопка «Спросить AI»</td>
                  <td className="py-2.5 font-sans">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>
          </>
        )}

        <p className="pb-4 text-center text-xs text-zinc-400">
          Дизайн-система · AI профориентатор · при создании новых страниц
          копируйте рецепты классов из этой страницы
        </p>
      </main>
    </div>
  );
}
