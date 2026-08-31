import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProgressState } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { CourseService } from "./course.service";

class EnrollDto {
  @IsInt()
  @Type(() => Number)
  userId: number;
}

class SetStateDto {
  @IsEnum(ProgressState)
  state: ProgressState;
}

class QuizAnswerItemDto {
  @IsInt()
  quizQuestionId: number;

  @IsArray()
  @IsInt({ each: true })
  quizAnswerIds: number[];

  @IsOptional()
  value?: unknown;
}

class SubmitQuizDto {
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerItemDto)
  answers: QuizAnswerItemDto[];
}

@ApiTags("course")
@Controller()
export class CourseController {
  constructor(private course: CourseService) {}

  @Get("manuals")
  manuals() {
    return this.course.manuals();
  }

  @Get("manuals/:id")
  manual(@Param("id", ParseIntPipe) id: number) {
    return this.course.manual(id);
  }

  @Get("courses")
  courses() {
    return this.course.courses();
  }

  @Get("courses/:id")
  byId(@Param("id", ParseIntPipe) id: number) {
    return this.course.course(id);
  }

  @Post("courses/:id/enroll")
  enroll(@Param("id", ParseIntPipe) id: number, @Body() dto: EnrollDto) {
    return this.course.enroll(id, dto.userId);
  }

  @Get("users/:userId/courses")
  userCourses(@Param("userId", ParseIntPipe) userId: number) {
    return this.course.userCourses(userId);
  }

  @Put("user-courses/:id/lessons/:lessonId")
  setLessonState(
    @Param("id", ParseIntPipe) id: number,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Body() dto: SetStateDto
  ) {
    return this.course.setLessonState(id, lessonId, dto.state);
  }

  @Put("user-courses/:id/modules/:moduleId")
  setModuleState(
    @Param("id", ParseIntPipe) id: number,
    @Param("moduleId", ParseIntPipe) moduleId: number,
    @Body() dto: SetStateDto
  ) {
    return this.course.setModuleState(id, moduleId, dto.state);
  }

  @Post("quizzes/:id/attempts")
  submitQuiz(@Param("id", ParseIntPipe) id: number, @Body() dto: SubmitQuizDto) {
    return this.course.submitQuiz(id, dto);
  }

  @Get("users/:userId/quizzes")
  userQuizzes(@Param("userId", ParseIntPipe) userId: number) {
    return this.course.userQuizzes(userId);
  }
}
