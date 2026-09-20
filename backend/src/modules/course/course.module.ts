import { CoursePolicy } from "./policies/course.policy";
import { Module } from "@nestjs/common";
import { CourseQueries } from "./queries/course.queries";
import { CourseUseCases } from "./use-cases/course.use-cases";

@Module({
  providers: [CoursePolicy, CourseQueries, CourseUseCases],
  exports: [CourseQueries, CourseUseCases],
})
export class CourseModule {}
