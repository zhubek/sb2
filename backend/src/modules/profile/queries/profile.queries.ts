import { ProfilePolicy } from "../policies/profile.policy";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../platform/database/prisma.service";
import {
  CreateCityDto,
  CreateDiplomaDto,
  CreateOrganizationDto,
  CreateRegionDto,
  CreateUserDto,
  UpdateUserDto,
} from ".././dto";

@Injectable()
export class ProfileQueries {
  constructor(
    private prisma: PrismaService,
    private readonly access: ProfilePolicy,
  ) {}

  // ── Users ──────────────────────────────────────────────────────────────
  users() {
    this.access.admin();
    return this.prisma.user.findMany({
      include: { organization: { select: { id: true, name: true } } },
    });
  }

  async user(id: number) {
    this.access.user(id);
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { organization: {include:{city:{include:{region:true}}}}, diplomas: true },
    });
    if (!user) throw new NotFoundException("Пользователь не найден");
    return user;
  }

  // Идемпотентно: повторный POST с той же почтой возвращает существующего
  // пользователя (используется фронтендом при каждом входе через Auth.js)
  organizations() {
    this.access.admin();
    return this.prisma.organization.findMany({
      include: {
        city: { include: { region: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async organization(id: number) {
    this.access.organization(id);
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        city: { include: { region: true } },
        owner: true,
        admins: { include: { user: true } },
      },
    });
    if (!org) throw new NotFoundException("Организация не найдена");
    return org;
  }

  regions() {
    return this.prisma.region.findMany({ include: { cities: true } });
  }

  diplomas(userId: number) {
    this.access.user(userId);
    return this.prisma.diploma.findMany({
      where: { userId },
      orderBy: { uploaded: "desc" },
    });
  }
}
