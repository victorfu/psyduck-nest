import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getPackageVersion } from './utils';
import { ServerConfig, SwaggerConfig } from './config/configuration.interface';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new WsAdapter(app));

  const configService = app.get(ConfigService);

  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  if (swaggerConfig.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(getPackageVersion())
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const corsConfig = configService.get('cors');
  if (corsConfig.enabled) {
    app.enableCors();
  }

  const serverConfig = configService.get<ServerConfig>('server');
  await app.listen(serverConfig.port);
  console.info(`~ Server is running on: ${await app.getUrl()}`);
}

bootstrap();
