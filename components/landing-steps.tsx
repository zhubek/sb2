"use client";

import { Bot, FileCheck2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconAI, IconDone, IconRobot } from "@/components/compass-marks";

// Интерактивный блок «3 шага»: слева — карточки с автопрокруткой,
// справа — «устройство» с живыми мокапами, 3D-наклон за курсором.

// ── Мокап 1: три теста проходятся по очереди ────────────────────────────────
function TestsMockup({ isActive }: { isActive: boolean }) {
  const [stage, setStage] = useState(0); // 0..3 — сколько тестов завершено

  useEffect(() => {
    if (!isActive) {
      setStage(0);
      return;
    }
    setStage(0);
    const timers = [
      setTimeout(() => setStage(1), 1200),
      setTimeout(() => setStage(2), 2400),
      setTimeout(() => setStage(3), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  const tests = [
    { name: "DeBruce", tag: "10 навыков" },
    { name: "MBTI", tag: "тип личности" },
    { name: "Голланд", tag: "интересы" },
  ];

  return (
    <div className="w-full space-y-3">
      {tests.map((t, i) => {
        const done = stage > i;
        const running = stage === i;
        return (
          <div
            key={t.name}
            className="rounded-2xl border border-stone-100 bg-stone-50 p-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-700">
                {t.name}
                <span className="ml-2 text-xs font-normal text-stone-400">
                  {t.tag}
                </span>
              </span>
              {done ? (
                <span className="animate-[lp-pop_0.4s_ease-out] font-mono text-xs font-bold text-teal-600">
                  ✓ пройден
                </span>
              ) : running ? (
                <span className="animate-pulse font-mono text-xs text-violet-500">
                  идёт тест…
                </span>
              ) : (
                <span className="font-mono text-xs text-stone-400">ожидает</span>
              )}
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-2xl bg-violet-500 transition-all duration-1000 ease-out"
                style={{ width: done ? "100%" : running ? "65%" : "0%" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Мокап 2: ИИ собирает комплексный отчёт ──────────────────────────────────
function ReportMockup({ isActive }: { isActive: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setReady(false);
      return;
    }
    setReady(false);
    const t = setTimeout(() => setReady(true), 1600);
    return () => clearTimeout(t);
  }, [isActive]);

  const skills = [
    { name: "Креативность", v: 92 },
    { name: "Коммуникация", v: 88 },
    { name: "Эмпатия", v: 85 },
  ];

  return (
    <div className="relative w-full">
      {/* Формирование — оверлей по центру, не сдвигает карточку вниз */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-2 font-mono text-xs text-violet-500 transition-opacity duration-300 ${
          ready ? "opacity-0" : "animate-pulse opacity-100"
        }`}
      >
        <Sparkles size={13} />
        ИИ анализирует результаты трёх тестов…
      </div>

      {/* Готовый отчёт */}
      <div
        className={`space-y-3 transition-all duration-700 ease-out ${
          ready ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {/* Запрос ученика */}
        <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3">
          <p className="font-mono text-xs text-stone-600">
            <span className="text-violet-600">Ученик:</span> собери мой полный
            портрет по трём тестам
          </p>
        </div>

        <div className="rounded-2xl bg-violet-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-violet-800">
              <FileCheck2 size={14} className="text-violet-600" />
              Комплексный отчёт готов
            </span>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-violet-700">
              ENFJ · Артистичный
            </span>
          </div>
          <div className="space-y-2">
            {skills.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-28 text-xs text-violet-800/60">{s.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-violet-100">
                  <div
                    className="h-full rounded-2xl bg-violet-500 transition-all duration-1000 ease-out"
                    style={{
                      width: ready ? `${s.v}%` : "0%",
                      transitionDelay: `${i * 180}ms`,
                    }}
                  />
                </div>
                <span className="w-7 text-right font-mono text-[10px] text-violet-800/50">
                  {s.v}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["PR-менеджер", "Журналист", "Дизайнер"].map((p) => (
              <span
                key={p}
                className="rounded-full bg-white px-2 py-0.5 text-[10px] text-stone-600"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Мини-статистика под отчётом */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3">
            <p className="text-[10px] tracking-wider text-stone-400 uppercase">
              Подходящих программ
            </p>
            <p className="font-display mt-0.5 text-lg text-stone-800">
              12
            </p>
          </div>
          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3">
            <p className="text-[10px] tracking-wider text-stone-400 uppercase">
              Вузов с грантами
            </p>
            <p className="font-display mt-0.5 text-lg text-stone-800">
              5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Мокап 3: чат с ИИ ───────────────────────────────────────────────────────
function ChatMockup({ isActive }: { isActive: boolean }) {
  const question = "Какие профессии мне подходят?";
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState(0); // 0: печатает, 1: думает, 2: ответ

  useEffect(() => {
    if (!isActive) {
      setTyped("");
      setPhase(0);
      return;
    }
    setTyped("");
    setPhase(0);
    let i = 0;
    const typing = setInterval(() => {
      i++;
      setTyped(question.slice(0, i));
      if (i >= question.length) {
        clearInterval(typing);
        setPhase(1);
        setTimeout(() => setPhase(2), 1300);
      }
    }, 45);
    return () => clearInterval(typing);
  }, [isActive]);

  return (
    <div className="w-full space-y-3">
      {/* Вопрос ученика */}
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-violet-500 px-3.5 py-2.5 text-sm text-white">
        {typed}
        <span
          className={`ml-0.5 inline-block h-3.5 w-1 bg-white/80 align-middle ${
            phase === 0 ? "animate-pulse" : "opacity-0"
          }`}
        />
      </div>

      {/* ИИ думает */}
      <div
        className={`flex items-center gap-2 font-mono text-xs text-violet-500 transition-opacity duration-300 ${
          phase === 1 ? "animate-pulse opacity-100" : "opacity-0"
        }`}
      >
        <Bot size={13} />
        ассистент печатает…
      </div>

      {/* Ответ ИИ */}
      <div
        className={`transition-all duration-500 ease-out ${
          phase === 2 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-stone-100 bg-stone-50 px-3.5 py-3 text-sm leading-relaxed text-stone-700">
          Судя по вашим топ-навыкам — креативность и коммуникация — вам подходят
          медиа и коммуникации. Начните с «Реклама и связи с общественностью»:
          её ведут 3 вуза с грантами.
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Показать вузы", "Почему именно PR?", "А что ещё?"].map((c) => (
            <span
              key={c}
              className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Основной блок ───────────────────────────────────────────────────────────
export default function LandingSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 5, y: -15 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isTracking, setIsTracking] = useState(false);

  const steps = [
    {
      id: "tests",
      title: "Пройди три теста",
      desc: "DeBruce, MBTI и Голланд — около 30 минут суммарно. Уже после первого теста открываются рекомендации.",
      icon: <IconDone className="h-10 w-10" />,
      Mockup: TestsMockup,
    },
    {
      id: "report",
      title: "Получи комплексный отчёт",
      desc: "ИИ сводит результаты всех трёх тестов в один портрет: сильные стороны, тип личности, подходящие профессии и программы.",
      icon: <IconAI className="h-10 w-10" />,
      Mockup: ReportMockup,
    },
    {
      id: "chat",
      title: "Спроси AI о чём угодно",
      desc: "Ассистент знает твои результаты и справочник вузов. Любой вопрос — от «почему мне это подходит» до «где учиться».",
      icon: <IconRobot className="h-10 w-10" />,
      Mockup: ChatMockup,
    },
  ];

  // Автопрокрутка шагов
  useEffect(() => {
    if (isHovered || isTracking) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, isTracking, steps.length]);

  // 3D-наклон за курсором
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 15;
    setRotation({ x: rotateX, y: rotateY });
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    setIsTracking(true);
  }

  function handleMouseLeave() {
    setRotation({ x: 5, y: -15 });
    setGlarePos({ x: 50, y: 50 });
    setIsTracking(false);
  }

  return (
    <section id="how" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Заголовок секции */}
        <div className="mb-16 md:text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-xs font-semibold tracking-wider text-violet-700 uppercase">
            <span className="h-1.5 w-1.5 rounded-2xl bg-violet-500" />
            Твоё нечестное преимущество
          </span>
          <h2 className="font-display mt-4 mb-4 text-3xl text-stone-800 md:text-5xl">
            Не гадай. <span className="text-violet-600">Узнай.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-stone-600">
            Большинство выбирает профессию наугад. Платформа выстраивает путь из
            трёх шагов — от диагностики до конкретных вузов.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Слева: шаги */}
          <div
            className="space-y-4 lg:col-span-5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full rounded-3xl border p-6 text-left transition-all duration-300 ${
                    isActive
                      ? "border-violet-100 bg-violet-50"
                      : "border-stone-100 bg-white hover:border-stone-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 shrink-0 transition-opacity ${
                        isActive ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <h3
                        className={`font-display mb-2 text-lg transition-colors ${
                          isActive ? "text-violet-800" : "text-stone-700"
                        }`}
                      >
                        <span className="mr-2 font-mono text-sm font-normal text-stone-400">
                          0{idx + 1}
                        </span>
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed transition-colors ${
                          isActive ? "text-violet-800/70" : "text-stone-500"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  {isActive && !isHovered && !isTracking && (
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-violet-100">
                      <div className="h-full bg-violet-500 animate-[lp-progress_5s_linear_infinite]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Справа: «устройство» с мокапами */}
          <div className="relative flex h-[430px] items-center justify-center lg:col-span-7">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-violet-100/70 to-orange-100/70 blur-3xl" />

            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`relative w-full max-w-lg transform-gpu ${
                isTracking
                  ? "transition-transform duration-100 ease-out"
                  : "transition-all duration-700 ease-out"
              }`}
              style={{
                transform: `perspective(1000px) rotateY(${rotation.y}deg) rotateX(${rotation.x}deg) translateZ(50px) ${isTracking ? "scale(1.02)" : "scale(1)"}`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="relative overflow-hidden rounded-3xl border border-stone-100 bg-white p-6 shadow-[0_24px_60px_rgba(38,36,89,0.12)]">
                {/* Шапка «браузера» */}
                <div className="mb-6 flex items-center gap-2 border-b border-stone-100 pb-4">
                  <div className="h-3 w-3 rounded-full bg-stone-200" />
                  <div className="h-3 w-3 rounded-full bg-stone-200" />
                  <div className="h-3 w-3 rounded-full bg-stone-200" />
                  <div className="ml-4 font-mono text-xs tracking-widest text-stone-400 uppercase">
                    профориентатор
                  </div>
                </div>

                {/* Контент шага */}
                <div className="relative flex min-h-[250px] w-full items-center">
                  {steps.map((step, idx) => {
                    const isActive = activeStep === idx;
                    const isPast = idx < activeStep;
                    const { Mockup } = step;
                    return (
                      <div
                        key={step.id}
                        className={`absolute inset-0 flex items-center transition-all duration-500 ease-in-out ${
                          isActive
                            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                            : `pointer-events-none opacity-0 ${
                                isPast
                                  ? "-translate-y-8 scale-95"
                                  : "translate-y-8 scale-105"
                              }`
                        }`}
                      >
                        <Mockup isActive={isActive} />
                      </div>
                    );
                  })}
                </div>

                {/* Блик за курсором */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(90,95,232,0.08) 0%, transparent 60%)`,
                    opacity: isTracking ? 1 : 0,
                  }}
                />
              </div>

              {/* Декоративные пастельные пятна */}
              <div
                className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-orange-100 blur-2xl"
                style={{ transform: "translateZ(-20px)" }}
              />
              <div
                className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-violet-100 blur-2xl"
                style={{ transform: "translateZ(-40px)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
