"use client";
import { useCopy, useContent, ContentText } from "@/lib/cms/client";
import { useState, useEffect } from "react";
import { module1Quiz as cmsDefaults_module1Quiz } from "@/lib/course-module1";
export default function FinalCheck({ onPassed, previewQuestion }: { onPassed: () => void; previewQuestion?:number }) {
  const pageCopy = useCopy("copy.app.teacher.panel.course.module1.page");
  const module1Quiz = useContent("course-module1.module1Quiz", cmsDefaults_module1Quiz);
  // Ответы: single — индекс, multi — выбранные индексы (замораживаются после проверки)
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [checkedMulti, setCheckedMulti] = useState<Record<string, number[]>>({});
  const [openTexts, setOpenTexts] = useState<Record<string,string>>({});
  const [sentOpen, setSentOpen] = useState<Record<string,boolean>>({});
  const [resetCount, setResetCount] = useState(0);

  const scored = module1Quiz.filter((q) => q.type !== "open");
  const answered = scored.filter((q) => answers[q.id] !== undefined);
  const right = scored.filter((q) => {
    const a = answers[q.id];
    if (a === undefined) return false;
    if (q.type === "single")
      return q.options![a as number].correct === true;
    const sel = a as number[];
    return q.options!.every((o, i) => Boolean(o.correct) === sel.includes(i));
  });
  const allDone = answered.length === scored.length && module1Quiz.filter(q=>q.type==="open").every(q=>sentOpen[q.id]);
  const pct = scored.length ? Math.round((right.length / scored.length) * 100) : 100;
  const passed = allDone && pct >= 70;

  useEffect(() => {
    if (passed) onPassed();
  }, [passed, onPassed]);



  function reset() {
    setAnswers({});
    setCheckedMulti({});
    setOpenTexts({});
    setSentOpen({});
    setResetCount((c) => c + 1);
  }

  return (
    <div key={resetCount} className="space-y-8">
      <p className="text-[15px] leading-relaxed text-slate-600">
        {scored.length} <ContentText id="copy.app.teacher.panel.course.module1.page.001" fallback=" вопросов по всем шести урокам: с одним и несколькими ответами, включая ситуационные. На каждый вопрос — одна попытка. Для прохождения нужно набрать 70%. Открытый вопрос — без балла: вы излагаете профессиональное мнение и сверяетесь с образцом." /></p>

      {module1Quiz.map((q, qi) => {
        if(previewQuestion!==undefined&&qi!==previewQuestion)return null;
        const openText=openTexts[q.id]||"",openSent=sentOpen[q.id],words=openText.trim()?openText.trim().split(/\s+/).length:0;
        const a = answers[q.id];
        const isAnswered = a !== undefined;

        return (
          <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold">
                <ContentText id="copy.app.teacher.panel.course.module1.page.002" fallback="Вопрос " />{qi + 1}.{" "}
                <span className="font-medium">{q.q}</span>
              </p>
              <span className="shrink-0 rounded border border-slate-200 px-2 py-0.5 font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                {q.chip}
              </span>
            </div>

            {/* Один ответ */}
            {q.type === "single" && (
              <div className="mt-4 space-y-2">
                {q.options!.map((o, i) => {
                  const chosen = a === i;
                  const showState = isAnswered && (chosen || o.correct);
                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => setAnswers((s) => ({ ...s, [q.id]: i }))}
                      className={`block w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                        showState
                          ? o.correct
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-rose-300 bg-rose-50"
                          : isAnswered
                            ? "border-slate-100 text-slate-400"
                            : "border-slate-200 hover:border-teal-400"
                      }`}
                    >
                      {o.t}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Несколько ответов */}
            {q.type === "multi" && (
              <div className="mt-4 space-y-2">
                {q.options!.map((o, i) => {
                  const sel = (
                    isAnswered ? (a as number[]) : (checkedMulti[q.id] ?? [])
                  ).includes(i);
                  const state = !isAnswered
                    ? ""
                    : o.correct && sel
                      ? "border-emerald-300 bg-emerald-50"
                      : o.correct && !sel
                        ? "border-amber-300 bg-amber-50"
                        : !o.correct && sel
                          ? "border-rose-300 bg-rose-50"
                          : "border-slate-100 text-slate-400";
                  return (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition ${
                        state || "border-slate-200 hover:border-teal-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={isAnswered}
                        checked={sel}
                        onChange={(e) =>
                          setCheckedMulti((s) => {
                            const cur = s[q.id] ?? [];
                            return {
                              ...s,
                              [q.id]: e.target.checked
                                ? [...cur, i]
                                : cur.filter((x) => x !== i),
                            };
                          })
                        }
                        className="accent-teal-600"
                      />
                      {o.t}
                    </label>
                  );
                })}
                {!isAnswered && (
                  <button
                    onClick={() =>
                      setAnswers((s) => ({
                        ...s,
                        [q.id]: checkedMulti[q.id] ?? [],
                      }))
                    }
                    className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                  >
                    <ContentText id="copy.app.teacher.panel.course.module1.page.003" fallback="Проверить" /></button>
                )}
              </div>
            )}

            {/* Открытый вопрос */}
            {q.type === "open" && (
              <div className="mt-4">
                {!openSent ? (
                  <>
                    <textarea
                      aria-label={`Ответ на вопрос ${qi+1}`}
                      maxLength={5000}
                      value={openText}
                      onChange={(e) => setOpenTexts(s=>({...s,[q.id]:e.target.value}))}
                      rows={4}
                      placeholder={pageCopy("x001","Ваше профессиональное мнение…")}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-400"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`font-mono text-xs ${words >= 25 ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {words} <ContentText id="copy.app.teacher.panel.course.module1.page.004" fallback=" слов" /></span>
                      <button
                        disabled={words < 8}
                        onClick={() => setSentOpen(s=>({...s,[q.id]:true}))}
                        className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-40"
                      >
                        <ContentText id="copy.app.teacher.panel.course.module1.page.005" fallback="Отправить и открыть образец" /></button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-r-xl border-l-4 border-emerald-400 bg-emerald-50/60 px-5 py-4">
                    <h4 className="font-mono text-xs font-medium tracking-widest text-slate-500 uppercase">
                      <ContentText id="copy.app.teacher.panel.course.module1.page.006" fallback="Образец рассуждения" /></h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {q.model}
                    </p>
                    <p className="mt-3 text-xs text-slate-400 italic">
                      <ContentText id="copy.app.teacher.panel.course.module1.page.007" fallback="Открытый вопрос без балла — единственно верной формулировки здесь нет." /></p>
                  </div>
                )}
              </div>
            )}

            {/* Обратная связь */}
            {isAnswered && q.type !== "open" && (
              <p
                className={`mt-3 rounded-r-xl border-l-4 px-4 py-2.5 text-sm ${
                  (q.type === "single" &&
                    q.options![a as number].correct) ||
                  (q.type === "multi" &&
                    q.options!.every(
                      (o, i) =>
                        Boolean(o.correct) === (a as number[]).includes(i)
                    ))
                    ? "border-emerald-400 bg-emerald-50/60 text-emerald-900"
                    : "border-rose-400 bg-rose-50/60 text-rose-900"
                }`}
              >
                {(q.type === "single" &&
                  q.options![a as number].correct) ||
                (q.type === "multi" &&
                  q.options!.every(
                    (o, i) => Boolean(o.correct) === (a as number[]).includes(i)
                  ))
                  ? q.ok
                  : q.no}
              </p>
            )}
          </div>
        );
      })}

      {/* Результат */}
      {allDone && (
        <div className="rounded-xl border-2 border-slate-800 bg-white p-6 text-center">
          <p className="font-display text-2xl font-semibold">
            {right.length} <ContentText id="copy.app.teacher.panel.course.module1.page.008" fallback=" из " />{scored.length} · {pct}%
          </p>
          <p className="mt-1 font-mono text-xs text-slate-400">
            <ContentText id="copy.app.teacher.panel.course.module1.page.009" fallback="порог прохождения — 70% · открытый вопрос — без балла" /></p>
          {passed ? (
            <p className="mt-3 font-semibold text-emerald-700">
              <ContentText id="copy.app.teacher.panel.course.module1.page.010" fallback="✓ Проверка пройдена — модуль завершён" /></p>
          ) : (
            <>
              <p className="mt-3 font-semibold text-rose-700">
                <ContentText id="copy.app.teacher.panel.course.module1.page.011" fallback="Порог не набран — пройдите проверку заново" /></p>
              <button
                onClick={reset}
                className="mt-4 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                <ContentText id="copy.app.teacher.panel.course.module1.page.012" fallback="Пройти заново" /></button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
