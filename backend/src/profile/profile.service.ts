import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateCityDto,
  CreateDiplomaDto,
  CreateOrganizationDto,
  CreateRegionDto,
  CreateUserDto,
  UpdateUserDto,
} from "./dto";

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  // ── Users ──────────────────────────────────────────────────────────────
  users() {
    return this.prisma.user.findMany({
      include: { organization: { select: { id: true, name: true } } },
    });
  }

  async user(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { organization: true, diplomas: true },
    });
    if (!user) throw new NotFoundException("Пользователь не найден");
    return user;
  }

  // Идемпотентно: повторный POST с той же почтой возвращает существующего
  // пользователя (используется фронтендом при каждом входе через Auth.js)
  createUser(dto: CreateUserDto) {
    return this.prisma.user.upsert({
      where: { email: dto.email },
      create: { ...dto, surname: dto.surname ?? "" },
      update: {},
    });
  }

  updateUser(id: number, dto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  // ── Organizations ──────────────────────────────────────────────────────
  organizations() {
    return this.prisma.organization.findMany({
      include: {
        city: { include: { region: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async organization(id: number) {
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

  createOrganization(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: dto });
  }

  addAdmin(organizationId: number, userId: number) {
    return this.prisma.organizationAdmin.create({
      data: { organizationId, userId },
    });
  }

  // ── Geo ────────────────────────────────────────────────────────────────
  regions() {
    return this.prisma.region.findMany({ include: { cities: true } });
  }

  createRegion(dto: CreateRegionDto) {
    return this.prisma.region.create({ data: dto });
  }

  createCity(dto: CreateCityDto) {
    return this.prisma.city.create({ data: dto });
  }

  // ── Diplomas ───────────────────────────────────────────────────────────
  diplomas(userId: number) {
    return this.prisma.diploma.findMany({
      where: { userId },
      orderBy: { uploaded: "desc" },
    });
  }

  addDiploma(userId: number, dto: CreateDiplomaDto) {
    return this.prisma.diploma.create({ data: { ...dto, userId } });
  }

  removeDiploma(id: number) {
    return this.prisma.diploma.delete({ where: { id } });
  }
}
