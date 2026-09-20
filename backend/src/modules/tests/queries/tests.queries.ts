import { TestsPolicy } from "../policies/tests.policy";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ProgressState } from "../../../../generated/prisma";
import { PrismaService } from "../../../platform/database/prisma.service";
import { SubmitAnswerDto, UpdateAttemptDto } from ".././dto";

@Injectable()
export class TestsQueries {
  constructor(
    private prisma: PrismaService,
    private readonly access: TestsPolicy,
  ) {}

  list() {
    return this.prisma.test.findMany({
      include: { _count: { select: { questions: true } } },
    });
  }

  async byId(id: number) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: { answers: { orderBy: { order: "asc" } } },
        },
      },
    });
    if (!test) throw new NotFoundException("Тест не найден");
    return test;
  }

  async attempt(id: number) {
    if (!(await this.prisma.userTest.findFirst({ where: { id: id, ...this.access.ownedScope() }, select: { id: true } }))) throw new NotFoundException("Запись не найдена");
    const attempt = await this.prisma.userTest.findUnique({
      where: { id },
      include: {
        test: true,
        userQuestions: {
          include: { userAnswers: true },
        },
      },
    });
    if (!attempt) throw new NotFoundException("Попытка не найдена");
    return attempt;
  }

  userAttempts(userId: number) {
    this.access.user(userId);
    return this.prisma.userTest.findMany({
      where: { userId },
      include: { test: { select: { slug: true, name: true } } },
      orderBy: { started: "desc" },
    });
  }
}
