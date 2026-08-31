"use server";

import { issueOtp } from "@/lib/otp";

// Запрос кода входа. Демо: письма не отправляются, код возвращается
// на экран. Прод: отправка через SMTP/Resend (nodemailer, как в старой
// платформе) — поле demoCode тогда убирается из ответа.
export async function requestOtp(email: string) {
  const normalized = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false as const, error: "Некорректный адрес почты" };
  }
  const code = issueOtp(normalized);
  return { ok: true as const, demoCode: code };
}
