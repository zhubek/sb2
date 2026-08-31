import { Suspense } from "react";
import { googleEnabled } from "@/lib/auth";
import AuthClient from "./auth-client";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthClient googleEnabled={googleEnabled} />
    </Suspense>
  );
}
