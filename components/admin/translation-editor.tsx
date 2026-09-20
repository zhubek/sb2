"use client";
import type { Json } from '@/lib/cms/types';
import { translatable } from '@/backend/src/modules/content/domain/localization';
import { fieldLabel } from './fields';

export default function TranslationEditor({ source, value, onChange, name = '', path = '', filter = '', excludeProgramFields=false }: { excludeProgramFields?: boolean; source: Json; value: Json; onChange: (value: Json) => void; name?: string; path?: string; filter?: string }) {
  if (excludeProgramFields && name==='ops') return null;
  if (typeof source === 'string') {
    if (!translatable(name, source) || (filter && !`${path} ${source} ${value}`.toLowerCase().includes(filter.toLowerCase()))) return null;
    return <label className="admin-field" style={{ marginBottom: 22 }}><span>{path || 'Текст'}</span><small style={{ display: 'block', whiteSpace: 'pre-wrap', color: '#777', margin: '8px 0' }}>Русский: {source}</small><textarea className="admin-input" aria-label={path || 'Перевод'} rows={source.length > 160 ? 5 : 2} value={typeof value === 'string' ? value : source} onChange={e => onChange(e.target.value)} /></label>;
  }
  if (Array.isArray(source)) return <>{source.map((item, i) => <TranslationEditor excludeProgramFields={excludeProgramFields} key={i} source={item} value={Array.isArray(value) ? value[i] : item} name={name} path={`${path} / ${i + 1}`} filter={filter} onChange={v => { const next = Array.isArray(value) ? [...value] : [...source]; next[i] = v; onChange(next); }} />)}</>;
  if (source && typeof source === 'object') {
    const current = value && typeof value === 'object' && !Array.isArray(value) ? value : source;
    // The landing page already has bilingual leaves. Show one translation field.
    if (typeof source.ru === 'string' && typeof source.kk === 'string') return <TranslationEditor excludeProgramFields={excludeProgramFields} source={source.ru} value={current.ru} name="text" path={path} filter={filter} onChange={v => onChange({ ...current, ru: v, kk: v })} />;
    return <>{Object.entries(source).map(([key, item]) => <TranslationEditor excludeProgramFields={excludeProgramFields} key={key} source={item} value={current[key]} name={key} path={path ? `${path} / ${fieldLabel(key)}` : fieldLabel(key)} filter={filter} onChange={v => onChange({ ...current, [key]: v })} />)}</>;
  }
  return null;
}
