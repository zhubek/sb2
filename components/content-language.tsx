"use client";
import { usePathname } from 'next/navigation';
import { isLocale, type ContentLocale } from '@/backend/src/modules/content/domain/localization';
import { useContentLocale, useCopy } from '@/lib/cms/client';
export function chooseContentLanguage(locale: ContentLocale) {
  if (!isLocale(locale)) return;
  document.cookie = `sb-locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.location.reload();
}
export function LanguageSwitcher({labels={}}: {labels?:Partial<Record<ContentLocale,string>>}) {
  const locale = useContentLocale(), copy = useCopy('copy.components.content-language');
  const options = [['kk',labels.kk??copy('kazakh','ҚАЗ')],['ru',labels.ru??copy('russian','РУС')],['en',labels.en??copy('english','EN')]] as const;
  return <div role="group" aria-label={copy('label','Язык')} data-language-switcher className="flex shrink-0 overflow-hidden rounded-full border border-stone-200 bg-white text-xs font-semibold">
    {options.map(([code,label]) => <button type="button" key={code} aria-label={'Language: '+code} aria-pressed={locale===code} onClick={()=>{if(code!==locale)chooseContentLanguage(code);}} className={`px-2 py-1.5 tracking-wide transition sm:px-2.5 ${locale===code?'bg-stone-800 text-white':'text-stone-500 hover:bg-stone-100 hover:text-stone-800'}`}>{label}</button>)}
  </div>;
}
export default function ContentLanguage({ locale }: { locale: ContentLocale }) {
  const path = usePathname();
  const hasHeader = ['dashboard','tests','universities','portfolio','profile','chat'].some(p=>path==='/'+p||path.startsWith('/'+p+'/')) || (path.startsWith('/teacher')&&path!=='/teacher/login');
  if (path.startsWith('/admin') || path.startsWith('/__preview') || path === '/' || hasHeader) return null;
  return <div className="fixed right-4 top-4 z-40 print:hidden"><LanguageSwitcher/></div>;
}
