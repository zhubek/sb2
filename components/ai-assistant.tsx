"use client";

import { Bot, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconAI } from "@/components/compass-marks";
import { aiMockReplies, aiTemplateQuestions } from "@/lib/mock-data";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AiAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Привет, Айгерим! Я ваш ИИ-ассистент по профориентации. Помогу разобраться в результатах тестов, расскажу о профессиях и подскажу следующий шаг. Кстати, вам остался всего один тест — Голланда — до комплексного отчёта!",
    },
  ]);

  function send(text: string) {
    if (!text.trim() || thinking) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: aiMockReplies.default }]);
      setThinking(false);
    }, 1600);
  }

  // На странице «AI чат» плавающий виджет не нужен
  if (pathname.startsWith("/chat")) return null;

  return (
    <>
      {/* Плавающая кнопка — доступна на каждой странице */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="ИИ-ассистент"
        className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-lg shadow-stone-900/25 transition hover:scale-105 hover:bg-violet-600"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed right-5 bottom-24 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
          <div className="bg-violet-50 px-4 py-3">
            <p className="font-display text-sm text-violet-800">ИИ-ассистент</p>
            <p className="text-xs text-violet-800/60">
              Помогу с тестами, профессиями и выбором ВУЗа
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "ai"
                    ? "bg-stone-100 text-stone-800"
                    : "ml-auto bg-violet-500 text-white"
                }`}
              >
                {m.text}
              </div>
            ))}

            {/* ИИ думает и отвечает */}
            {thinking && (
              <div className="flex items-center gap-1.5 rounded-2xl bg-stone-100 py-1 pr-3.5 pl-1.5">
                <IconAI className="h-8 w-8" />
                <span className="text-xs text-stone-400">думает…</span>
              </div>
            )}

            {/* Шаблоны вопросов для быстрого старта */}
            {messages.length === 1 && !thinking && (
              <div className="flex flex-wrap gap-2 pt-1">
                {aiTemplateQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs text-violet-700 transition hover:bg-violet-100"
                  >
                    {q}
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
            className="flex gap-2 border-t border-stone-100 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Задайте вопрос…"
              className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-xl bg-violet-500 px-4 text-white transition hover:bg-violet-600"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
