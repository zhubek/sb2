"use client";

import Link from "next/link";
import { useState } from "react";
import { teacherAiTemplates } from "@/lib/teacher-mock-data";

interface StudentRef {
  id: string;
  name: string;
  note: string;
}

interface Message {
  role: "user" | "ai";
  text: string;
  students?: StudentRef[];
}

// Мок-ответы AI: анализ данных школы → результат с переходом к объектам
function mockAnswer(query: string): Message {
  const q = query.toLowerCase();

  if (q.includes("инжен")) {
    return {
      role: "ai",
      text: "По результатам DeBruce я нашла 2 учеников 10-х классов с выраженным инженерным потенциалом (высокие «Техническая грамотность», «Критическое мышление» и «Работа с данными»):",
      students: [
        { id: "st4", name: "Алишер Нурланулы", note: "10 «Б» · топ-навык «Техническая грамотность» · Голланд: Реалистичный" },
        { id: "st8", name: "Ерасыл Мухтар", note: "10 «Б» · топ-навык «Работа с данными» · MBTI: ISTJ" },
      ],
    };
  }
  if (q.includes("не прошли") || q.includes("не начали")) {
    return {
      role: "ai",
      text: "В 10 «Б» диагностику не начал 1 ученик. Рекомендую напомнить о тесте DeBruce на классном часе — это первый шаг чек-листа:",
      students: [
        { id: "st5", name: "Камила Ержанова", note: "10 «Б» · 0 из 3 тестов · последняя активность 2 недели назад" },
      ],
    };
  }
  if (q.includes("характеристик")) {
    return {
      role: "ai",
      text: "Черновик характеристики (Айгерим Сатпаева, 10 «Б»):\n\nАйгерим — творческий и коммуникабельный ученик. По результатам диагностики DeBruce её сильные стороны — креативность (92), коммуникация (88) и эмпатия (85). Тип личности ENFJ («Протагонист») указывает на лидерский потенциал и умение работать с людьми. Рекомендуемое направление — медиа и коммуникации: журналистика, PR, реклама. Рекомендую поддержать интерес участием в школьной медиастудии и олимпиадах по литературе.\n\nМогу адаптировать текст для встречи с родителями или для портфолио.",
      students: [
        { id: "st1", name: "Айгерим Сатпаева", note: "Открыть карточку ученика" },
      ],
    };
  }
  if (q.includes("сравни")) {
    return {
      role: "ai",
      text: "Сравнение 10 «А» и 10 «Б»:\n\n• Прохождение тестов: 10 «А» — 25 из 28 (89%), 10 «Б» — 24 из 27 (89%). Паритет.\n• Полные профили (3/3): 10 «А» — 14, 10 «Б» — 12.\n• Ведущее направление: 10 «А» — инженерия, 10 «Б» — культура и искусство.\n• Вывод: оба класса вовлечены; в 10 «Б» стоит мотивировать 3 учеников завершить тест Голланда для комплексных отчётов.",
    };
  }
  if (q.includes("професси")) {
    return {
      role: "ai",
      text: "Топ-5 профессий по выбору учеников школы:\n\n1. Программист — 58 учеников\n2. Врач — 44\n3. Дизайнер — 39\n4. Инженер — 35\n5. Предприниматель — 31\n\nЗа последнюю четверть заметно вырос интерес к IT-направлению (+18%). Подробное распределение — в разделе «Аналитика».",
    };
  }
  return {
    role: "ai",
    text: "Я проанализировала данные вашей школы. Уточните, пожалуйста, запрос — могу найти учеников по критериям, сравнить классы, подготовить характеристику или черновик отчёта. Также отвечу на вопросы о профессиях, специальностях и вузах.",
  };
}

export default function TeacherAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Здравствуйте, Гульнара! Я AI-помощник профориентатора. У меня есть доступ к данным вашей школы: результаты тестов, активность учеников, справочник образования. Задайте вопрос свободно или выберите шаблон ниже.",
    },
  ]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, mockAnswer(text)]);
    setInput("");
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div>
        <h1 className="text-2xl font-bold">AI-помощник</h1>
        <p className="mt-1 text-slate-500">
          Анализ данных школы, поиск учеников, характеристики, отчёты
        </p>
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5">
        {messages.map((m, i) => (
          <div key={i}>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                m.role === "ai"
                  ? "bg-slate-100 text-slate-800"
                  : "ml-auto bg-teal-600 text-white"
              }`}
            >
              {m.text}
            </div>
            {/* Переход от результата AI к карточке ученика */}
            {m.students && (
              <div className="mt-2 max-w-[85%] space-y-2">
                {m.students.map((s) => (
                  <Link
                    key={s.id}
                    href={`/teacher/analytics/student/${s.id}`}
                    className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-2.5 transition hover:bg-teal-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-teal-900">
                        {s.name}
                      </p>
                      <p className="text-xs text-teal-600/70">{s.note}</p>
                    </div>
                    <span className="text-teal-400">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {teacherAiTemplates.map((t) => (
              <button
                key={t}
                onClick={() => send(t)}
                className="rounded-full border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs text-teal-700 transition hover:bg-teal-100"
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Свободный запрос: «Найди учеников, которым подходит медицина»…"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-400"
        />
        <button
          type="submit"
          className="rounded-xl bg-teal-600 px-6 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
