import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { PrismaModule } from "./platform/database/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { requestContext } from "./modules/auth/actor-context.service";
import { PublicApiModule } from "./modules/public-api/public-api.module";
import { ContentModule } from "./modules/content/content.module";
import { requestLimits } from "./platform/graphql/request-limits";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: "/api/graphql",
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      introspection: process.env.NODE_ENV !== "production",
      allowBatchedHttpRequests: false,
      validationRules: [requestLimits],
      context: () => requestContext.getStore(),
      includeStacktraceInErrorResponses: false,
      formatError: (error) => ({
        message: error.message,
        extensions: {
          code: error.extensions?.code,
          status: error.extensions?.status,
          requestId: error.extensions?.requestId,
        },
      }),
    }),
    ContentModule,
    PublicApiModule,
  ],
})
export class AppModule {}
