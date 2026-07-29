// Событие «шаг чек-листа выполнен»: любой экран может сообщить о прогрессе,
// чек-лист в шапке откроется сам, запустит конфетти и зачеркнёт пункт.
export const CHECKLIST_STEP_DONE = "checklist-step-done";

export function completeChecklistStep(id: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHECKLIST_STEP_DONE, { detail: { id } }));
}
