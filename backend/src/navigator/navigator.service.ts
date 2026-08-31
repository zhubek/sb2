import { Injectable, NotFoundException } from "@nestjs/common";
import { InstitutionType, Prisma, ProgramLevel } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export interface InstitutionFilters {
  type?: InstitutionType;
  city?: string;
  q?: string;
  dorm?: boolean;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class NavigatorService {
  constructor(private prisma: PrismaService) {}

  industries() {
    return this.prisma.industry.findMany({
      include: { _count: { select: { programs: true } } },
      orderBy: { id: "asc" },
    });
  }

  async institutions(f: InstitutionFilters) {
    const where: Prisma.InstitutionWhereInput = {
      type: f.type,
      city: f.city ? { equals: f.city, mode: "insensitive" } : undefined,
      name: f.q ? { contains: f.q, mode: "insensitive" } : undefined,
      dorm: f.dorm,
      price: f.maxPrice ? { lte: f.maxPrice } : undefined,
    };
    const page = Math.max(1, f.page ?? 1);
    const pageSize = Math.min(100, f.pageSize ?? 30);
    const [total, items] = await this.prisma.$transaction([
      this.prisma.institution.count({ where }),
      this.prisma.institution.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { _count: { select: { programs: true } } },
      }),
    ]);
    return { total, page, pageSize, items };
  }

  async institution(id: number) {
    const inst = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        programs: {
          include: { program: { include: { industry: true } } },
        },
      },
    });
    if (!inst) throw new NotFoundException("Учебное заведение не найдено");
    return inst;
  }

  programs(level?: ProgramLevel, q?: string, industryId?: number) {
    return this.prisma.program.findMany({
      where: {
        level,
        industryId,
        OR: q
          ? [
              { name: { contains: q, mode: "insensitive" } },
              { code: { contains: q, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: {
        industry: { select: { id: true, name: true, short: true } },
        _count: { select: { institutions: true } },
      },
      orderBy: { code: "asc" },
    });
  }

  async program(code: string) {
    const program = await this.prisma.program.findUnique({
      where: { code },
      include: {
        industry: true,
        institutions: {
          include: {
            institution: {
              select: { id: true, name: true, type: true, city: true },
            },
          },
        },
      },
    });
    if (!program) throw new NotFoundException("Программа не найдена");
    return program;
  }
}
