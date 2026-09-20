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
import { ProgressState } from "../../../generated/prisma";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { CourseQueries } from "../course/queries/course.queries";
import { CourseUseCases } from "../course/use-cases/course.use-cases";

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
  constructor(
    private courseQueries: CourseQueries,
    private courseUseCases: CourseUseCases,
  ) {}

  @Get("manuals")
  manuals() {
    return this.courseQueries.manuals();
  }

  @Get("manuals/:id")
  manual(@Param("id", ParseIntPipe) id: number) {
    return this.courseQueries.manual(id);
  }

  @Get("courses")
  courses() {
    return this.courseQueries.courses();
  }

  @Get("courses/:id")
  byId(@Param("id", ParseIntPipe) id: number) {
    return this.courseQueries.course(id);
  }

  @Post("courses/:id/enroll")
  enroll(@Param("id", ParseIntPipe) id: number, @Body() dto: EnrollDto) {
    return this.courseUseCases.enroll(id, dto.userId);
  }

  @Get("users/:userId/courses")
  userCourses(@Param("userId", ParseIntPipe) userId: number) {
    return this.courseQueries.userCourses(userId);
  }

  @Put("user-courses/:id/lessons/:lessonId")
  setLessonState(
    @Param("id", ParseIntPipe) id: number,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Body() dto: SetStateDto,
  ) {
    return this.courseUseCases.setLessonState(id, lessonId, dto.state);
  }

  @Put("user-courses/:id/modules/:moduleId")
  setModuleState(
    @Param("id", ParseIntPipe) id: number,
    @Param("moduleId", ParseIntPipe) moduleId: number,
    @Body() dto: SetStateDto,
  ) {
    return this.courseUseCases.setModuleState(id, moduleId, dto.state);
  }

  @Post("quizzes/:id/attempts")
  submitQuiz(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.courseUseCases.submitQuiz(id, dto);
  }

  @Get("users/:userId/quizzes")
  userQuizzes(@Param("userId", ParseIntPipe) userId: number) {
    return this.courseQueries.userQuizzes(userId);
  }
}
