"use client";

import {
  Banknote,
  BedDouble,
  Check,
  ChevronDown,
  Clock,
  Globe,
  GraduationCap,
  Languages,
  ListChecks,
  MapPin,
  Phone,
  Plane,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { colleges, formatPrice, gops, universities } from "@/lib/mock-data";
import type { Gop, University } from "@/lib/types";

// Внутренняя страница заведения: две вкладки — «О заведении» и «Программы (ГОП)»
export default function InstitutionTabs({ id }: { id: string }) {
  const u = [...universities, ...colleges].find((x) => x.id === id) as University;
  const [tab, setTab] = useState<"about" | "programs">("about");
  const [openGop, setOpenGop] = useState<string | null>(null);

  const isCollege = u.kind === "college";
  const instGops = gops.filter((g) => g.institutionIds.includes(id));

  // Военная кафедра и академ. мобильность — только для казахстанских вузов;
  // общежитие не показываем для зарубежных
  const infra = [
    ...(!u.foreign ? [[BedDouble, "Общежитие", u.dorm] as const] : []),
    ...(!isCollege && !u.foreign
      ? [
          [Shield, "Военная кафедра", u.military] as const,
          [Plane, "Академ. мобильность", u.mobility] as const,
        ]
      : []),
  ];

  return (
    <div>
      {/* Вкладки */}
      <div className="flex gap-6 border-b border-stone-200">
        {(
          [
            ["about", "О заведении"],
            ["programs", `Программы (ГОП) · ${instGops.length}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 pb-2.5 text-sm font-medium transition ${
              tab === key
                ? "border-violet-600 text-stone-900"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "about" ? (
        <div className="mt-5 space-y-6">
          <p className="leading-relaxed text-stone-600">{u.description}</p>

          {/* Инфраструктура */}
          {infra.length > 0 && (
            <section className="rounded-2xl border border-stone-200 bg-white p-6">
              <h2 className="font-semibold">Инфраструктура и возможности</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {infra.map(([Icon, label, has]) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm ${
                      has
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-stone-50 text-stone-400 line-through"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={has ? "text-emerald-600" : "text-stone-300"}
                    />
                    {label}
                  </div>
                ))}
              </div>
              {u.perks.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-stone-500">
                    Дополнительные преимущества
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {u.perks.map((p) => (
                      <li
                        key={p}
                        className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Академическая мобильность — отдельный блок */}
          {u.mobility && !isCollege && !u.foreign && (
            <section className="rounded-2xl border border-sky-200 bg-sky-100/50 p-6">
              <h2 className="flex items-center gap-2 font-semibold text-sky-900">
                <Plane size={16} className="text-sky-600" />
                Академическая мобильность
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Студенты могут провести семестр или год в вузе-партнёре — в
                Казахстане или за рубежом — с перезачётом кредитов. Доступны
                программы обмена, двудипломные треки и летние школы; отбор
                проходит по GPA и мотивационному письму.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Erasmus+", "Двудипломные программы", "Летние школы", "Вузы-партнёры"].map((x) => (
                  <span key={x} className="rounded-full bg-sky-100 px-3 py-1 text-xs text-sky-800">
                    {x}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Контакты */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="font-semibold">Контакты</h2>
            <div className="mt-4 space-y-2.5 text-sm text-stone-600">
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-stone-400" /> {u.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-stone-400" /> {u.phone}
              </p>
              <p className="flex items-center gap-2">
                <Globe size={15} className="text-stone-400" />
                <span className="font-medium text-violet-600">{u.website}</span>
              </p>
              <div className="flex gap-3 pt-2 text-stone-400">
                <span className="cursor-pointer hover:text-stone-600">Instagram</span>
                <span className="cursor-pointer hover:text-stone-600">Telegram</span>
                <span className="cursor-pointer hover:text-stone-600">YouTube</span>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {instGops.map((g) => (
            <GopCard
              key={g.id}
              g={g}
              open={openGop === g.id}
              onToggle={() => setOpenGop(openGop === g.id ? null : g.id)}
            />
          ))}
          {/* Программы вне ГОП */}
          {u.programs
            .filter((p) => !instGops.some((g) => g.programs.includes(p)))
            .map((p) => (
              <div
                key={p}
                className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm"
              >
                <span className="flex items-center gap-2 font-medium">
                  <GraduationCap size={15} className="text-stone-400" />
                  {p}
                </span>
                <span className="font-mono text-xs text-stone-400">
                  {formatPrice(u.priceFrom)}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// Кликабельная карточка ГОП: минимум в строке, вся информация внутри
function GopCard({
  g,
  open,
  onToggle,
}: {
  g: Gop;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white transition hover:border-violet-200">
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-5 text-left">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold tracking-wide text-violet-600 uppercase">
            ГОП {g.code ?? "—"}
          </p>
          <h3 className="font-display mt-0.5 font-medium">{g.name}</h3>
          <p className="mt-1 font-mono text-xs text-stone-400">
            {g.duration} · {g.languages.map((l) => l.slice(0, 3).toUpperCase()).join(" · ")}
            {g.entScore ? ` · балл от ${g.entScore}` : ""}
          </p>
        </div>
        <ChevronDown
          size={17}
          className={`shrink-0 text-stone-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-stone-100 px-5 pt-4 pb-5">
          {/* Срок / языки / предметы ЕНТ */}
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-stone-50 px-3.5 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-400 uppercase">
                <Clock size={12} />
                Срок
              </p>
              <p className="mt-1 font-medium">{g.duration}</p>
            </div>
            <div className="rounded-xl bg-stone-50 px-3.5 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-400 uppercase">
                <Languages size={12} />
                Языки
              </p>
              <p className="mt-1 font-medium">
                {g.languages.map((l) => l.slice(0, 3).toUpperCase()).join(" · ")}
              </p>
            </div>
            <div className="rounded-xl bg-stone-50 px-3.5 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-400 uppercase">
                <ListChecks size={12} />
                Предметы ЕНТ
              </p>
              <p className="mt-1 font-medium">
                {g.entSubjects ? g.entSubjects.join(" + ") : "конкурс аттестатов"}
              </p>
            </div>
          </div>

          {/* О чём эта группа */}
          <div className="mt-4">
            <p className="text-sm font-semibold">О чём эта группа</p>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">
              {g.about ?? g.description}
            </p>
          </div>

          {g.lookIf && (
            <div className="mt-3.5 rounded-xl bg-violet-100/60 px-4 py-3.5">
              <p className="text-xs font-semibold text-violet-700">
                Стоит присмотреться, если
              </p>
              <ul className="mt-2 space-y-1.5">
                {g.lookIf.map((li) => (
                  <li key={li} className="flex gap-2 text-sm text-stone-700">
                    <Check size={14} className="mt-0.5 flex-none text-violet-600" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {g.learn && (
            <div className="mt-3.5">
              <p className="text-sm font-semibold">Чему конкретно научат</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{g.learn}</p>
            </div>
          )}
          {g.format && (
            <div className="mt-3.5">
              <p className="text-sm font-semibold">Формат работы</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{g.format}</p>
            </div>
          )}

          <div className="mt-3.5">
            <p className="text-sm font-semibold">Кем можно работать</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {g.professions.map((p) => (
                <span key={p} className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {g.notFor && (
            <div className="mt-3.5 rounded-xl bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold text-amber-800">Кому точно не подойдёт</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-900/80">{g.notFor}</p>
            </div>
          )}

          {/* Стоимость */}
          <p className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-3 text-sm">
            <Banknote size={15} className="text-stone-400" />
            <span className="font-medium">
              {formatPrice(g.priceFrom)}
              {g.priceTo ? ` – ${formatPrice(g.priceTo)}` : ""}
            </span>
            <span className="text-xs text-stone-400">в год</span>
          </p>
        </div>
      )}
    </div>
  );
}
