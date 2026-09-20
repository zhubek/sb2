import type { Json } from './types';

export const locales = ['ru', 'kk', 'en'] as const;
export type ContentLocale = typeof locales[number];
export const localeNames = { ru: 'Русский', kk: 'Қазақша', en: 'English' };
export function isLocale(value: unknown): value is ContentLocale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
export function translationId(id: string, locale: ContentLocale) {
  return locale === 'ru' ? id : `i18n.${locale}.${id}`;
}
export function translationKey(id: string) {
  const match = /^i18n\.(kk|en)\.(.+)$/.exec(id);
  return match ? { locale: match[1] as ContentLocale, id: match[2] } : null;
}
const shared = /^(id|i|slug|code|groupCode|institutionId|type|kind|icon|href|url|src|site|email|phone|ig|instagram|color|accent|accentB|tint|key|value|correct|num|order|g|ind|industry|language|l|langs|city|obl|country|region|reg|nameKz|en)$/;
export function translatable(key: string, value: Json) {
  return typeof value === 'string' && !shared.test(key) && !/^(https?:|\/|#|mailto:|tel:)/i.test(value);
}
export type Translation = { source: Json; value: Json };
export function envelope(value: unknown): value is Translation {
  return !!value && typeof value === 'object' && !Array.isArray(value) && Object.hasOwn(value, 'source') && Object.hasOwn(value, 'value');
}
// Apply only translations whose source text and structure still match. This also
// keeps current shared prices/IDs when a Russian document changes afterwards.
export function translated(current: Json, source: Json, value: Json, key = ''): Json {
  if (typeof current === 'string') return current === source && translatable(key, current) && typeof value === 'string' ? value : current;
  if (Array.isArray(current)) {
    if (!Array.isArray(source) || !Array.isArray(value) || current.length !== source.length || source.length !== value.length) return current;
    return current.map((v, i) => translated(v, source[i], value[i], key));
  }
  if (current && typeof current === 'object') {
    if (!source || typeof source !== 'object' || Array.isArray(source) || !value || typeof value !== 'object' || Array.isArray(value)) return current;
    if (['id', 'i', 'code'].some(k => current[k] !== undefined && current[k] !== source[k])) return current;
    return Object.fromEntries(Object.entries(current).map(([k, v]) => [k, translated(v, source[k], value[k], k)]));
  }
  return current;
}
export function translationErrors(source: Json, value: Json, key = '', path = ''): string[] {
  if (typeof source === 'string' && translatable(key, source)) return typeof value === 'string' ? [] : [path];
  if (Array.isArray(source)) return Array.isArray(value) && source.length === value.length ? source.flatMap((v, i) => translationErrors(v, value[i], key, `${path}/${i}`)) : [path];
  if (source && typeof source === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(source).sort().join('|') !== Object.keys(value).sort().join('|')) return [path];
    return Object.entries(source).flatMap(([k, v]) => translationErrors(v, value[k], k, `${path}/${k}`));
  }
  return source === value ? [] : [path];
}

// Preserve the landing page's original bilingual shape for existing components.
export function landingLanguage(value: Json, locale: ContentLocale, hasTranslation = false): Json {
  if (Array.isArray(value)) return value.map(v => landingLanguage(v, locale, hasTranslation));
  if (value && typeof value === 'object') {
    if (typeof value.ru === 'string' && typeof value.kk === 'string') {
      const text = !hasTranslation && locale === 'kk' ? value.kk : value.ru;
      return { ...value, ru: text, kk: text };
    }
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, landingLanguage(v, locale, hasTranslation)]));
  }
  return value;
}
