import { TestsPolicy } from "../policies/tests.policy";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, ProgressState } from "../../../../generated/prisma";
import { PrismaService } from "../../../platform/database/prisma.service";
import { SubmitAnswerDto, UpdateAttemptDto } from ".././dto";

@Injectable()
export class TestsUseCases {
  constructor(
    private prisma: PrismaService,
    private readonly access: TestsPolicy,
  ) {}

  start(testId: number, userId: number) {
    this.access.user(userId);
    return this.prisma.userTest.create({
      data: { testId, userId },
    });
  }

  async update(id: number, dto: UpdateAttemptDto) {
    if (!(await this.prisma.userTest.findFirst({ where: { id: id, ...this.access.ownedScope() }, select: { id: true } }))) throw new NotFoundException("Запись не найдена");
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
    if (!(await this.prisma.userTest.findFirst({ where: { id: attemptId, ...this.access.ownedScope() }, select: { id: true } }))) throw new NotFoundException("Запись не найдена");
    return this.prisma.$transaction(
      async (tx) => {
        const attempt = await tx.userTest.findUnique({
          where: { id: attemptId },
        });
        if (!attempt) throw new NotFoundException("Попытка не найдена");
        if (attempt.state === "FINISHED")
          throw new ConflictException("Попытка уже завершена");
        const question = await tx.question.findFirst({
          where: { id: dto.questionId, testId: attempt.testId },
          include: { answers: { select: { id: true } } },
        });
        if (
          !question ||
          new Set(dto.answerIds).size !== dto.answerIds.length ||
          dto.answerIds.some((id) => !question.answers.some((a) => a.id === id))
        )
          throw new BadRequestException(
            "Ответы не принадлежат вопросу этого теста",
          );

        const userQuestion = await tx.userQuestion.upsert({
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

        await tx.userAnswer.deleteMany({
          where: { userQuestionId: userQuestion.id },
        });
        await tx.userAnswer.createMany({
          data: dto.answerIds.map((answerId) => ({
            userQuestionId: userQuestion.id,
            answerId,
            userId: attempt.userId,
            isPicked: true,
          })),
        });

        return tx.userQuestion.findUnique({
          where: { id: userQuestion.id },
          include: { userAnswers: true },
        });
      },
      { isolationLevel: "Serializable" },
    );
  }
}
