import { Module } from "@nestjs/common";
import { NavigatorModule } from "../navigator/navigator.module";
import { ContentQueries } from "./queries/content.queries";
import { EditContent } from "./use-cases/edit-content.use-case";
import { ContentTestAttempts } from "./use-cases/test-attempts.use-case";
import { ContentResolver } from "./graphql/content.resolver";
@Module({
  imports: [NavigatorModule],
  providers: [
    ContentQueries,
    EditContent,
    ContentTestAttempts,
    ContentResolver,
  ],
  exports: [ContentQueries, EditContent, ContentTestAttempts],
})
export class ContentModule {}
