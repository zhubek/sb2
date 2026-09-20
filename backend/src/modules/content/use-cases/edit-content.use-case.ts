import { isLocale, translationId, translationKey, translated, envelope, translationErrors } from "../domain/localization";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma, ContentDocument } from "../../../../generated/prisma";
import { PrismaService } from "../../../platform/database/prisma.service";
import type { Actor } from "../../auth/actor-context.service";
import { PublishEducationProgram } from "../../navigator/publish-education-program.use-case";
import { requireContentAdmin } from "../policies/content.policy";
import { validateDocument } from "../domain/validation";
import type { ContentDocument as Definition, Json } from "../domain/types";
import { definition, entry } from "../queries/content.queries";

export type EditContentInput = {
  id: string;
  locale?: string;
  revision: number;
  action: string;
  value?: Json;
  historyId?: string;
};
export function canonical(value: unknown): string {
  return JSON.stringify(value, (_, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map((k) => [k, v[k]]),
        )
      : v,
  );
}
export function searchText(
  d: { id: string; title: string; description: string },
  value: unknown,
) {
  return `${d.id} ${d.title} ${d.description} ${JSON.stringify(value)}`;
}
@Injectable()
export class EditContent {
  constructor(
    private readonly prisma: PrismaService,
    private readonly programs: PublishEducationProgram,
  ) {}
  async execute(
    actor: Actor | null,
    input: EditContentInput,
    requestId: string,
  ) {
    requireContentAdmin(actor);
    const locale = input.locale ?? "ru";
    if (!isLocale(locale) || input.id.startsWith("i18n.")) throw new BadRequestException("Unsupported language or material");
    const storageId = translationId(input.id, locale);
    if (
      !["save", "publish", "restore"].includes(input.action) ||
      !Number.isSafeInteger(input.revision) ||
      input.revision < 0
    )
      throw new BadRequestException("Некорректное действие или версия");
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          let d = await tx.contentDocument.findUnique({ where: { id: storageId } });
          const base = await tx.contentDocument.findUnique({ where: { id: input.id } });
          if (!base) throw new NotFoundException("Material not found");
          if (!d && locale !== 'ru') d = await this.createTranslation(tx, storageId);
          if (!d) throw new NotFoundException("Material not found");
          let value: any =
            input.action === "restore"
              ? (
                  await tx.contentRevision.findFirst({
                    where: { id: input.historyId ?? "", documentId: storageId },
                  })
                )?.value
              : input.value;
          if (value === undefined)
            throw new NotFoundException("Версия не найдена");
          if (locale !== 'ru') {
            const source = (base.published ?? base.defaultValue) as Json;
            value = { source, value: input.action === 'restore' && envelope(value) ? translated(source, value.source, value.value) : value };
          }
          const result = await this.write(
            tx,
            actor,
            d,
            value,
            input.revision,
            input.action,
            requestId,
          );
          if (locale !== 'ru') {
            const source = (base.published ?? base.defaultValue) as Json;
            return { ...result, draft: envelope(result.draft) ? translated(source, result.draft.source, result.draft.value) : source, published: envelope(result.published) ? translated(source, result.published.source, result.published.value) : source };
          }
          return result;
        },
        { timeout: 15000, isolationLevel: "Serializable" },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        ["P2034", "P2002"].includes(error.code)
      )
        throw new ConflictException(
          "Материал изменён. Загрузите актуальную версию.",
        );
      throw error;
    }
  }
  private async createTranslation(tx: Prisma.TransactionClient, id: string) {
    const key = translationKey(id);
    if (!key || key.id.startsWith('i18n.')) throw new BadRequestException('Invalid translation');
    const base = await tx.contentDocument.findUnique({ where: { id: key.id } });
    if (!base) throw new NotFoundException('Material not found');
    const source = base.published ?? base.defaultValue;
    return tx.contentDocument.create({ data: { id, title: base.title, description: base.description, group: base.group, kind: "translation", preview: base.preview, defaultValue: { source, value: source } as Prisma.InputJsonValue, searchText: '', dirty: true } });
  }
  private async write(
    tx: Prisma.TransactionClient,
    actor: Actor,
    d: ContentDocument,
    value: unknown,
    revision: number,
    action: string,
    requestId: string,
  ) {
    if (value === undefined)
      throw new UnprocessableEntityException("Материал не содержит значения");
    if (Buffer.byteLength(JSON.stringify(value)) > 3000000)
      throw new BadRequestException("Материал больше 3 МБ");
    const key = translationKey(d.id);
    let errors: string[];
    if (key) {
      const base = await tx.contentDocument.findUniqueOrThrow({ where: { id: key.id } });
      if (!envelope(value)) throw new BadRequestException('Invalid translation');
      errors = translationErrors(value.source, value.value).length ? ['Only text can be translated. Edit shared data in Russian.'] : [];
      errors.push(...validateDocument({ ...definition(base), value: value.source } as Definition, value.value));
    } else errors = validateDocument(definition(d) as Definition, value as Json);
    if (errors.length)
      throw new UnprocessableEntityException(errors.join("\n"));
    const now = new Date(),
      publish = action === "publish";
    const updated = await tx.contentDocument.updateMany({
      where: { id: d.id, revision },
      data: {
        draft: value as Prisma.InputJsonValue,
        revision: { increment: 1 },
        updatedAt: now,
        searchText: searchText(d, value),
        dirty:
          !publish &&
          canonical(value) !== canonical(d.published ?? d.defaultValue),
        ...(publish
          ? {
              published: value as Prisma.InputJsonValue,
              publishedAt: now,
              publishedRevision: revision + 1,
            }
          : {}),
      },
    });
    if (updated.count !== 1)
      throw new ConflictException(
        "Материал изменён в другой вкладке. Скопируйте свои правки и загрузите актуальную версию.",
      );
    if (d.revision === 0)
      await tx.contentRevision.create({
        data: {
          documentId: d.id,
          title: d.title,
          action: "publish",
          value: d.defaultValue as Prisma.InputJsonValue,
          at: new Date(now.getTime() - 1),
        },
      });
    await tx.contentRevision.create({
      data: {
        documentId: d.id,
        title: d.title,
        action,
        value: value as Prisma.InputJsonValue,
        at: now,
      },
    });
    await tx.contentAudit.create({
      data: {
        documentId: d.id,
        actorId: actor.id,
        action,
        revision: revision + 1,
        requestId,
      },
    });
    if (publish)
      await this.programs.inTransaction(tx, d.id, value, revision + 1);
    const old = await tx.contentRevision.findMany({
      where: { documentId: d.id },
      orderBy: [{ at: "desc" }, { id: "desc" }],
      skip: 30,
      select: { id: true },
    });
    if (old.length)
      await tx.contentRevision.deleteMany({
        where: { id: { in: old.map((h) => h.id) } },
      });
    return entry(
      await tx.contentDocument.findUniqueOrThrow({ where: { id: d.id } }),
    );
  }
  async importBackup(actor: Actor | null, backup: any, requestId: string) {
    requireContentAdmin(actor);
    if (
      backup?.version !== 1 ||
      !backup.entries ||
      typeof backup.entries !== "object" ||
      Array.isArray(backup.entries)
    )
      throw new BadRequestException("Это не резервная копия контента");
    const entries = Object.entries(backup.entries).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    if (entries.length > 45000)
      throw new BadRequestException("Слишком много материалов");
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          for (const [id, e] of entries) {
            let d = await tx.contentDocument.findUnique({ where: { id } });
            if (!d && translationKey(id)) d = await this.createTranslation(tx, id);
            if (!d)
              throw new UnprocessableEntityException(
                `Неизвестный материал: ${id}`,
              );
            const v = e as any;
            await this.write(
              tx,
              actor,
              d,
              v?.draft ?? v?.published,
              d.revision,
              "restore",
              requestId,
            );
          }
          return { count: entries.length };
        },
        { isolationLevel: "Serializable", timeout: 60000 },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        ["P2034", "P2002"].includes(error.code)
      )
        throw new ConflictException(
          "Во время импорта контент изменился. Повторите импорт.",
        );
      throw error;
    }
  }
}
