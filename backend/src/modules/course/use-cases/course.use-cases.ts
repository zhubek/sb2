import { CoursePolicy } from "../policies/course.policy";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ProgressState } from "../../../../generated/prisma";
import { PrismaService } from "../../../platform/database/prisma.service";

export interface QuizSubmission {
  userId: number;
  answers: {
    quizQuestionId: number;
    quizAnswerIds: number[];
    value?: unknown;
  }[];
}

@Injectable()
export class CourseUseCases {
  constructor(
    private prisma: PrismaService,
    private readonly access: CoursePolicy,
  ) {}

  enroll(courseId: number, userId: number) {
    this.access.user(userId);
    return this.prisma.userCourse.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId },
      update: {},
    });
  }

  async setLessonState(
    userCourseId: number,
    lessonId: number,
    state: ProgressState,
  ) {
    if (!(await this.prisma.userCourse.findFirst({ where: { id: userCourseId, ...this.access.ownedScope() }, select: { id: true } }))) throw new NotFoundException("Запись не найдена");
    const userCourse = await this.prisma.userCourse.findUnique({
      where: { id: userCourseId },
    });
    if (!userCourse) throw new NotFoundException("Запись на курс не найдена");

    if (
      !(await this.prisma.lesson.findFirst({
        where: { id: lessonId, module: { courseId: userCourse.courseId } },
        select: { id: true },
      }))
    )
      throw new NotFoundException("Урок не принадлежит этому курсу");
    return this.prisma.userLesson.upsert({
      where: { userCourseId_lessonId: { userCourseId, lessonId } },
      create: { userCourseId, lessonId, userId: userCourse.userId, state },
      update: { state },
    });
  }

  async setModuleState(
    userCourseId: number,
    moduleId: number,
    state: ProgressState,
  ) {
    if (!(await this.prisma.userCourse.findFirst({ where: { id: userCourseId, ...this.access.ownedScope() }, select: { id: true } }))) throw new NotFoundException("Запись не найдена");
    const userCourse = await this.prisma.userCourse.findUnique({
      where: { id: userCourseId },
    });
    if (!userCourse) throw new NotFoundException("Запись на курс не найдена");

    if (
      !(await this.prisma.courseModule.findFirst({
        where: { id: moduleId, courseId: userCourse.courseId },
        select: { id: true },
      }))
    )
      throw new NotFoundException("Модуль не принадлежит этому курсу");
    return this.prisma.userModule.upsert({
      where: { userCourseId_moduleId: { userCourseId, moduleId } },
      create: { userCourseId, moduleId, userId: userCourse.userId, state },
      update: { state },
    });
  }

  // Сдача квиза: сохраняем выборы и считаем результат по эталону
  // (правильные варианты помечены correct: true в content ответа)
  async submitQuiz(quizId: number, submission: QuizSubmission) {
    this.access.user(submission.userId);
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { answers: true } } },
    });
    if (!quiz) throw new NotFoundException("Квиз не найден");
    if (
      new Set(submission.answers.map((a) => a.quizQuestionId)).size !==
        submission.answers.length ||
      submission.answers.some((a) => {
        const q = quiz.questions.find((q) => q.id === a.quizQuestionId);
        return (
          !q ||
          new Set(a.quizAnswerIds).size !== a.quizAnswerIds.length ||
          a.quizAnswerIds.some(
            (id) => !q.answers.some((answer) => answer.id === id),
          )
        );
      })
    )
      throw new NotFoundException(
        "Вопросы и ответы не принадлежат этому квизу",
      );

    let correct = 0;
    for (const q of quiz.questions) {
      const picked = submission.answers.find((a) => a.quizQuestionId === q.id);
      const correctIds = q.answers
        .filter(
          (a) => (a.content as { correct?: boolean } | null)?.correct === true,
        )
        .map((a) => a.id)
        .sort();
      const pickedIds = [...(picked?.quizAnswerIds ?? [])].sort();
      if (
        correctIds.length > 0 &&
        correctIds.length === pickedIds.length &&
        correctIds.every((id, i) => id === pickedIds[i])
      ) {
        correct++;
      }
    }
    const result = {
      correct,
      total: quiz.questions.length,
      passed:
        quiz.questions.length > 0 && correct / quiz.questions.length >= 0.7,
    };

    const userQuiz = await this.prisma.userQuiz.create({
      data: {
        quizId,
        userId: submission.userId,
        result,
        userQuizQuestions: {
          create: submission.answers.map((a) => ({
            quizQuestionId: a.quizQuestionId,
            pickedValue:
              a.value === undefined ? a.quizAnswerIds : (a.value as object),
            userQuizAnswers: {
              create: a.quizAnswerIds.map((quizAnswerId) => ({
                quizAnswerId,
                isPicked: true,
              })),
            },
          })),
        },
      },
      include: { userQuizQuestions: { include: { userQuizAnswers: true } } },
    });

    return userQuiz;
  }
}
