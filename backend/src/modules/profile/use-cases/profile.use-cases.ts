import { ProfilePolicy } from "../policies/profile.policy";
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
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
export class ProfileUseCases {
  constructor(
    private prisma: PrismaService,
    private readonly access: ProfilePolicy,
  ) {}

  // ── Users ──────────────────────────────────────────────────────────────
  async createUser(dto: CreateUserDto) {
    const provisionRole = this.access.provision(dto.email);
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email }, include: { credential: true } });
    if (existing && (existing.credential || existing.role !== "STUDENT"))
      throw new ForbiddenException("Используйте вход по паролю");
    return this.prisma.user.upsert({
      where: { email: dto.email },
      create: {
        email: dto.email,
        name: dto.name,
        surname: dto.surname ?? "",
        role: provisionRole,
      },
      update: {},
    });
  }

  updateUser(id: number, dto: UpdateUserDto) {
    this.access.user(id);
    if (dto.organizationId !== undefined) this.access.admin();
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  // ── Organizations ──────────────────────────────────────────────────────
  createOrganization(dto: CreateOrganizationDto) {
    this.access.admin();
    return this.prisma.organization.create({ data: dto });
  }

  addAdmin(organizationId: number, userId: number) {
    this.access.admin();
    return this.prisma.organizationAdmin.create({
      data: { organizationId, userId },
    });
  }

  // ── Geo ────────────────────────────────────────────────────────────────
  createRegion(dto: CreateRegionDto) {
    this.access.admin();
    return this.prisma.region.create({ data: dto });
  }

  createCity(dto: CreateCityDto) {
    this.access.admin();
    return this.prisma.city.create({ data: dto });
  }

  // ── Diplomas ───────────────────────────────────────────────────────────
  addDiploma(userId: number, dto: CreateDiplomaDto) {
    this.access.user(userId);
    return this.prisma.diploma.create({ data: { ...dto, userId } });
  }

  async removeDiploma(id: number) {
    if (!(await this.prisma.diploma.findFirst({ where: { id: id, ...this.access.ownedScope() }, select: { id: true } }))) throw new NotFoundException("Запись не найдена");
    return this.prisma.diploma.delete({ where: { id } });
  }
}
