import { ProfilePolicy } from "./policies/profile.policy";
import { Module } from "@nestjs/common";
import { ProfileQueries } from "./queries/profile.queries";
import { ProfileUseCases } from "./use-cases/profile.use-cases";

@Module({
  providers: [ProfilePolicy, ProfileQueries, ProfileUseCases],
  exports: [ProfileQueries, ProfileUseCases],
})
export class ProfileModule {}
