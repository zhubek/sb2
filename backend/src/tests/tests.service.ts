import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ProgressState } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { SubmitAnswerDto, UpdateAttemptDto } from "./dto";

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

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

  start(testId: number, userId: number) {
    return this.prisma.userTest.create({
      data: { testId, userId },
    });
  }

  async attempt(id: number) {
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

  async update(id: number, dto: UpdateAttemptDto) {
    return this.prisma.userTest.update({
      where: { id },
      data: {
        currentQuestion: dto.currentQuestion,
        state: dto.state,
        result: dto.result as Prisma.InputJsonValue | undefined,
        finished: dto.state === ProgressState.FINISHED ? new Date() : undefined,
      },
    });
  }

  // Ответ на вопрос: перезаписывает предыдущий выбор в рамках попытки
  async answer(attemptId: number, dto: SubmitAnswerDto) {
    const attempt = await this.prisma.userTest.findUnique({
      where: { id: attemptId },
    });
    if (!attempt) throw new NotFoundException("Попытка не найдена");

    const userQuestion = await this.prisma.userQuestion.upsert({
      where: {
        userTestId_questionId: {
          userTestId: attemptId,
          questionId: dto.questionId,
        },
      },
      create: {
        userTestId: attemptId,
        questionId: dto.questionId,
        userId: attempt.userId,
      },
      update: {},
    });

    await this.prisma.userAnswer.deleteMany({
      where: { userQuestionId: userQuestion.id },
    });
    await this.prisma.userAnswer.createMany({
      data: dto.answerIds.map((answerId) => ({
        userQuestionId: userQuestion.id,
        answerId,
        userId: attempt.userId,
        isPicked: true,
      })),
    });

    return this.prisma.userQuestion.findUnique({
      where: { id: userQuestion.id },
      include: { userAnswers: true },
    });
  }

  userAttempts(userId: number) {
    return this.prisma.userTest.findMany({
      where: { userId },
      include: { test: { select: { slug: true, name: true } } },
      orderBy: { started: "desc" },
    });
  }
}
