import { backendToken } from "./backend-identity";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { consumeOtp } from "@/lib/otp";
import { PASSWORD_LOGIN } from "@/features/auth/graphql/operations";

export const googleEnabled = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
const apiUrl = () => process.env.API_URL ?? "http://127.0.0.1:3030/api";
async function passwordIdentity(credentials: Partial<Record<"email" | "password", unknown>>, teacherOnly = false) {
  const email = String(credentials.email ?? "").trim().toLowerCase();
  const password = String(credentials.password ?? "");
  if (!email || !password || email.length > 254 || password.length > 256) return null;
  try {
    const response = await fetch(apiUrl() + "/graphql", { method: "POST",
      headers: { "Content-Type": "application/json" }, cache: "no-store", signal: AbortSignal.timeout(10000),
      body: JSON.stringify({ query: PASSWORD_LOGIN, variables: { input: { email, password } } }) });
    const result = await response.json();
    const user = result.data?.passwordLogin;
    if (!response.ok || result.errors?.length || !user || teacherOnly && !["TEACHER", "ADMIN"].includes(user.role)) return null;
    return { id: user.email, email: user.email, name: user.name, backendId: user.id,
      credentialVersion: user.credentialVersion, contentAdmin: user.contentAdmin,
      role: user.role === "ADMIN" ? "admin" as const : user.role === "TEACHER" ? "teacher" as const : "student" as const };
  } catch { return null; }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: { signIn: "/auth" },
  providers: [
    ...(googleEnabled ? [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })] : []),
    Credentials({ id: "password", name: "Email and password",
      credentials: { email: {}, password: {} }, authorize: c => passwordIdentity(c) }),
    Credentials({ id: "teacher", name: "Teacher",
      credentials: { email: {}, password: {} }, authorize: c => passwordIdentity(c, true) }),
    Credentials({ id: "otp", name: "Email OTP", credentials: { email: {}, code: {} },
      async authorize(credentials) {
        if (process.env.NODE_ENV === "production") return null;
        const email = String(credentials.email ?? "").toLowerCase().trim();
        const code = String(credentials.code ?? "");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !code) return null;
        if (code !== "000000" && !consumeOtp(email, code)) return null;
        return { id: email, email, role: "student" as const };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.email ?? user.id;
        token.role = user.role ?? "student";
        token.contentAdmin = user.contentAdmin ?? false;
        token.credentialVersion = user.credentialVersion;
        token.backendId = user.backendId;
        if (!token.backendId) {
          const email = user.email ?? "";
          const response = await fetch(apiUrl() + "/users", { method: "POST", signal: AbortSignal.timeout(10000),
            headers: { "Content-Type": "application/json", Authorization: await backendToken({ scope: "identity:provision", email }) },
            body: JSON.stringify({ email, name: user.name?.split(" ")[0] || email.split("@")[0], surname: user.name?.split(" ").slice(1).join(" ") || "" }) });
          if (!response.ok) throw new Error("Identity provisioning rejected");
          const profile = await response.json();
          token.backendId = profile.id;
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role === "admin" ? "admin" : token.role === "teacher" ? "teacher" : "student";
      session.user.backendId = typeof token.backendId === "number" ? token.backendId : undefined;
      session.user.credentialVersion = typeof token.credentialVersion === "number" ? token.credentialVersion : undefined;
      session.user.contentAdmin = token.contentAdmin === true;
      return session;
    },
  },
});
