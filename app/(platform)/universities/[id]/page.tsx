import {
  BedDouble,
  BookOpen,
  Building2,
  Globe,
  GraduationCap,
  MapPin,
  Phone,
  Plane,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { colleges, formatPrice, universities } from "@/lib/mock-data";
import SaveButton from "./save-button";

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const u = [...universities, ...colleges].find((x) => x.id === id);
  if (!u) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/universities"
        className="text-sm text-stone-400 hover:text-stone-600"
      >
        ← К списку ВУЗов
      </Link>

      {/* Фото (мок-плейсхолдеры) */}
      <div className="grid grid-cols-3 gap-2">
        {[Building2, BookOpen, GraduationCap].map((Icon, i) => (
          <div
            key={i}
            className={`flex items-center justify-center rounded-2xl bg-gradient-to-br text-stone-300 ${
              i === 0
                ? "col-span-2 row-span-1 h-44 from-violet-200 to-violet-100"
                : "h-44 from-stone-100 to-stone-50"
            }`}
          >
            <Icon size={44} strokeWidth={1.25} />
          </div>
        ))}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl leading-snug font-semibold tracking-tight">
            {u.name}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-stone-500">
            <MapPin size={14} className="text-stone-400" />
            {u.city}, {u.country}
            {u.foreign && " · зарубежный ВУЗ"}
          </p>
        </div>
        <SaveButton />
      </div>

      <p className="leading-relaxed text-stone-600">{u.description}</p>

      {/* Ключевые факты */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Fact label="Стоимость обучения" value={formatPrice(u.priceFrom)} />
        <Fact label="Проходной балл" value={`от ${u.minScore}`} />
        <Fact label="Гранты и квоты" value={u.grants ? "Есть" : "Нет"} />
      </div>

      {/* Инфраструктура */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold">Инфраструктура и возможности</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(
            [
              [BedDouble, "Общежитие", u.dorm],
              [Shield, "Военная кафедра", u.military],
              [Plane, "Академ. мобильность", u.mobility],
            ] as const
          ).map(([Icon, label, has]) => (
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

      {/* Программы */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold">Образовательные программы</h2>
        <ul className="mt-4 divide-y divide-stone-100">
          {u.programs.map((p) => (
            <li
              key={p}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="flex items-center gap-2">
                <GraduationCap size={15} className="text-stone-400" />
                {p}
              </span>
              <span className="font-mono text-xs text-stone-400">
                {formatPrice(u.priceFrom)}
              </span>
            </li>
          ))}
        </ul>
      </section>

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
            <span className="cursor-pointer hover:text-stone-600">
              Instagram
            </span>
            <span className="cursor-pointer hover:text-stone-600">
              Telegram
            </span>
            <span className="cursor-pointer hover:text-stone-600">YouTube</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-xs text-stone-400">{label}</p>
      <p className="font-display mt-1 font-medium">{value}</p>
    </div>
  );
}
