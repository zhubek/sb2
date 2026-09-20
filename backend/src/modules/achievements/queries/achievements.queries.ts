import { AchievementsPolicy } from "../policies/achievements.policy";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../platform/database/prisma.service";

@Injectable()
export class AchievementsQueries {
  constructor(
    private prisma: PrismaService,
    private readonly access: AchievementsPolicy,
  ) {}

  studentAchievements() {
    return this.prisma.studentAchievement.findMany({
      orderBy: { order: "asc" },
    });
  }

  // Чек-лист ученика: все достижения + отметки конкретного пользователя
  async userAchievements(userId: number) {
    this.access.user(userId);
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

  orgAchievements() {
    return this.prisma.orgAchievement.findMany();
  }

  logTypes() {
    return this.prisma.orgLogType.findMany({ orderBy: { id: "asc" } });
  }

  logs(userId: number) {
    this.access.user(userId);
    return this.prisma.organizationLog.findMany({
      where: { userId },
      include: { orgLogType: true },
      orderBy: { dateTime: "desc" },
    });
  }

  // Баллы сезона: сумма по журналу начислений всех педагогов организации
  async organizationPoints(organizationId: number) {
    this.access.organization(organizationId);
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
