"use client";
import { useCopy } from "@/lib/cms/client";


import { ContentText } from "@/lib/cms/client";
import { useContent } from "@/lib/cms/client";
import Link from "next/link";
import { useState } from "react";
import defaultTeacherReplies from "@/lib/cms/teacher-replies.json";
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
const cmsDefaults_teacherAiTemplates = teacherAiTemplates;

function mockAnswer(query: string, replies: Record<string, Message>): Message {
  const q = query.toLowerCase();

  if (q.includes("инжен")) {
    return replies.engineering;
  }
  if (q.includes("не прошли") || q.includes("не начали")) {
    return replies.notStarted;
  }
  if (q.includes("характеристик")) {
    return replies.characteristic;
  }
  if (q.includes("сравни")) {
    return replies.comparison;
  }
  if (q.includes("професси")) {
    return replies.professions;
  }
  return replies.default;
}

export default function TeacherAssistantPage() {
  const pageCopy = useCopy("copy.app.teacher.panel.assistant.page");
  const teacherAiTemplates = useContent("teacher-mock-data.teacherAiTemplates", cmsDefaults_teacherAiTemplates);
  const replies = useContent("assistant.teacher-replies", defaultTeacherReplies) as Record<string, Message>;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: pageCopy("x001","Здравствуйте, Гульнара! Я AI-помощник профориентатора. У меня есть доступ к данным вашей школы: результаты тестов, активность учеников, справочник образования. Задайте вопрос свободно или выберите шаблон ниже."),
    },
  ]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, mockAnswer(text, replies)]);
    setInput("");
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div>
        <h1 className="text-2xl font-bold"><ContentText id="copy.app.teacher.panel.assistant.page.001" fallback="AI-помощник" /></h1>
        <p className="mt-1 text-slate-500">
          <ContentText id="copy.app.teacher.panel.assistant.page.002" fallback="Анализ данных школы, поиск учеников, характеристики, отчёты" /></p>
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
          placeholder={pageCopy("x002","Свободный запрос: «Найди учеников, которым подходит медицина»…")}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-400"
        />
        <button
          type="submit"
          className="rounded-xl bg-teal-600 px-6 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          <ContentText id="copy.app.teacher.panel.assistant.page.003" fallback="Отправить" /></button>
      </form>
    </div>
  );
}
