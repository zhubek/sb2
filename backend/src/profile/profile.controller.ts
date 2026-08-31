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
} from "./dto";
import { ProfileService } from "./profile.service";

@ApiTags("profile")
@Controller()
export class ProfileController {
  constructor(private profile: ProfileService) {}

  @Get("users")
  users() {
    return this.profile.users();
  }

  @Get("users/:id")
  user(@Param("id", ParseIntPipe) id: number) {
    return this.profile.user(id);
  }

  @Post("users")
  createUser(@Body() dto: CreateUserDto) {
    return this.profile.createUser(dto);
  }

  @Patch("users/:id")
  updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto
  ) {
    return this.profile.updateUser(id, dto);
  }

  @Get("organizations")
  organizations() {
    return this.profile.organizations();
  }

  @Get("organizations/:id")
  organization(@Param("id", ParseIntPipe) id: number) {
    return this.profile.organization(id);
  }

  @Post("organizations")
  createOrganization(@Body() dto: CreateOrganizationDto) {
    return this.profile.createOrganization(dto);
  }

  @Post("organizations/:id/admins")
  addAdmin(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AddOrgAdminDto
  ) {
    return this.profile.addAdmin(id, dto.userId);
  }

  @Get("regions")
  regions() {
    return this.profile.regions();
  }

  @Post("regions")
  createRegion(@Body() dto: CreateRegionDto) {
    return this.profile.createRegion(dto);
  }

  @Post("cities")
  createCity(@Body() dto: CreateCityDto) {
    return this.profile.createCity(dto);
  }

  @Get("users/:id/diplomas")
  diplomas(@Param("id", ParseIntPipe) id: number) {
    return this.profile.diplomas(id);
  }

  @Post("users/:id/diplomas")
  addDiploma(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateDiplomaDto
  ) {
    return this.profile.addDiploma(id, dto);
  }

  @Delete("diplomas/:id")
  removeDiploma(@Param("id", ParseIntPipe) id: number) {
    return this.profile.removeDiploma(id);
  }
}
