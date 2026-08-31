import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { consumeOtp } from "@/lib/otp";

// Google включается только когда в окружении есть ключи OAuth —
// без них демо работает на одном OTP-входе.
export const googleEnabled = !!(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    // Вход ученика по коду из письма (в демо код показывается на экране)
    Credentials({
      id: "otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        code: { label: "Код", type: "text" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const code = String(credentials?.code ?? "");
        if (!email || !code) return null;
        if (!consumeOtp(email, code)) return null;
        // Прод: найти/создать пользователя в БД (см. authConfig старой платформы)
        return { id: email, email, role: "student" as const };
      },
    }),
    // Вход педагога по учётным данным, выданным администратором.
    // Демо: принимается любая пара, кроме домена wrong.kz (ветка ошибки входа).
    Credentials({
      id: "teacher",
      name: "Педагог",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;
        if (email.endsWith("@wrong.kz")) return null;
        // Прод: проверка пары в БД (bcrypt), учётки создаёт администратор школы
        return { id: email, email, role: "teacher" as const };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "student";
        // Связываем сессию с пользователем в БД бекенда (upsert по почте)
        try {
          const apiUrl =
            process.env.API_URL ??
            process.env.NEXT_PUBLIC_API_URL ??
            "http://localhost:3002/api";
          const email = user.email ?? "";
          const res = await fetch(`${apiUrl}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              name: user.name?.split(" ")[0] || email.split("@")[0] || "Ученик",
              surname: user.name?.split(" ").slice(1).join(" ") || undefined,
              role: token.role === "teacher" ? "TEACHER" : "STUDENT",
            }),
          });
          if (res.ok) token.backendId = (await res.json()).id;
        } catch {
          // Бекенд недоступен — сессия работает без backendId (мок-режим)
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as "student" | "teacher") ?? "student";
      session.user.backendId = token.backendId as number | undefined;
      return session;
    },
  },
});
