import { AchievementsPolicy } from "../policies/achievements.policy";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../platform/database/prisma.service";

@Injectable()
export class AchievementsUseCases {
  constructor(
    private prisma: PrismaService,
    private readonly access: AchievementsPolicy,
  ) {}

  markAchievement(userId: number, studentAchievementId: number) {
    this.access.user(userId);
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

  addLog(userId: number, orgLogTypeId: number, text?: string) {
    this.access.admin();
    return this.prisma.organizationLog.create({
      data: { userId, orgLogTypeId, text },
    });
  }
}
