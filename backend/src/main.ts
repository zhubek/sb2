import { ConsoleLogger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { randomUUID } from "node:crypto";
import { json } from "express";
import { AppModule } from "./app.module";
import {
  ActorContextService,
  requestContext,
} from "./modules/auth/actor-context.service";
import { ErrorBoundary, safeError } from "./platform/logging/error-boundary";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ json: true }),
    bodyParser: false,
  });
  if (!process.env.CMS_AUTH_SECRET || process.env.CMS_AUTH_SECRET.length < 32)
    throw new Error(
      "Set CMS_AUTH_SECRET to the frontend AUTH_SECRET (minimum 32 characters)",
    );
  const actors = app.get(ActorContextService);
  app.use((req: any, res: any, next: () => void) => {
    const requestId = randomUUID();
    res.setHeader("X-Request-Id", requestId);
    requestContext.run({ actor: null, requestId }, () => {
      actors
        .resolve(req.headers)
        .then((actor) => {
          requestContext.getStore()!.actor = actor;
          next();
        })
        .catch((error) => {
          const safe = safeError(error, requestId);
          res.status(safe.status).json({ error: safe.message, requestId });
        });
    });
  });
  app.use(json({ limit: "25mb" }));
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? false,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new ErrorBoundary());
  if (process.env.NODE_ENV !== "production")
    SwaggerModule.setup(
      "api/docs",
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle("Smart Bolashaq compatibility API")
          .setVersion("0.2")
          .build(),
      ),
    );
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3002, process.env.HOST ?? "127.0.0.1");
}
void bootstrap();
