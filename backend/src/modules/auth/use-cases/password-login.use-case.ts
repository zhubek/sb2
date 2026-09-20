import { Injectable, UnauthorizedException, HttpException } from "@nestjs/common";
import { PrismaService } from "../../../platform/database/prisma.service";
import { verifyPassword } from "../password";
@Injectable()
export class PasswordLogin {
  private readonly failures = new Map<string, { count: number; until: number }>();
  constructor(private readonly prisma: PrismaService) {}
  async execute(email: string, password: string) {
    const normalized = email.toLowerCase().trim();
    if (normalized.length > 254 || password.length > 256 || !normalized || !password)
      throw new UnauthorizedException("Неверная почта или пароль");
    const now = Date.now();
    for (const [key, value] of this.failures) if (value.until <= now) this.failures.delete(key);
    const attempts = this.failures.get(normalized) ?? { count: 0, until: now + 15 * 60_000 };
    if (attempts.count >= 10 || this.failures.size >= 10000)
      throw new HttpException("Слишком много попыток. Повторите позже.", 429);
    attempts.count++;
    this.failures.set(normalized, attempts);
    const user = await this.prisma.user.findUnique({ where: { email: normalized }, include: { credential: true } });
    const hash = user?.credential?.passwordHash ?? `scrypt:${"0".repeat(32)}:${"0".repeat(128)}`;
    const valid = await verifyPassword(password, hash);
    if (!valid || !user?.credential?.enabled) throw new UnauthorizedException("Неверная почта или пароль");
    this.failures.delete(normalized);
    return { id: user.id, email: user.email, name: `${user.name} ${user.surname}`.trim(),
      role: user.role, contentAdmin: user.credential.contentAdmin || user.role === "ADMIN",
      credentialVersion: user.credential.version };
  }
}
