"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconAI } from "@/components/compass-marks";
import { apiSafe, backendUserId } from "@/lib/api";
import { aiTemplateQuestions, currentUser } from "@/lib/mock-data";

interface Message {
  role: "user" | "ai";
  text: string;
}

const HINT_CYCLE_MS = 3200;
const WORD_MS = 140; // скорость «стриминга» — слово каждые 140 мс

// Длинный мок-ответ (~10 секунд стриминга)
const LONG_ANSWER =
  "Отличный вопрос! Судя по результатам ваших тестов, у вас яркий креативно-коммуникативный профиль: DeBruce показал топ-навыки «Креативность», «Коммуникация» и «Эмпатия», а тип ENFJ это только подтверждает. Вам подойдут профессии, где нужно придумывать и рассказывать: PR-менеджер, журналист, бренд-стратег, продюсер медиапроектов. Рекомендую начать с направления «Журналистика и информация» и программы «Реклама и связи с общественностью» — её ведут КазНУ, ЕНУ и Туран, причём в двух из них есть гранты и общежития. Хотите, покажу эти вузы в навигаторе с уже настроенными фильтрами? А ещё могу объяснить, почему именно эти навыки так ценятся в медиа-индустрии.";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hintIdx, setHintIdx] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const chatIdRef = useRef<number | null>(null);

  const empty = messages.length === 0;
  const busy = thinking || streaming !== null;

  // Ротация подсказок, пока чат пуст
  useEffect(() => {
    if (!empty) return;
    const t = setInterval(
      () => setHintIdx((i) => (i + 1) % aiTemplateQuestions.length),
      HINT_CYCLE_MS
    );
    return () => clearInterval(t);
  }, [empty]);

  // Автопрокрутка ленты при стриминге
  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming, thinking]);

  // Сообщение уходит в бекенд (чат создаётся при первом сообщении),
  // ответ ассистента приходит из API; при недоступном API — мок-ответ
  async function fetchReply(text: string): Promise<string> {
    const uid = await backendUserId();
    if (!uid) return LONG_ANSWER;
    if (!chatIdRef.current) {
      const chat = await apiSafe<{ id: number }>("/chats", {
        method: "POST",
        body: JSON.stringify({
          userId: uid,
          chatType: "MAIN_STUDENT",
          name: text.slice(0, 60),
        }),
      });
      chatIdRef.current = chat?.id ?? null;
    }
    if (!chatIdRef.current) return LONG_ANSWER;
    const res = await apiSafe<{ assistantMessage: { text: string } }>(
      `/chats/${chatIdRef.current}/messages`,
      { method: "POST", body: JSON.stringify({ text }) }
    );
    return res?.assistantMessage.text ?? LONG_ANSWER;
  }

  function send(text: string) {
    if (!text.trim() || busy) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);

    // «Думает» (запрос к API) → слово за словом, как SSE
    const replyPromise = fetchReply(text);
    setTimeout(async () => {
      const answer = await replyPromise;
      setThinking(false);
      const words = answer.split(" ");
      let i = 0;
      setStreaming("");
      const iv = setInterval(() => {
        i++;
        setStreaming(words.slice(0, i).join(" "));
        if (i >= words.length) {
          clearInterval(iv);
          setMessages((m) => [...m, { role: "ai", text: answer }]);
          setStreaming(null);
        }
      }, WORD_MS);
    }, 1400);
  }

  return (
    <div className="relative mx-auto h-[calc(100vh-7.5rem)] max-w-2xl">
      {/* Лента сообщений */}
      <div
        ref={feedRef}
        className={`h-full space-y-3 overflow-y-auto pt-2 pb-28 transition-opacity duration-500 ${
          empty ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "ai"
                ? "bg-white text-stone-800 shadow-sm"
                : "ml-auto bg-violet-500 text-white"
            }`}
          >
            {m.text}
          </div>
        ))}

        {/* ИИ думает / отвечает словами (звезда-компас крутится всё это время) */}
        {busy && (
          <div className="flex items-start gap-2.5">
            <IconAI className="mt-0.5 h-8 w-8 shrink-0" />
            <div className="max-w-[80%] rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-stone-800 shadow-sm">
              {thinking ? (
                <span className="text-stone-400">думает…</span>
              ) : (
                <>
                  {streaming}
                  <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-stone-500 align-middle" />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Группа: приветствие + подсказка + поле ввода.
          Пустой чат — по центру экрана; после первого сообщения — уезжает вниз. */}
      <div
        className="absolute inset-x-0 transition-all duration-700 ease-in-out"
        style={{
          top: empty ? "42%" : "100%",
          transform: empty ? "translateY(-50%)" : "translateY(-100%)",
        }}
      >
        {/* Приветствие и ротация подсказок — только в пустом состоянии */}
        <div
          className={`text-center transition-all duration-500 ${
            empty
              ? "mb-8 opacity-100"
              : "pointer-events-none mb-0 h-0 overflow-hidden opacity-0"
          }`}
        >
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Чем помочь, {currentUser.firstName}?
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Я знаю ваши результаты тестов и весь справочник вузов
          </p>

          {/* Подсказка с fade in / fade out; клик — отправить */}
          <div className="mt-7 flex h-9 items-center justify-center">
            <button
              key={hintIdx}
              onClick={() => send(aiTemplateQuestions[hintIdx])}
              style={{ animation: `hint-cycle ${HINT_CYCLE_MS}ms ease-in-out` }}
              className="rounded-full border border-violet-200 bg-violet-100 px-4 py-2 text-sm text-violet-700 transition hover:bg-violet-200"
            >
              {aiTemplateQuestions[hintIdx]}
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2 bg-[#fcfbfd] pb-1"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Задайте вопрос…"
            className="flex-1 rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-sm shadow-sm outline-none transition focus:border-violet-400"
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-2xl bg-violet-500 px-5 text-white transition hover:bg-violet-600"
          >
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}
