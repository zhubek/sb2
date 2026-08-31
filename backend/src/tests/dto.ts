import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from "class-validator";
import { ProgressState } from "@prisma/client";

export class StartTestDto {
  @IsInt()
  @Type(() => Number)
  userId: number;
}

export class SubmitAnswerDto {
  @IsInt()
  questionId: number;

  @IsArray()
  @IsInt({ each: true })
  answerIds: number[];
}

export class UpdateAttemptDto {
  @IsOptional()
  @IsInt()
  currentQuestion?: number;

  @IsOptional()
  @IsEnum(ProgressState)
  state?: ProgressState;

  @IsOptional()
  @IsObject()
  result?: Record<string, unknown>;
}
