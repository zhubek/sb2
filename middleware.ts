import { NextResponse } from "next/server";
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

export default auth((req) => {
  const { pathname } = req.nextUrl;
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
  if (inTeacherArea && user?.role !== "teacher") {
    return NextResponse.redirect(new URL("/teacher/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tests/:path*",
    "/universities/:path*",
    "/portfolio/:path*",
    "/chat/:path*",
    "/profile/:path*",
    "/onboarding",
    "/teacher/:path*",
  ],
};
