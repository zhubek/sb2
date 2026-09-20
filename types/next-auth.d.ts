import type { DefaultSession } from "next-auth";

export type Role = "student" | "teacher" | "admin";

declare module "next-auth" {
  interface User {
    role?: Role;
    backendId?: number;
    credentialVersion?: number;
    contentAdmin?: boolean;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
      credentialVersion?: number;
      contentAdmin?: boolean;
      backendId?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;

    credentialVersion?: number;
    contentAdmin?: boolean;
    backendId?: number;
  }
}
