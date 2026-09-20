import { AchievementsPolicy } from "./policies/achievements.policy";
import { Module } from "@nestjs/common";
import { AchievementsQueries } from "./queries/achievements.queries";
import { AchievementsUseCases } from "./use-cases/achievements.use-cases";

@Module({
  providers: [AchievementsPolicy, AchievementsQueries, AchievementsUseCases],
  exports: [AchievementsQueries, AchievementsUseCases],
})
export class AchievementsModule {}
