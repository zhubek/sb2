import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  studentAchievements() {
    return this.prisma.studentAchievement.findMany({
      orderBy: { order: "asc" },
    });
  }

  // Чек-лист ученика: все достижения + отметки конкретного пользователя
  async userAchievements(userId: number) {
    const [all, mine] = await this.prisma.$transaction([
      this.prisma.studentAchievement.findMany({ orderBy: { order: "asc" } }),
      this.prisma.userStudentAchievement.findMany({ where: { userId } }),
    ]);
    const byId = new Map(mine.map((m) => [m.studentAchievementId, m]));
    return all.map((a) => ({
      ...a,
      isSuccess: byId.get(a.id)?.isSuccess ?? false,
      achievedAt: byId.get(a.id)?.achievedAt ?? null,
    }));
  }

  markAchievement(userId: number, studentAchievementId: number) {
    return this.prisma.userStudentAchievement.upsert({
      where: {
        userId_studentAchievementId: { userId, studentAchievementId },
      },
      create: {
        userId,
        studentAchievementId,
        isSuccess: true,
        achievedAt: new Date(),
      },
      update: { isSuccess: true, achievedAt: new Date() },
    });
  }

  orgAchievements() {
    return this.prisma.orgAchievement.findMany();
  }

  logTypes() {
    return this.prisma.orgLogType.findMany({ orderBy: { id: "asc" } });
  }

  addLog(userId: number, orgLogTypeId: number, text?: string) {
    return this.prisma.organizationLog.create({
      data: { userId, orgLogTypeId, text },
    });
  }

  logs(userId: number) {
    return this.prisma.organizationLog.findMany({
      where: { userId },
      include: { orgLogType: true },
      orderBy: { dateTime: "desc" },
    });
  }

  // Баллы сезона: сумма по журналу начислений всех педагогов организации
  async organizationPoints(organizationId: number) {
    const logs = await this.prisma.organizationLog.findMany({
      where: { user: { organizationId } },
      include: { orgLogType: { select: { point: true, group: true } } },
    });
    const byGroup: Record<string, number> = {};
    let total = 0;
    for (const log of logs) {
      total += log.orgLogType.point;
      byGroup[log.orgLogType.group] =
        (byGroup[log.orgLogType.group] ?? 0) + log.orgLogType.point;
    }
    return { organizationId, total, byGroup, entries: logs.length };
  }
}
