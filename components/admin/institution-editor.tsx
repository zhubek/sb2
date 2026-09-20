"use client";

import ValueEditor, { type References } from "./fields";
import type { Json } from "@/lib/cms/types";

const kindNames: Record<string, string> = {v:"Вуз", c:"Колледж", a:"Зарубежный вуз"};

export default function InstitutionEditor({value, onChange, filter, references, programCount}: {
  value: Json;
  onChange: (value: Json) => void;
  filter: string;
  references?: References;
  programCount: number | null;
}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const {i, kind, nOps: _legacyCount, inds, detail, ...fields} = value;
  const selected = Array.isArray(inds) ? inds.filter((id): id is number => typeof id === "number") : [];
  const contacts = detail && typeof detail === "object" && !Array.isArray(detail) ? detail : {};
  const choices = references?.industries ?? [];
  const search = filter.trim().toLocaleLowerCase("ru");
  const matchesIndustries = !search || "отрасли направления".includes(search);
  const visibleChoices = choices.filter(c => matchesIndustries || c.label.toLocaleLowerCase("ru").includes(search));
  const toggle = (id: number) => onChange({...value, inds:selected.includes(id) ? selected.filter(old => old !== id) : [...selected, id]});

  return <div className="admin-institution-editor">
    <dl className="admin-institution-summary">
      <div><dt>Тип заведения</dt><dd>{kindNames[String(kind)] ?? String(kind)}</dd></div>
      <div><dt>Количество программ</dt><dd data-testid="institution-program-count">{programCount ?? "Подсчитываем…"}</dd></div>
    </dl>
    <p className="admin-institution-help">Количество рассчитывается автоматически по списку программ, включая дополнительные программы.</p>
    <ValueEditor value={{name:fields.name ?? "", ...fields}} filter={filter} onChange={next => onChange({...value, ...next as Record<string, Json>})}/>
    {(visibleChoices.length > 0 || matchesIndustries) && <details className="admin-institution-section" open={search ? true : undefined}>
      <summary>Отрасли · {selected.length}</summary>
      <p className="admin-institution-help">Выберите отрасли, чтобы заведение находилось по соответствующим фильтрам в навигаторе.</p>
      <div className="admin-industry-options">
        {visibleChoices.map(c => <label key={c.value}><input type="checkbox" checked={selected.includes(c.value)} onChange={() => toggle(c.value)}/><span>{c.label}</span></label>)}
        {matchesIndustries && selected.filter(id => !choices.some(c => c.value === id)).map(id => <label key={id}><input type="checkbox" checked onChange={() => toggle(id)}/><span>Отрасль {id} (нет в справочнике)</span></label>)}
      </div>
    </details>}
    <section className="admin-institution-section">
      <h2>Подробная информация и контакты</h2>
      <p className="admin-institution-help">Instagram: ссылка на профиль или @имя. Контакты отображаются справа и на странице заведения.</p>
      <ValueEditor field="detail" value={{...contacts, ig:contacts.ig ?? ""}} filter={filter} onChange={next => onChange({...value, detail:next})}/>
    </section>
  </div>;
}
