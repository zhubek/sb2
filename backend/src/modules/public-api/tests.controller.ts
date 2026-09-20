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
import { StartTestDto, SubmitAnswerDto, UpdateAttemptDto } from "../tests/dto";
import { TestsQueries } from "../tests/queries/tests.queries";
import { TestsUseCases } from "../tests/use-cases/tests.use-cases";

@ApiTags("tests")
@Controller()
export class TestsController {
  constructor(
    private testsQueries: TestsQueries,
    private testsUseCases: TestsUseCases,
  ) {}

  @Get("tests")
  list() {
    return this.testsQueries.list();
  }

  @Get("tests/:id")
  byId(@Param("id", ParseIntPipe) id: number) {
    return this.testsQueries.byId(id);
  }

  @Post("tests/:id/attempts")
  start(@Param("id", ParseIntPipe) id: number, @Body() dto: StartTestDto) {
    return this.testsUseCases.start(id, dto.userId);
  }

  @Get("attempts/:id")
  attempt(@Param("id", ParseIntPipe) id: number) {
    return this.testsQueries.attempt(id);
  }

  @Patch("attempts/:id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateAttemptDto) {
    return this.testsUseCases.update(id, dto);
  }

  @Post("attempts/:id/answers")
  answer(@Param("id", ParseIntPipe) id: number, @Body() dto: SubmitAnswerDto) {
    return this.testsUseCases.answer(id, dto);
  }

  @Get("users/:userId/attempts")
  userAttempts(@Param("userId", ParseIntPipe) userId: number) {
    return this.testsQueries.userAttempts(userId);
  }
}
