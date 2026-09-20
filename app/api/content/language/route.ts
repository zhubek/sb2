import { NextResponse } from 'next/server';
import { isLocale } from '@/backend/src/modules/content/domain/localization';

export function GET(request: Request) {
  const url = new URL(request.url), locale = url.searchParams.get('locale');
  const returnTo = url.searchParams.get('returnTo') || '/';
  if (!isLocale(locale) || !returnTo.startsWith('/')) return NextResponse.json({error:'Некорректный язык или адрес'}, {status:400});
  let destination: URL;
  try { destination = new URL(returnTo, url.origin); }
  catch { return NextResponse.json({error:'Недопустимый адрес'}, {status:400}); }
  if (destination.origin !== url.origin || destination.pathname.startsWith('//') || destination.pathname.startsWith('/api/')) return NextResponse.json({error:'Недопустимый адрес'}, {status:400});
  // Keep the browser's public host; request.url can contain Next's bind address.
  const response = new NextResponse(null, {status:303,headers:{Location:destination.pathname+destination.search+destination.hash}});
  response.cookies.set('sb-locale',locale,{path:'/',maxAge:31536000,sameSite:'lax'});
  response.headers.set('Cache-Control','no-store');
  return response;
}
