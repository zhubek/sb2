import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../../../generated/prisma";

@Injectable()
export class PublishEducationProgram {
  // Content owns the transaction and authorization; this participant never commits separately.
  async inTransaction(
    tx: Prisma.TransactionClient,
    id: string,
    value: unknown,
    revision: number,
  ) {
    if (!id.startsWith("program.")) return;
    const p = value as {
      institutionId: number;
      code: string;
      name: string;
      groupCode: string;
      price: number | null;
      threshold: number | null;
      language: string;
      duration: number | null;
      exams: string[];
    };
    const institution = await tx.institution.findFirst({
      where: { extId: p.institutionId },
    });
    if (!institution)
      throw new NotFoundException("Учебное заведение не найдено");
    const groupCode = /^B\d+$/.test(p.groupCode) ? p.groupCode : p.code;
    const program = await tx.program.upsert({
      where: { code: groupCode },
      create: {
        code: groupCode,
        name: p.name,
        level: institution.type === "COLLEGE" ? "COLLEGE" : "BACHELOR",
      },
      update: {},
    });
    const data = {
      contentRevision: revision,
      institutionId: institution.id,
      programId: program.id,
      opCode: p.code,
      opName: p.name,
      price: p.price,
      threshold: p.threshold,
      languages: p.language || null,
      duration: p.duration,
      exams: p.exams,
    };
    const existing = await tx.institutionProgram.findFirst({
      where: {
        OR: [
          { contentKey: id },
          {
            contentKey: null,
            institutionId: institution.id,
            opCode: p.code,
            opName: p.name,
          },
          {
            contentKey: null,
            institutionId: institution.id,
            programId: program.id,
            opCode: null,
          },
        ],
      },
      orderBy: { contentKey: "desc" },
    });
    if (existing)
      await tx.institutionProgram.update({
        where: { id: existing.id },
        data: { ...data, contentKey: id },
      });
    else
      await tx.institutionProgram.create({ data: { ...data, contentKey: id } });
  }
}
