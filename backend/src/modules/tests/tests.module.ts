import { TestsPolicy } from "./policies/tests.policy";
import { Module } from "@nestjs/common";
import { TestsQueries } from "./queries/tests.queries";
import { TestsUseCases } from "./use-cases/tests.use-cases";

@Module({
  providers: [TestsPolicy, TestsQueries, TestsUseCases],
  exports: [TestsQueries, TestsUseCases],
})
export class TestsModule {}
