import { questionOf } from "./questions";
import type { ContentDocument, Json, TestContent } from "./types";
export function validateDocument(
  document: ContentDocument,
  value: Json,
): string[] {
  const errors: string[] = [];
  function error(s: string) {
    if (errors.length < 12) errors.push(s);
  }
  function walk(v: Json, reference: Json, path: string, depth = 0) {
    if (depth > 24) {
      error(`${path}: слишком большая вложенность`);
      return;
    }
    if (typeof v === "string") {
      if (v.length > 150000) error(`${path}: слишком длинный текст`);
      if (/^\s*(javascript|data|vbscript):/i.test(v))
        error(
          `${path}: используйте безопасную ссылку https:// или путь страницы`,
        );
    }
    if (reference === null) {
      if (v !== null && typeof v !== "string" && typeof v !== "number")
        error(`${path}: ожидается текст, число или пустое значение`);
      return;
    }
    if (Array.isArray(reference)) {
      if (!Array.isArray(v)) {
        error(`${path}: ожидается список`);
        return;
      }
      if (
        reference.length &&
        !v.length &&
        !(document.id.startsWith("program.") && path.endsWith(" / exams")) &&
        !(document.id.startsWith("institution.") && path.endsWith(" / inds"))
      )
        error(`${path}: оставьте хотя бы один элемент`);
      if (v.length > 15000) error(`${path}: слишком много элементов`);
      const ids = new Set<string>();
      v.forEach((item, i) => {
        let sample = reference[i] ?? reference[0];
        if (item && typeof item === "object" && !Array.isArray(item)) {
          // A program classification code can occur at multiple institutions.
          // Only an explicit record ID identifies an item within this list.
          const key = item.id;
          if (key !== undefined) {
            if (ids.has(String(key)))
              error(`${path}: повторяется идентификатор ${key}`);
            ids.add(String(key));
          }
          const sameVariant = (r: Json | undefined) =>
            !!r && typeof r === "object" && !Array.isArray(r) &&
            ((item.kind !== undefined && r.kind === item.kind) ||
              (item.type !== undefined && r.type === item.type));
          // Repeated list/note blocks can have different optional fields. Keep
          // the matching positional schema before falling back to another block.
          const byId = key === undefined ? undefined : reference.find(r =>
            r && typeof r === "object" && !Array.isArray(r) && r.id === key);
          sample = byId ?? (sameVariant(sample) ? sample : reference.find(sameVariant)) ?? sample;
        }
        if (document.kind === "test" && path.endsWith(" / questions"))
          sample = item;
        if (sample !== undefined)
          walk(item, sample, `${path} / ${i + 1}`, depth + 1);
      });
      return;
    }
    if (typeof reference === "object") {
      if (!v || typeof v !== "object" || Array.isArray(v)) {
        error(`${path}: ожидается объект`);
        return;
      }
      for (const key of Object.keys(v))
        if (["__proto__", "constructor", "prototype"].includes(key))
          error(`${path}: недопустимое поле`);
      for (const [key, sample] of Object.entries(reference)) {
        if (!(key in v)) error(`${path}: отсутствует поле ${key}`);
        else walk(v[key], sample, `${path} / ${key}`, depth + 1);
      }
      // Validate new optional properties too, including unsafe URL schemes.
      for (const [key, extra] of Object.entries(v))
        if (!(key in reference))
          walk(extra, extra, `${path} / ${key}`, depth + 1);
      return;
    }
    if (typeof v !== typeof reference) error(`${path}: неверный тип значения`);
    if (typeof v === "number" && (!Number.isFinite(v) || v < 0))
      error(`${path}: укажите неотрицательное число`);
  }
  walk(value, document.value, document.title);
  if (errors.length) return errors;
  if (document.kind === "test") {
    const t = value as unknown as TestContent;
    if (!t || !Array.isArray(t.sections) || !Array.isArray(t.scale))
      return [...errors, "Некорректная структура теста"];
    for (const field of ["name", "method", "tagline", "duration"] as const)
      if (typeof t[field] !== "string" || !t[field].trim())
        error(`Заполните поле «${field}»`);
    if (t.slug !== (document.value as unknown as TestContent).slug)
      error("Адрес существующего теста менять нельзя");
    if (!t.sections.length || t.sections.length > 50)
      error("В тесте должно быть от 1 до 50 разделов");
    const questionIds = new Set<string>();
    t.sections.forEach((s, i) => {
      if (typeof s.title !== "string" || !s.title.trim())
        error(`Укажите название раздела ${i + 1}`);
      if (!Array.isArray(s.questions) || !s.questions.length) {
        error(`В разделе ${i + 1} нет вопросов`);
        return;
      }
      s.questions.forEach((raw, j) => {
        if (
          !raw ||
          (typeof raw !== "string" &&
            (typeof raw !== "object" || Array.isArray(raw)))
        ) {
          error(`Некорректный вопрос ${i + 1}.${j + 1}`);
          return;
        }
        const q = questionOf(raw, `${s.id}-${j}`);
        if (typeof q.id !== "string" || !q.id || questionIds.has(q.id))
          error("Идентификаторы вопросов должны быть уникальными");
        questionIds.add(q.id);
        if (typeof q.text !== "string" || !q.text.trim())
          error(`Заполните вопрос ${i + 1}.${j + 1}`);
        if (!["likert", "single", "multiple", "text"].includes(q.type))
          error("Выберите тип вопроса");
        if (q.type === "single" || q.type === "multiple") {
          if (
            !Array.isArray(q.options) ||
            q.options.length < 2 ||
            q.options.length > 20
          ) {
            error(`Вопрос ${i + 1}.${j + 1}: нужно от 2 до 20 вариантов`);
            return;
          }
          const ids = new Set<string>();
          q.options.forEach((o) => {
            if (
              !o ||
              typeof o.id !== "string" ||
              !o.id ||
              ids.has(o.id) ||
              typeof o.label !== "string" ||
              !o.label.trim()
            )
              error(
                `Вопрос ${i + 1}.${j + 1}: заполните уникальные варианты ответа`,
              );
            if (o) ids.add(o.id);
          });
        }
      });
    });
    if (t.sections.reduce((n, s) => n + (s.questions?.length || 0), 0) > 500)
      error("В одном тесте допускается до 500 вопросов");
    if (
      t.scale.length !== 5 ||
      t.scale.some((s, i) => s.value !== i + 1 || !s.label?.trim())
    )
      error("Заполните пять подписей шкалы от 1 до 5");
  }
  if (document.id.startsWith("program.")) {
    const p = value as Record<string, Json>,
      base = document.value as Record<string, Json>;
    for (const key of ["institutionId", "code"])
      if (p[key] !== base[key])
        error(
          "Заведение и код программы связаны с навигатором и не могут меняться",
        );
    if (typeof p.name !== "string" || !p.name.trim())
      error("Укажите название образовательной программы");
    for (const key of ["price", "threshold", "duration"])
      if (
        p[key] !== null &&
        (typeof p[key] !== "number" ||
          !Number.isInteger(p[key]) ||
          Number(p[key]) < 0)
      )
        error(
          "Стоимость, балл и срок должны быть неотрицательными целыми числами",
        );
    if (p.threshold !== null && Number(p.threshold) > 140)
      error("Проходной балл: от 0 до 140");
    if (p.duration !== null && Number(p.duration) > 12)
      error("Срок обучения: до 12 лет");
    if (
      !Array.isArray(p.exams) ||
      p.exams.some((e) => typeof e !== "string" || !e.trim())
    )
      error("Заполните названия экзаменов или удалите пустые строки");
  }
  if (
    document.id.startsWith("institution.") ||
    document.id.startsWith("gop.") ||
    document.id.startsWith("college.")
  ) {
    const v = value as Record<string, Json>,
      base = document.value as Record<string, Json>;
    for (const k of ["i", "code", "kind"])
      if (k in base && v[k] !== base[k])
        error(`Поле ${k} связано с другими записями и не может меняться`);
    if (typeof v.name !== "string" || !v.name.trim()) error("Укажите название");
  }
  if (document.id === "course-module1.module1Quiz" && Array.isArray(value)) {
    value.forEach((q, i) => {
      if (!q || typeof q !== "object" || Array.isArray(q)) return;
      if (!["single", "multi", "open"].includes(String(q.type)))
        error(`Вопрос ${i + 1}: выберите допустимый тип`);
      if (typeof q.q !== "string" || !q.q.trim())
        error(`Заполните вопрос ${i + 1}`);
      if (q.type !== "open") {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          error(`Вопрос ${i + 1}: добавьте хотя бы 2 ответа`);
          return;
        }
        const correct = q.options.filter(
          (o) =>
            o &&
            typeof o === "object" &&
            !Array.isArray(o) &&
            o.correct === true,
        ).length;
        if (
          q.options.some(
            (o) =>
              !o ||
              typeof o !== "object" ||
              Array.isArray(o) ||
              typeof o.t !== "string" ||
              !o.t.trim(),
          )
        )
          error(`Вопрос ${i + 1}: заполните варианты ответа`);
        if (q.type === "single" && correct !== 1)
          error(`Вопрос ${i + 1}: отметьте один правильный ответ`);
        if (q.type === "multi" && correct < 1)
          error(`Вопрос ${i + 1}: отметьте правильные ответы`);
      }
    });
  }
  if (document.id === "course-module1.module1Lessons" && Array.isArray(value))
    value.forEach((lesson, i) => {
      if (!lesson || typeof lesson !== "object" || Array.isArray(lesson))
        return;
      if (typeof lesson.title !== "string" || !lesson.title.trim())
        error(`Укажите название урока ${i + 1}`);
      if (Array.isArray(lesson.blocks))
        lesson.blocks.forEach((block) => {
          if (!block || typeof block !== "object" || Array.isArray(block))
            return;
          if (!["terms", "list", "note", "key"].includes(String(block.kind)))
            error(`Урок ${i + 1}: недопустимый тип блока`);
        });
    });
  return errors;
}
