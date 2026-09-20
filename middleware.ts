import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { auth } from "@/lib/auth";

// Защита разделов: личный кабинет ученика — любой вход,
// панель педагога — только роль teacher.
const studentPrefixes = [
  "/dashboard",
  "/tests",
  "/universities",
  "/portfolio",
  "/chat",
  "/profile",
  "/onboarding",
];

export default function middleware(req:NextRequest,event:NextFetchEvent) {
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete('x-cms-preview-token');
  requestHeaders.delete('x-cms-preview-path');
  if (pathname.startsWith('/_cms-preview/')) {
    // Preserve Next's internal origin. Auth.js replaces it with AUTH_URL,
    // which turns an internal rewrite into a proxy request and loses the draft.
    const match=/^\/_cms-preview\/([a-f0-9]{48})(\/.*)?$/.exec(pathname);
    if (!match || !['GET','HEAD'].includes(req.method)) return new NextResponse('Preview unavailable',{status:403});
    const target=match[2] || '/';
    if (/^\/(api|admin|_next|_cms-preview)(\/|$)/.test(target)) return new NextResponse('Preview unavailable',{status:403});
    requestHeaders.set('x-cms-preview-token',match[1]);
    requestHeaders.set('x-cms-preview-path',target);
    const url=req.nextUrl.clone();url.pathname=target;
    const response=NextResponse.rewrite(url,{request:{headers:requestHeaders}});
    response.headers.set('Cache-Control','private, no-store');
    response.headers.set('Referrer-Policy','no-referrer');
    response.headers.set('X-Robots-Tag','noindex, nofollow');
    return response;
  }
  return protect(req,event);
}

const protect=auth((req, _event:NextFetchEvent) => {
  const { pathname }=req.nextUrl;
  const requestHeaders=new Headers(req.headers);
  requestHeaders.delete('x-cms-preview-token');
  requestHeaders.delete('x-cms-preview-path');
  const user = req.auth?.user;

  const inStudentArea = studentPrefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (inStudentArea && !user) {
    const url = new URL("/auth", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const inTeacherArea =
    pathname.startsWith("/teacher") && pathname !== "/teacher/login";
  if (inTeacherArea && !["teacher", "admin"].includes(user?.role ?? "")) {
    return NextResponse.redirect(new URL("/teacher/login", req.nextUrl));
  }

  return NextResponse.next({request:{headers:requestHeaders}});
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
