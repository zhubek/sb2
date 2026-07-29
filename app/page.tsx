import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Compass,
  FileText,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import ProfessionCarousel from "@/components/profession-carousel";
import { LogoMark } from "@/components/compass-marks";
import LandingSteps from "@/components/landing-steps";

const pillars = [
  {
    icon: <FileText size={30} />,
    title: "Три теста",
    desc: "DeBruce определяет 10 навыков, MBTI — тип личности, Голланд — профессиональные интересы. Вместе — полный портрет.",
    features: [
      "Рекомендации уже после первого теста",
      "Разделы и понятные вопросы",
      "История прохождений сохраняется",
      "Перепрохождение без потери данных",
    ],
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: <Bot size={30} />,
    title: "AI-ассистент",
    desc: "Знает твои результаты и весь справочник образования. Объяснит, посоветует и подскажет следующий шаг — на любой странице.",
    features: [
      "Комплексный отчёт по трём тестам",
      "Ответы про профессии и навыки",
      "Помощь с выбором программы",
      "Доступен сразу после регистрации",
    ],
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: <Compass size={30} />,
    title: "Навигатор ВУЗов",
    desc: "Все казахстанские университеты и ~100 зарубежных, с фильтрами по программам, городам, стоимости и грантам.",
    features: [
      "Фильтры настраиваются автоматически",
      "Гранты, общежития, военные кафедры",
      "Карточка вуза со всеми программами",
      "Избранное в личном кабинете",
    ],
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

const faq = [
  {
    q: "Сколько времени занимают тесты?",
    a: "Тест DeBruce — около 15 минут. MBTI и Голланд — по 8–10 минут. Проходить всё сразу не обязательно: уже после DeBruce вы получите первые рекомендации.",
  },
  {
    q: "Обязательно ли проходить все три теста?",
    a: "Нет. Рекомендации по отраслям и программам открываются уже после DeBruce. Но если пройти все три, ИИ составит подробный комплексный отчёт о вашей личности и карьерных перспективах.",
  },
  {
    q: "Это бесплатно?",
    a: "Да, диагностика и рекомендации платформы бесплатны для школьников.",
  },
  {
    q: "Какие университеты есть в навигаторе?",
    a: "Все казахстанские ВУЗы и около 100 популярных зарубежных — с фильтрами по программам, городам, стоимости, грантам и общежитиям.",
  },
  {
    q: "Можно ли перепройти тест?",
    a: "Да, по истечении определённого времени. История всех прохождений сохраняется — старые результаты не удаляются.",
  },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-violet-500/30">
      {/* Фоновое свечение вместо Three.js */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[840px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute top-1/3 -left-40 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-0 h-[380px] w-[520px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      {/* Навбар */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display flex items-center gap-2 text-sm font-semibold tracking-tight">
            <LogoMark dark className="h-6 w-6" />
            <span>профориентатор<span className="text-cyan-400">.</span></span>
          </span>
          <nav className="hidden gap-8 text-sm text-slate-400 md:flex">
            <a href="#how" className="transition hover:text-white">
              Как это работает
            </a>
            <a href="#pillars" className="transition hover:text-white">
              Возможности
            </a>
            <a href="#faq" className="transition hover:text-white">
              Вопросы
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Войти
            </Link>
            <Link
              href="/auth"
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              Начать
            </Link>
          </div>
        </div>
      </header>

      {/* Герой */}
      <section className="relative z-10 px-6 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300 backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-400" />
              AI-профориентация для школьников Казахстана
            </div>

            <h1 className="font-display text-4xl leading-[1.12] font-semibold tracking-tight text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text drop-shadow-sm md:text-6xl">
              Узнай свои сильные стороны —{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                и найди свой университет
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-slate-300 md:text-xl lg:mx-0">
              Диагностика из трёх тестов, комплексный отчёт ИИ и навигатор по
              университетам. От первого вопроса до образовательной программы.
            </p>

            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
              <Link
                href="/auth"
                className="group flex items-center justify-center gap-2 rounded-full bg-violet-600 px-8 py-4 font-semibold text-white shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all hover:bg-violet-500 hover:shadow-[0_0_50px_-10px_rgba(124,58,237,0.8)]"
              >
                Пройти тест
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href="#how"
                className="rounded-full border border-slate-600/50 bg-slate-800/50 px-8 py-4 text-center font-semibold text-white backdrop-blur-md transition-all hover:border-slate-400/50 hover:bg-slate-700/50"
              >
                Как это работает
              </a>
            </div>

            <p className="pt-6 text-sm font-medium text-slate-500">
              Все казахстанские ВУЗы + 100 зарубежных ·{" "}
              <span className="text-slate-300">бесплатно для школьников</span>
            </p>
          </div>

          <div className="hidden justify-center lg:flex">
            <ProfessionCarousel />
          </div>
        </div>
      </section>

      {/* Блок «3 шага» — интерактивный */}
      <LandingSteps />

      {/* Три опоры платформы */}
      <section id="pillars" className="relative z-10 bg-slate-900/30 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="font-display mb-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Три инструмента — одна платформа
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Диагностика, сопровождение и выбор — не три сервиса, а один
              последовательный путь.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm transition-colors hover:border-slate-700"
              >
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl ${p.bg} ${p.color} transition-transform group-hover:scale-110`}
                >
                  {p.icon}
                </div>
                <h3 className="font-display mb-3 text-xl font-medium text-white">
                  {p.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-400">
                  {p.desc}
                </p>
                <ul className="space-y-3">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <CheckCircle2 size={16} className={`mt-0.5 ${p.color}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display mb-10 text-center text-3xl font-semibold tracking-tight text-white">
            Частые вопросы
          </h2>
          <div className="divide-y divide-slate-800">
            {faq.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 font-medium text-slate-200 transition hover:text-white">
                  {item.q}
                  <span className="text-slate-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="relative z-10 px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[300px] max-w-2xl -translate-y-1/2 rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="relative mx-auto max-w-2xl space-y-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">
            15 минут — и ты знаешь{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              свои сильные стороны
            </span>
          </h2>
          <Link
            href="/auth"
            className="group inline-flex items-center gap-2 rounded-full bg-violet-600 px-9 py-4 font-semibold text-white shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all hover:bg-violet-500 hover:shadow-[0_0_50px_-10px_rgba(124,58,237,0.8)]"
          >
            Начать бесплатно
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* Футер */}
      <footer className="relative z-10 border-t border-slate-800/60 py-8 text-center text-xs text-slate-600">
        AI профориентатор ·{" "}
        <Link href="/teacher/login" className="transition hover:text-slate-400">
          Для педагогов
        </Link>{" "}
        ·{" "}
        <Link href="/admin" className="transition hover:text-slate-400">
          Для администраторов
        </Link>{" "}
        ·{" "}
        <Link href="/design" className="transition hover:text-slate-400">
          Дизайн-система
        </Link>
      </footer>
    </div>
  );
}
