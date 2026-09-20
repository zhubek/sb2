import { EducationProgramsService } from "./education-programs.service";
import { PublishEducationProgram } from "./publish-education-program.use-case";
import { Module } from "@nestjs/common";
import { NavigatorQueries } from "./queries/navigator.queries";

@Module({
  providers: [
    NavigatorQueries,
    EducationProgramsService,
    PublishEducationProgram,
  ],
  exports: [
    NavigatorQueries,
    EducationProgramsService,
    PublishEducationProgram,
  ],
})
export class NavigatorModule {}
