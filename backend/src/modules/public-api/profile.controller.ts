import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  AddOrgAdminDto,
  CreateCityDto,
  CreateDiplomaDto,
  CreateOrganizationDto,
  CreateRegionDto,
  CreateUserDto,
  UpdateUserDto,
} from "../profile/dto";
import { ProfileQueries } from "../profile/queries/profile.queries";
import { ProfileUseCases } from "../profile/use-cases/profile.use-cases";

@ApiTags("profile")
@Controller()
export class ProfileController {
  constructor(
    private profileQueries: ProfileQueries,
    private profileUseCases: ProfileUseCases,
  ) {}

  @Get("users")
  users() {
    return this.profileQueries.users();
  }

  @Get("users/:id")
  user(@Param("id", ParseIntPipe) id: number) {
    return this.profileQueries.user(id);
  }

  @Post("users")
  createUser(@Body() dto: CreateUserDto) {
    return this.profileUseCases.createUser(dto);
  }

  @Patch("users/:id")
  updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.profileUseCases.updateUser(id, dto);
  }

  @Get("organizations")
  organizations() {
    return this.profileQueries.organizations();
  }

  @Get("organizations/:id")
  organization(@Param("id", ParseIntPipe) id: number) {
    return this.profileQueries.organization(id);
  }

  @Post("organizations")
  createOrganization(@Body() dto: CreateOrganizationDto) {
    return this.profileUseCases.createOrganization(dto);
  }

  @Post("organizations/:id/admins")
  addAdmin(@Param("id", ParseIntPipe) id: number, @Body() dto: AddOrgAdminDto) {
    return this.profileUseCases.addAdmin(id, dto.userId);
  }

  @Get("regions")
  regions() {
    return this.profileQueries.regions();
  }

  @Post("regions")
  createRegion(@Body() dto: CreateRegionDto) {
    return this.profileUseCases.createRegion(dto);
  }

  @Post("cities")
  createCity(@Body() dto: CreateCityDto) {
    return this.profileUseCases.createCity(dto);
  }

  @Get("users/:id/diplomas")
  diplomas(@Param("id", ParseIntPipe) id: number) {
    return this.profileQueries.diplomas(id);
  }

  @Post("users/:id/diplomas")
  addDiploma(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateDiplomaDto,
  ) {
    return this.profileUseCases.addDiploma(id, dto);
  }

  @Delete("diplomas/:id")
  removeDiploma(@Param("id", ParseIntPipe) id: number) {
    return this.profileUseCases.removeDiploma(id);
  }
}
