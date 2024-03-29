import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { getPackageVersion } from "./utils";
import { ServerConfig, SwaggerConfig } from "./config/configuration.interface";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { WsAdapter } from "@nestjs/platform-ws";
import { UsersService } from "./users/users.service";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api", {
    exclude: [
      {
        path: "verify-email",
        method: RequestMethod.GET,
      },
      {
        path: "reset-password",
        method: RequestMethod.GET,
      },
      {
        path: "reset-password",
        method: RequestMethod.POST,
      },
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useWebSocketAdapter(new WsAdapter(app));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");

  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>("swagger");
  const corsConfig = configService.get("cors");
  const serverConfig = configService.get<ServerConfig>("server");

  if (swaggerConfig.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(getPackageVersion().version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }

  if (corsConfig.enabled) {
    app.enableCors();
  }

  const usersService = app.get(UsersService);
  await usersService.initializeDefaultAdmin();

  await app.listen(serverConfig.port);
  console.info(`~ Server is running on: ${await app.getUrl()}`);
}

bootstrap();
