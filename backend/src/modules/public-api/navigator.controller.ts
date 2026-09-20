import { EducationProgramsService } from "../navigator/education-programs.service";
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InstitutionType, ProgramLevel } from "../../../generated/prisma";
import { NavigatorQueries } from "../navigator/queries/navigator.queries";

@ApiTags("navigator")
@Controller("navigator")
export class NavigatorController {
  constructor(
    private navQueries: NavigatorQueries,
    private education: EducationProgramsService,
  ) {}

  @Get("education-programs/status")
  educationStatus() {
    return this.education.status();
  }
  @Get("education-programs")
  educationPrograms(
    @Query("q") q?: string,
    @Query("institutionId") institutionId?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ) {
    for (const value of [institutionId, page, pageSize])
      if (
        value !== undefined &&
        (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)))
      )
        throw new BadRequestException(
          "Параметры страницы и заведения должны быть целыми числами",
        );
    return this.education.list(
      q,
      institutionId === undefined ? undefined : Number(institutionId),
      Number(page) || 1,
      Number(pageSize) || 30,
    );
  }
  @Get("education-programs/:key")
  async educationProgram(@Param("key") key: string) {
    const program = await this.education.get(key);
    if (!program)
      throw new NotFoundException("Образовательная программа не найдена");
    return program;
  }

  @Get("industries")
  industries() {
    return this.navQueries.industries();
  }

  @Get("institutions")
  institutions(
    @Query("type") type?: InstitutionType,
    @Query("city") city?: string,
    @Query("q") q?: string,
    @Query("dorm") dorm?: string,
    @Query("maxPrice") maxPrice?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ) {
    return this.navQueries.institutions({
      type,
      city,
      q,
      dorm: dorm === undefined ? undefined : dorm === "true",
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Get("institutions/:id")
  institution(@Param("id", ParseIntPipe) id: number) {
    return this.navQueries.institution(id);
  }

  @Get("programs")
  programs(
    @Query("level") level?: ProgramLevel,
    @Query("q") q?: string,
    @Query("industryId") industryId?: string,
  ) {
    return this.navQueries.programs(
      level,
      q,
      industryId ? Number(industryId) : undefined,
    );
  }

  @Get("programs/:code")
  program(@Param("code") code: string) {
    return this.navQueries.program(code);
  }
}
