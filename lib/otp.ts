// Одноразовые коды входа (OTP). Демо-хранилище в памяти процесса —
// достаточно для прототипа на одном инстансе. В проде коды живут в БД
// (как таблица OTP в старой платформе), чтобы переживать рестарты
// и работать при нескольких инстансах.

type OtpEntry = { code: string; expires: number };

const g = globalThis as unknown as { __otpStore?: Map<string, OtpEntry> };
const store = (g.__otpStore ??= new Map<string, OtpEntry>());

const TTL_MS = 10 * 60 * 1000;

export function issueOtp(email: string): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const code = String(buf[0] % 1_000_000).padStart(6, "0");
  store.set(email.toLowerCase().trim(), { code, expires: Date.now() + TTL_MS });
  return code;
}

export function consumeOtp(email: string, code: string): boolean {
  const key = email.toLowerCase().trim();
  const entry = store.get(key);
  if (!entry || entry.expires < Date.now() || entry.code !== code.trim()) {
    return false;
  }
  store.delete(key);
  return true;
}
