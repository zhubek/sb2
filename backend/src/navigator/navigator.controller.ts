import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InstitutionType, ProgramLevel } from "@prisma/client";
import { NavigatorService } from "./navigator.service";

@ApiTags("navigator")
@Controller("navigator")
export class NavigatorController {
  constructor(private nav: NavigatorService) {}

  @Get("industries")
  industries() {
    return this.nav.industries();
  }

  @Get("institutions")
  institutions(
    @Query("type") type?: InstitutionType,
    @Query("city") city?: string,
    @Query("q") q?: string,
    @Query("dorm") dorm?: string,
    @Query("maxPrice") maxPrice?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ) {
    return this.nav.institutions({
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
    return this.nav.institution(id);
  }

  @Get("programs")
  programs(
    @Query("level") level?: ProgramLevel,
    @Query("q") q?: string,
    @Query("industryId") industryId?: string
  ) {
    return this.nav.programs(
      level,
      q,
      industryId ? Number(industryId) : undefined
    );
  }

  @Get("programs/:code")
  program(@Param("code") code: string) {
    return this.nav.program(code);
  }
}
