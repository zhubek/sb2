"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompassArt, PathArt, RobotArt, UniversityArt } from "@/components/brand-art";

const slides = [
  {
    illu: (
      <CompassArt className="mx-auto h-40 w-40" />
    ),
    title: "Добро пожаловать!",
    text: "«AI профориентатор» поможет узнать ваши сильные стороны, подобрать профессию и найти университет. Всё — за несколько простых шагов.",
  },
  {
    illu: (
      <UniversityArt className="mx-auto h-44 w-56" />
    ),
    title: "Три раздела платформы",
    text: "«Тесты» — диагностика и результаты. «ВУЗы» — навигатор по университетам Казахстана и мира. «Кабинет» — ваш прогресс, отчёты и портфолио.",
  },
  {
    illu: (
      <RobotArt className="mx-auto h-44 w-56" />
    ),
    title: "ИИ-ассистент всегда рядом",
    text: "На любой странице внизу справа — кнопка ассистента. Он объяснит результаты тестов, подскажет следующий шаг и ответит на вопросы о профессиях.",
  },
  {
    illu: (
      <PathArt className="mx-auto h-44 w-56" />
    ),
    title: "С чего начать",
    text: "Первый шаг в вашем чек-листе — тест DeBruce (≈15 минут). Уже после него вы получите рейтинг 10 навыков и рекомендации по отраслям и программам.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const last = step === slides.length - 1;

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          {slide.illu}
          <h1 className="font-display mt-5 text-xl font-semibold tracking-tight">
            {slide.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {slide.text}
          </p>

          <div className="mt-8 flex items-center justify-center gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-violet-600" : "w-1.5 bg-stone-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              last ? router.push("/dashboard") : setStep(step + 1)
            }
            className="mt-8 w-full rounded-2xl bg-violet-500 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
          >
            {last ? "Перейти в личный кабинет" : "Далее"}
          </button>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-sm text-stone-400 hover:text-stone-600"
        >
          Пропустить
        </button>
      </div>
    </div>
  );
}
