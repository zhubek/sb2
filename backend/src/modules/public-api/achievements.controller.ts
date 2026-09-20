import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";
import { AchievementsQueries } from "../achievements/queries/achievements.queries";
import { AchievementsUseCases } from "../achievements/use-cases/achievements.use-cases";

class AddLogDto {
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsInt()
  @Type(() => Number)
  orgLogTypeId: number;

  @IsOptional()
  @IsString()
  text?: string;
}

@ApiTags("achievements")
@Controller()
export class AchievementsController {
  constructor(
    private achievementsQueries: AchievementsQueries,
    private achievementsUseCases: AchievementsUseCases,
  ) {}

  @Get("achievements/student")
  studentAchievements() {
    return this.achievementsQueries.studentAchievements();
  }

  @Get("users/:id/achievements")
  userAchievements(@Param("id", ParseIntPipe) id: number) {
    return this.achievementsQueries.userAchievements(id);
  }

  @Post("users/:id/achievements/:achievementId")
  mark(
    @Param("id", ParseIntPipe) id: number,
    @Param("achievementId", ParseIntPipe) achievementId: number,
  ) {
    return this.achievementsUseCases.markAchievement(id, achievementId);
  }

  @Get("achievements/org")
  orgAchievements() {
    return this.achievementsQueries.orgAchievements();
  }

  @Get("org-log-types")
  logTypes() {
    return this.achievementsQueries.logTypes();
  }

  @Post("org-logs")
  addLog(@Body() dto: AddLogDto) {
    return this.achievementsUseCases.addLog(
      dto.userId,
      dto.orgLogTypeId,
      dto.text,
    );
  }

  @Get("users/:id/org-logs")
  logs(@Param("id", ParseIntPipe) id: number) {
    return this.achievementsQueries.logs(id);
  }

  @Get("organizations/:id/points")
  points(@Param("id", ParseIntPipe) id: number) {
    return this.achievementsQueries.organizationPoints(id);
  }
}
