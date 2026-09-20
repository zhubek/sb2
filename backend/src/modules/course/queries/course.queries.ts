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
export class CourseQueries {
  constructor(
    private prisma: PrismaService,
    private readonly access: CoursePolicy,
  ) {}

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

  userCourses(userId: number) {
    this.access.user(userId);
    return this.prisma.userCourse.findMany({
      where: { userId },
      include: {
        course: { select: { id: true, title: true } },
        userModules: true,
        userLessons: true,
      },
    });
  }

  userQuizzes(userId: number) {
    this.access.user(userId);
    return this.prisma.userQuiz.findMany({
      where: { userId },
      orderBy: { takenTime: "desc" },
    });
  }
}
