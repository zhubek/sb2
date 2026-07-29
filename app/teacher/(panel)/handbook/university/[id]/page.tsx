import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, universities } from "@/lib/mock-data";

export default async function TeacherUniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const u = universities.find((x) => x.id === id);
  if (!u) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/teacher/handbook"
        className="text-sm text-slate-400 hover:text-slate-600"
      >
        ← Справочник образования
      </Link>

      <div className="grid grid-cols-3 gap-2">
        {["🏛️", "📚", "🎓"].map((e, i) => (
          <div
            key={i}
            className={`flex items-center justify-center rounded-xl bg-gradient-to-br text-4xl ${
              i === 0
                ? "col-span-2 h-40 from-teal-100 to-teal-50"
                : "h-40 from-slate-100 to-slate-50"
            }`}
          >
            {e}
          </div>
        ))}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold leading-snug">{u.name}</h1>
          <p className="mt-1 text-slate-500">
            {u.city}, {u.country}
            {u.foreign && " · зарубежный ВУЗ"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700">
          Данные видны ученикам
        </span>
      </div>

      <p className="leading-relaxed text-slate-600">{u.description}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            ["Стоимость обучения", formatPrice(u.priceFrom)],
            ["Проходной балл", `от ${u.minScore}`],
            ["Гранты и квоты", u.grants ? "Есть" : "Нет"],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Инфраструктура</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(
            [
              ["🛏️ Общежитие", u.dorm],
              ["🎖️ Военная кафедра", u.military],
              ["✈️ Академ. мобильность", u.mobility],
            ] as const
          ).map(([label, has]) => (
            <div
              key={label}
              className={`rounded-xl px-4 py-3 text-sm ${
                has
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-slate-50 text-slate-400 line-through"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        {u.perks.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {u.perks.map((p) => (
              <li
                key={p}
                className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-700"
              >
                {p}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Образовательные программы</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {u.programs.map((p) => (
            <li
              key={p}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span>{p}</span>
              <span className="text-slate-400">{formatPrice(u.priceFrom)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Контакты</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>📍 {u.address}</p>
          <p>📞 {u.phone}</p>
          <p>
            🌐 <span className="font-medium text-teal-600">{u.website}</span>
          </p>
        </div>
      </section>
    </div>
  );
}
