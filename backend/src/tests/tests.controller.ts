import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StartTestDto, SubmitAnswerDto, UpdateAttemptDto } from "./dto";
import { TestsService } from "./tests.service";

@ApiTags("tests")
@Controller()
export class TestsController {
  constructor(private tests: TestsService) {}

  @Get("tests")
  list() {
    return this.tests.list();
  }

  @Get("tests/:id")
  byId(@Param("id", ParseIntPipe) id: number) {
    return this.tests.byId(id);
  }

  @Post("tests/:id/attempts")
  start(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: StartTestDto
  ) {
    return this.tests.start(id, dto.userId);
  }

  @Get("attempts/:id")
  attempt(@Param("id", ParseIntPipe) id: number) {
    return this.tests.attempt(id);
  }

  @Patch("attempts/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAttemptDto
  ) {
    return this.tests.update(id, dto);
  }

  @Post("attempts/:id/answers")
  answer(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: SubmitAnswerDto
  ) {
    return this.tests.answer(id, dto);
  }

  @Get("users/:userId/attempts")
  userAttempts(@Param("userId", ParseIntPipe) userId: number) {
    return this.tests.userAttempts(userId);
  }
}
