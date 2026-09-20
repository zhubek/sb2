import { isLocale, translationId, translationKey, translated, envelope, landingLanguage } from "../domain/localization";
import type { Json } from "../domain/types";
import { pageCategories, pageCategoryFor, pageCategoryRules } from "../domain/page-categories";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, ContentDocument } from "../../../../generated/prisma";
import { PrismaService } from "../../../platform/database/prisma.service";
import type { Actor } from "../../auth/actor-context.service";
import {
  contentCapabilities,
  requireContentAdmin,
} from "../policies/content.policy";

export function entry(d: ContentDocument) {
  return {
    draft: d.draft ?? undefined,
    published: d.published ?? undefined,
    revision: d.revision,
    updatedAt: d.updatedAt?.toISOString(),
    publishedAt: d.publishedAt?.toISOString(),
  };
}
export function definition(d: ContentDocument) {
  return {
    id: d.id,
    title: d.title,
    description: d.description,
    group: d.group,
    kind: d.kind,
    preview: d.preview,
    value: d.defaultValue,
  };
}
@Injectable()
export class ContentQueries {
  constructor(private readonly prisma: PrismaService) {}
  async publishedValues(locale = "ru") {
    if (!isLocale(locale)) throw new BadRequestException("Unsupported language");
    const rows = await this.prisma.contentDocument.findMany({
      where: { OR: [{ published: { not: Prisma.DbNull } }, { id: { startsWith: 'landing.' } }] },
      select: { id: true, published: true, defaultValue: true },
    });
    const values: Record<string, Json> = Object.fromEntries(rows.filter(d => !d.id.startsWith('i18n.') && d.published !== null).map(d => [d.id, d.published as Json]));
    if (locale !== 'ru') {
      const baseRows = await this.prisma.contentDocument.findMany({ where: { id: { in: rows.map(d => translationKey(d.id)).filter(k => k?.locale === locale).map(k => k!.id) } }, select: { id: true, published: true, defaultValue: true } });
      const bases = new Map(baseRows.map(d => [d.id, d.published ?? d.defaultValue]));
      for (const row of rows) {
        const key = translationKey(row.id);
        if (key?.locale === locale && envelope(row.published) && bases.has(key.id))
          values[key.id] = translated(bases.get(key.id) as Json, row.published.source, row.published.value);
      }
    }
    for (const row of rows.filter(d => d.id.startsWith('landing.'))) {
      const localized = rows.find(d => d.id === translationId(row.id, locale) && d.id !== row.id && d.published !== null);
      values[row.id] = landingLanguage(values[row.id] ?? row.defaultValue as Json, locale, !!localized);
    }
    return values;
  }
  async document(actor: Actor | null, id: string, locale = "ru") {
    requireContentAdmin(actor);
    if (!isLocale(locale) || id.startsWith("i18n.")) throw new BadRequestException("Unsupported language or material");
    const d = await this.prisma.contentDocument.findUnique({
      where: { id },
      include: {
        history: {
          orderBy: [{ at: "desc" }, { id: "desc" }],
          take: 30,
          select: {
            id: true,
            documentId: true,
            title: true,
            action: true,
            at: true,
          },
        },
      },
    });
    if (!d) throw new NotFoundException("Материал не найден");
    const variant = locale === 'ru' ? null : await this.prisma.contentDocument.findUnique({
      where: { id: translationId(id, locale) },
      include: { history: { orderBy: [{ at: 'desc' }, { id: 'desc' }], take: 30, select: { id: true, documentId: true, title: true, action: true, at: true } } },
    });
    const source = (d.published ?? d.defaultValue) as Json;
    const localized = (v: unknown) => envelope(v) ? translated(source, v.source, v.value) : id.startsWith('landing.') ? landingLanguage(source, locale) : source;
    const refs =
      d.group === "catalog"
        ? await this.prisma.contentDocument.findMany({
            where: { id: { startsWith: "institution." } },
            select: { defaultValue: true, draft: true },
          })
        : [];
    const meta =
      d.group === "catalog"
        ? await this.prisma.contentDocument.findUnique({
            where: { id: "nav.meta" },
            select: { draft: true, published: true, defaultValue: true },
          })
        : null;
    const industryValues = (meta?.draft ??
      meta?.published ??
      meta?.defaultValue) as { industries?: { name: string }[] } | undefined;
    return {
      ...definition(d),
      ...entry(d),
      value: d.draft ?? d.published ?? d.defaultValue,
      published: d.published ?? d.defaultValue,
      history: d.history,
      locale,
      source,
      translationPublished: locale === 'ru' || !!variant?.publishedAt,
      ...(locale !== 'ru' ? {
        value: localized(variant?.draft ?? variant?.published),
        published: localized(variant?.published),
        revision: variant?.revision ?? 0,
        updatedAt: variant?.updatedAt?.toISOString(),
        publishedAt: variant?.publishedAt?.toISOString(),
        history: variant?.history ?? [],
      } : {}),
      capabilities: contentCapabilities(actor),
      references:
        d.group === "catalog"
          ? {
              institutions: refs.map((r) => {
                const v = (r.draft ?? r.defaultValue) as {
                  i: number;
                  name: string;
                };
                return { value: v.i, label: v.name };
              }),
              industries: (industryValues?.industries ?? []).map(
                (i, index) => ({ value: index, label: i.name }),
              ),
            }
          : null,
    };
  }
  async list(
    actor: Actor | null,
    filter: {
      q?: string;
      group?: string;
      category?: string;
      pageCategory?: string;
      institutionId?: string;
      filter?: string;
      page?: number;
    } = {},
  ) {
    requireContentAdmin(actor);
    const page = filter.page ?? 1;
    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      page > 100000 ||
      (filter.q?.length ?? 0) > 200
    )
      throw new BadRequestException("Некорректные параметры поиска");
    const rules = filter.pageCategory ? pageCategoryRules(filter.pageCategory) : null;
    if (filter.pageCategory && (filter.group !== "pages" || !rules))
      throw new BadRequestException("Неизвестная категория страниц");
    const prefixWhere = (prefix: string): Prisma.ContentDocumentWhereInput => ({ id: { startsWith: prefix } });
    const categoryWhere: Prisma.ContentDocumentWhereInput | undefined = rules ? {
      ...(rules.include.length ? { OR: rules.include.map(prefixWhere) } : {}),
      ...(rules.exclude.length ? { NOT: { OR: rules.exclude.map(prefixWhere) } } : {}),
    } : undefined;
    const where: Prisma.ContentDocumentWhereInput = {
      NOT: { id: { startsWith: "i18n." } },
      group: filter.group || undefined,
      dirty: filter.filter === "draft" ? true : undefined,
      id: filter.institutionId
        ? { startsWith: `program.${filter.institutionId}.` }
        : filter.category
          ? { startsWith: filter.category + "." }
          : undefined,
      searchText: filter.q
        ? { contains: filter.q, mode: "insensitive" }
        : undefined,
      AND: categoryWhere,
    };
    const [rows, total, groups, categories, drafts, recent, pageRecords] =
      await this.prisma.$transaction([
        this.prisma.contentDocument.findMany({
          where,
          take: 30,
          skip: (page - 1) * 30,
          orderBy: { id: "asc" },
        }),
        this.prisma.contentDocument.count({ where }),
        this.prisma.contentDocument.groupBy({
          where: { NOT: { id: { startsWith: "i18n." } } },
          by: ["group"],
          _count: true,
          orderBy: { group: "asc" },
        }),
        this.prisma.contentDocument.findMany({
          where: { group: "catalog", NOT: { id: { startsWith: "i18n." } } },
          select: { id: true },
        }),
        this.prisma.contentDocument.count({ where: { dirty: true, NOT: { id: { startsWith: "i18n." } } } }),
        this.prisma.contentDocument.findMany({
          where: { updatedAt: { not: null }, NOT: { id: { startsWith: "i18n." } } },
          orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
          take: 5,
        }),
        this.prisma.contentDocument.findMany({
          // Facets reflect search/status across all page categories, not just the selected one.
          where: filter.group === "pages"
            ? { ...where, group: "pages", id: undefined, AND: undefined }
            : { id: { in: [] } },
          select: { id: true },
        }),
      ], { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
    const summary = (d: ContentDocument) => {
      const value = (d.draft ?? d.published ?? d.defaultValue) as Record<
        string,
        any
      >;
      return {
        id: d.id,
        title: typeof value?.name === "string" ? value.name : d.title,
        description: d.description,
        group: d.group,
        pageCategory: d.group === "pages" ? pageCategoryFor(d.id).id : undefined,
        kind: d.kind,
        preview: d.preview,
        revision: d.revision,
        updatedAt: d.updatedAt,
        publishedAt: d.publishedAt,
        dirty: d.dirty,
        questions:
          d.kind === "test"
            ? value.sections?.reduce(
                (n: number, s: any) => n + s.questions.length,
                0,
              )
            : undefined,
        sections: d.kind === "test" ? value.sections?.length : undefined,
        enabled: d.kind === "test" ? value.enabled : undefined,
      };
    };
    return {
      items: rows.map(summary),
      total,
      page,
      pages: Math.ceil(total / 30),
      counts: Object.fromEntries(groups.map((g) => [g.group, g._count])),
      pageCategories: filter.group === "pages" ? pageCategories.map(({ id, title, description }) => ({
        id, title, description, count: pageRecords.filter(d => pageCategoryFor(d.id).id === id).length,
      })) : undefined,
      categories: Object.fromEntries(
        [
          "institution",
          "program",
          "gop",
          "college",
          "industry",
          "direction",
          "profession",
          "nav",
        ].map((c) => [
          c,
          categories.filter((d) => d.id.startsWith(c + ".")).length,
        ]),
      ),
      drafts,
      recent: recent.map(summary),
      capabilities: contentCapabilities(actor),
    };
  }
  async backup(actor: Actor | null) {
    requireContentAdmin(actor);
    const [docs, history] = await this.prisma.$transaction([
      this.prisma.contentDocument.findMany({ where: { revision: { gt: 0 } } }),
      this.prisma.contentRevision.findMany({
        orderBy: [{ at: "desc" }, { id: "desc" }],
      }),
    ]);
    return {
      version: 1,
      entries: Object.fromEntries(docs.map((d) => [d.id, entry(d)])),
      history,
    };
  }
}
