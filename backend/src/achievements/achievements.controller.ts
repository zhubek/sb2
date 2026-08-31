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
import { AchievementsService } from "./achievements.service";

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
  constructor(private achievements: AchievementsService) {}

  @Get("achievements/student")
  studentAchievements() {
    return this.achievements.studentAchievements();
  }

  @Get("users/:id/achievements")
  userAchievements(@Param("id", ParseIntPipe) id: number) {
    return this.achievements.userAchievements(id);
  }

  @Post("users/:id/achievements/:achievementId")
  mark(
    @Param("id", ParseIntPipe) id: number,
    @Param("achievementId", ParseIntPipe) achievementId: number
  ) {
    return this.achievements.markAchievement(id, achievementId);
  }

  @Get("achievements/org")
  orgAchievements() {
    return this.achievements.orgAchievements();
  }

  @Get("org-log-types")
  logTypes() {
    return this.achievements.logTypes();
  }

  @Post("org-logs")
  addLog(@Body() dto: AddLogDto) {
    return this.achievements.addLog(dto.userId, dto.orgLogTypeId, dto.text);
  }

  @Get("users/:id/org-logs")
  logs(@Param("id", ParseIntPipe) id: number) {
    return this.achievements.logs(id);
  }

  @Get("organizations/:id/points")
  points(@Param("id", ParseIntPipe) id: number) {
    return this.achievements.organizationPoints(id);
  }
}
