import type { TestAnswer, TestContent, TestQuestion } from "./types";

// String questions remain readable in existing drafts and saved attempts.
export function questionOf(
  question: string | TestQuestion,
  id = "question",
): TestQuestion {
  return typeof question === "string"
    ? { id, text: question, type: "likert" }
    : question;
}
export const questionTypes = {
  likert: "Шкала согласия",
  single: "Один вариант",
  multiple: "Несколько вариантов",
  text: "Текстовый ответ",
};
export function validAnswer(
  question: string | TestQuestion,
  answer: unknown,
  scale: TestContent["scale"],
): answer is TestAnswer {
  const q = questionOf(question);
  if (q.type === "likert")
    return typeof answer === "number" && scale.some((s) => s.value === answer);
  if (q.type === "text")
    return (
      typeof answer === "string" && !!answer.trim() && answer.length <= 5000
    );
  if (q.type === "single")
    return (
      typeof answer === "string" && !!q.options?.some((o) => o.id === answer)
    );
  return (
    Array.isArray(answer) &&
    answer.length > 0 &&
    new Set(answer).size === answer.length &&
    answer.every(
      (a) => typeof a === "string" && q.options?.some((o) => o.id === a),
    )
  );
}
export function answerLabel(
  question: string | TestQuestion,
  answer: TestAnswer,
  scale: TestContent["scale"],
): string {
  const q = questionOf(question);
  if (q.type === "likert")
    return scale.find((s) => s.value === answer)?.label ?? String(answer);
  if (q.type === "text") return String(answer);
  return (Array.isArray(answer) ? answer : [answer])
    .map((a) => q.options?.find((o) => o.id === a)?.label ?? String(a))
    .join("; ");
}
