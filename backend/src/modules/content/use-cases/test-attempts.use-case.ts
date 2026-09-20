import { envelope, translated } from "../domain/localization";
import type { Json } from "../domain/types";
import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma";
import { PrismaService } from "../../../platform/database/prisma.service";
import type { Actor } from "../../auth/actor-context.service";
import { requireAttemptOwner } from "../policies/content.policy";
import { validAnswer } from "../domain/questions";
import type { TestContent } from "../domain/types";
import { canonical } from "./edit-content.use-case";

@Injectable()
export class ContentTestAttempts {
  constructor(private readonly prisma: PrismaService) {}
  async list(actor: Actor | null) {
    requireAttemptOwner(actor);
    return this.prisma.contentTestAttempt.findMany({
      where: { ownerKey: actor.ownerKey },
      orderBy: [{ at: "desc" }, { id: "desc" }],
      take: 200,
      select: {
        id: true,
        slug: true,
        name: true,
        at: true,
        values: true,
        snapshot: true,
        summary: true,
      },
    });
  }
  async save(
    actor: Actor | null,
    input: any,
  ): Promise<{ id: string; at: Date }> {
    requireAttemptOwner(actor);
    const snapshot = input?.snapshot as TestContent,
      values = input?.values;
    if (
      !snapshot ||
      !["debruce", "mbti", "holland"].includes(snapshot.slug) ||
      !Array.isArray(values)
    )
      throw new UnprocessableEntityException("Некорректные ответы");
    const d = await this.prisma.contentDocument.findUnique({
      where: { id: `test.${snapshot.slug}` },
      include: { history: { where: { action: "publish" }, take: 30 } },
    });
    const translations = await this.prisma.contentDocument.findMany({
      where: { id: { in: [`i18n.kk.test.${snapshot.slug}`, `i18n.en.test.${snapshot.slug}`] } },
      include: { history: { where: { action: 'publish' }, take: 30 } },
    });
    const translatedSnapshots = translations.flatMap(t => [t.published, ...t.history.map(h => h.value)]).filter(envelope).flatMap(t => [t.value, ...(d ? [translated((d.published ?? d.defaultValue) as Json, t.source, t.value)] : [])]);
    if (
      !d ||
      ![d.defaultValue, d.published, ...d.history.map((h) => h.value), ...translatedSnapshots].some(
        (v) => v && canonical(v) === canonical(snapshot),
      )
    )
      throw new ConflictException(
        "Версия теста больше недоступна. Обновите страницу.",
      );
    const questions = snapshot.sections.flatMap((s) => s.questions);
    if (
      values.length !== questions.length ||
      questions.some((q, i) => !validAnswer(q, values[i], snapshot.scale))
    )
      throw new UnprocessableEntityException("Ответьте на все вопросы теста");
    const requestKey =
      typeof input.requestKey === "string" &&
      /^[a-zA-Z0-9-]{10,100}$/.test(input.requestKey)
        ? input.requestKey
        : undefined;
    const data = {
      ownerKey: actor.ownerKey,
      slug: snapshot.slug,
      name: snapshot.name,
      values: values as Prisma.InputJsonValue,
      snapshot: snapshot as unknown as Prisma.InputJsonValue,
      summary: `Ответы сохранены · ${values.length} вопросов`,
      requestKey,
    };
    if (!requestKey)
      return this.prisma.contentTestAttempt.create({
        data,
        select: { id: true, at: true },
      });
    const existing = await this.prisma.contentTestAttempt.findUnique({
      where: { ownerKey_requestKey: { ownerKey: actor.ownerKey, requestKey } },
    });
    if (existing) {
      if (
        canonical(existing.values) !== canonical(values) ||
        canonical(existing.snapshot) !== canonical(snapshot)
      )
        throw new ConflictException("Ключ запроса уже использован");
      return { id: existing.id, at: existing.at };
    }
    try {
      return await this.prisma.contentTestAttempt.create({
        data,
        select: { id: true, at: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        return this.save(actor, input);
      throw error;
    }
  }
}
