import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/compass-marks";

const pages = [
  { href: "/popularuniversity", label: "Университеты" },
  { href: "/skills", label: "Навыки" },
  { href: "/professions", label: "Топ профессии" },
  { href: "/workingprofessionsgen", label: "Рабочие профессии" },
];

// Общий каркас публичных инфо-страниц (без авторизации)
export default function InfoShell({
  active,
  eyebrow,
  title,
  lede,
  children,
}: {
  active: string;
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-stone-700">
      {/* Шапка */}
      <header className="sticky top-0 z-40 border-b border-stone-100 bg-[#faf9f7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link
            href="/"
            className="font-display flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <LogoMark className="h-7 w-7" />
            <span>
              профориентатор<span className="text-violet-600">.</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {pages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className={`rounded-xl px-3.5 py-2 text-sm transition ${
                  p.href === active
                    ? "bg-violet-50 font-semibold text-violet-700"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {p.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/auth"
            className="group flex items-center gap-1.5 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-bold text-stone-800 transition hover:bg-orange-400"
          >
            Начать диагностику
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </header>

      {/* Заголовок страницы */}
      <section className="px-4 pt-14 pb-8 text-center sm:px-6">
        <p className="text-sm font-medium tracking-wide text-violet-600 uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mx-auto mt-3 max-w-3xl text-3xl tracking-tight text-stone-800 md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-stone-500 md:text-lg">
          {lede}
        </p>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">{children}</main>

      {/* CTA + футер */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[36px] bg-violet-50 px-6 py-14 text-center">
          <h2 className="font-display text-2xl text-violet-800 md:text-4xl">
            Не знаешь, что выбрать?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-violet-800/70">
            Пройди тест «Мои навыки» — и получи персональные рекомендации по
            профессиям, программам и вузам.
          </p>
          <Link
            href="/auth"
            className="group mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-3.5 font-bold text-stone-800 transition hover:bg-orange-400"
          >
            Начать диагностику
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
      <footer className="border-t border-stone-100 py-8 text-center text-xs text-stone-400">
        AI профориентатор ·{" "}
        {pages.map((p, i) => (
          <span key={p.href}>
            {i > 0 && " · "}
            <Link href={p.href} className="transition hover:text-stone-600">
              {p.label}
            </Link>
          </span>
        ))}
      </footer>
    </div>
  );
}
