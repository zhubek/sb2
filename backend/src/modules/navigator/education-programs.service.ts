import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../platform/database/prisma.service";
import { Prisma } from "../../../generated/prisma";
@Injectable()
export class EducationProgramsService {
  constructor(private readonly prisma: PrismaService) {}
  async status() {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      state: "ready",
      count: await this.prisma.institutionProgram.count({
        where: { contentKey: { not: null } },
      }),
      storage: "postgresql",
    };
  }
  async list(q?: string, institutionId?: number, page = 1, pageSize = 30) {
    page = Math.max(1, Math.floor(page) || 1);
    pageSize = Math.min(100, Math.max(1, Math.floor(pageSize) || 30));
    const where: Prisma.InstitutionProgramWhereInput = {
      contentKey: { not: null },
      institution:
        institutionId === undefined ? undefined : { extId: institutionId },
      OR: q
        ? [
            { opName: { contains: q, mode: "insensitive" } },
            { opCode: { contains: q, mode: "insensitive" } },
            { institution: { name: { contains: q, mode: "insensitive" } } },
          ]
        : undefined,
    };
    const [total, items] = await this.prisma.$transaction([
      this.prisma.institutionProgram.count({ where }),
      this.prisma.institutionProgram.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ opName: "asc" }, { id: "asc" }],
        include: {
          institution: {
            select: { id: true, extId: true, name: true, city: true },
          },
          program: { select: { code: true, name: true, level: true } },
        },
      }),
    ]);
    return { total, items, page, pageSize };
  }
  get(key: string) {
    return this.prisma.institutionProgram.findUnique({
      where: { contentKey: key },
      include: { institution: true, program: true },
    });
  }
}
