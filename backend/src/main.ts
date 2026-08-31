import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true })
  );

  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Smart Bolashaq API")
      .setDescription("Backend: tests, profile, navigator, chat, course, achievements")
      .setVersion("0.1")
      .build()
  );
  SwaggerModule.setup("api/docs", app, doc);

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
