import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getPackageVersion } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Psyduck Nest API')
    .setDescription(
      'Psyduck is a simple and easy to use API for managing users.  It is built with NestJS.',
    )
    .setVersion(getPackageVersion())
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(port);
  console.log(`~ Application is running on: ${await app.getUrl()}`);
}

bootstrap();
