import 'server-only';
import { cookies } from 'next/headers';
import { isLocale, type ContentLocale } from '@/backend/src/modules/content/domain/localization';
export async function contentLocale(): Promise<ContentLocale> {
  const value = (await cookies()).get('sb-locale')?.value;
  return isLocale(value) ? value : 'ru';
}
