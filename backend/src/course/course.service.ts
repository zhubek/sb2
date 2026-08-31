import { Injectable, NotFoundException } from "@nestjs/common";
import { ProgressState } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export interface QuizSubmission {
  userId: number;
  answers: { quizQuestionId: number; quizAnswerIds: number[]; value?: unknown }[];
}

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  manuals() {
    return this.prisma.manual.findMany();
  }

  async manual(id: number) {
    const manual = await this.prisma.manual.findUnique({ where: { id } });
    if (!manual) throw new NotFoundException("Руководство не найдено");
    return manual;
  }

  courses() {
    return this.prisma.course.findMany({
      include: { _count: { select: { modules: true } } },
    });
  }

  async course(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
            quizzes: {
              include: {
                questions: {
                  orderBy: { order: "asc" },
                  include: { answers: { orderBy: { order: "asc" } } },
                },
              },
            },
          },
        },
      },
    });
    if (!course) throw new NotFoundException("Курс не найден");
    return course;
  }

  enroll(courseId: number, userId: number) {
    return this.prisma.userCourse.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId },
      update: {},
    });
  }

  userCourses(userId: number) {
    return this.prisma.userCourse.findMany({
      where: { userId },
      include: {
        course: { select: { id: true, title: true } },
        userModules: true,
        userLessons: true,
      },
    });
  }

  async setLessonState(
    userCourseId: number,
    lessonId: number,
    state: ProgressState
  ) {
    const userCourse = await this.prisma.userCourse.findUnique({
      where: { id: userCourseId },
    });
    if (!userCourse) throw new NotFoundException("Запись на курс не найдена");

    return this.prisma.userLesson.upsert({
      where: { userCourseId_lessonId: { userCourseId, lessonId } },
      create: { userCourseId, lessonId, userId: userCourse.userId, state },
      update: { state },
    });
  }

  async setModuleState(
    userCourseId: number,
    moduleId: number,
    state: ProgressState
  ) {
    const userCourse = await this.prisma.userCourse.findUnique({
      where: { id: userCourseId },
    });
    if (!userCourse) throw new NotFoundException("Запись на курс не найдена");

    return this.prisma.userModule.upsert({
      where: { userCourseId_moduleId: { userCourseId, moduleId } },
      create: { userCourseId, moduleId, userId: userCourse.userId, state },
      update: { state },
    });
  }

  // Сдача квиза: сохраняем выборы и считаем результат по эталону
  // (правильные варианты помечены correct: true в content ответа)
  async submitQuiz(quizId: number, submission: QuizSubmission) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { answers: true } } },
    });
    if (!quiz) throw new NotFoundException("Квиз не найден");

    let correct = 0;
    for (const q of quiz.questions) {
      const picked = submission.answers.find(
        (a) => a.quizQuestionId === q.id
      );
      const correctIds = q.answers
        .filter(
          (a) => (a.content as { correct?: boolean } | null)?.correct === true
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
      passed: quiz.questions.length > 0 && correct / quiz.questions.length >= 0.7,
    };

    const userQuiz = await this.prisma.userQuiz.create({
      data: {
        quizId,
        userId: submission.userId,
        result,
        userQuizQuestions: {
          create: submission.answers.map((a) => ({
            quizQuestionId: a.quizQuestionId,
            pickedValue: a.value === undefined ? a.quizAnswerIds : (a.value as object),
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

  userQuizzes(userId: number) {
    return this.prisma.userQuiz.findMany({
      where: { userId },
      orderBy: { takenTime: "desc" },
    });
  }
}
