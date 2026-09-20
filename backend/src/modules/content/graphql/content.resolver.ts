import {
  Args,
  Context,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { JsonScalar } from "../../../platform/graphql/json.scalar";
import type { RequestContext } from "../../auth/actor-context.service";
import { ContentQueries } from "../queries/content.queries";
import {
  EditContent,
  type EditContentInput,
} from "../use-cases/edit-content.use-case";
import { ContentTestAttempts } from "../use-cases/test-attempts.use-case";

@ObjectType()
class ContentCapabilities {
  @Field() canEdit: boolean;
  @Field() canPublish: boolean;
  @Field() canRestore: boolean;
}
@ObjectType()
class EditableContent {
  @Field() id: string;
  @Field() locale: string;
  @Field(() => JsonScalar) source: unknown;
  @Field() translationPublished: boolean;
  @Field() title: string;
  @Field() description: string;
  @Field() group: string;
  @Field(() => String, { nullable: true }) kind: string | null;
  @Field() preview: string;
  @Field(() => JsonScalar) value: unknown;
  @Field(() => JsonScalar) published: unknown;
  @Field(() => Int) revision: number;
  @Field(() => String, { nullable: true }) updatedAt: string | null;
  @Field(() => String, { nullable: true }) publishedAt: string | null;
  @Field(() => JsonScalar) history: unknown;
  @Field(() => JsonScalar, { nullable: true }) references: unknown;
  @Field(() => ContentCapabilities) capabilities: ContentCapabilities;
}
@Resolver()
export class ContentResolver {
  constructor(
    private readonly queries: ContentQueries,
    private readonly edit: EditContent,
    private readonly attempts: ContentTestAttempts,
  ) {}
  @Query(() => JsonScalar) publishedContent(@Args("locale", { nullable: true }) locale?: string) {
    return this.queries.publishedValues(locale);
  }
  @Query(() => EditableContent) contentDocument(
    @Context() c: RequestContext,
    @Args("id") id: string,
    @Args("locale", { nullable: true }) locale?: string,
  ) {
    return this.queries.document(c.actor, id, locale);
  }
  @Query(() => JsonScalar) contentLibrary(
    @Context() c: RequestContext,
    @Args("filter", { type: () => JsonScalar, nullable: true }) filter: any,
  ) {
    return this.queries.list(c.actor, filter ?? {});
  }
  @Query(() => JsonScalar) contentBackup(@Context() c: RequestContext) {
    return this.queries.backup(c.actor);
  }
  @Mutation(() => JsonScalar) editContent(
    @Context() c: RequestContext,
    @Args("input", { type: () => JsonScalar }) input: EditContentInput,
  ) {
    return this.edit.execute(c.actor, input, c.requestId);
  }
  @Mutation(() => JsonScalar) importContentBackup(
    @Context() c: RequestContext,
    @Args("backup", { type: () => JsonScalar }) backup: unknown,
  ) {
    return this.edit.importBackup(c.actor, backup, c.requestId);
  }
  @Query(() => JsonScalar) contentTestAttempts(@Context() c: RequestContext) {
    return this.attempts.list(c.actor);
  }
  @Mutation(() => JsonScalar) saveContentTestAttempt(
    @Context() c: RequestContext,
    @Args("input", { type: () => JsonScalar }) input: unknown,
  ) {
    return this.attempts.save(c.actor, input);
  }
}
