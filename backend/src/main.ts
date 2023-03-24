import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigService)
  const port = config.get('PORT')

  app.setGlobalPrefix('api')
  app.disable('x-powered-by');

  const options = new DocumentBuilder()
    .setTitle('Music Service API')
    .setDescription('Сервисы REST API музыкального сервиса')
    .addBearerAuth()
    .addTag('Track')
    .addTag('Album')
    .addTag('Group')
    .addTag('User')
    .addTag('Role')
    .addTag('Auth')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/docs', app, document);

  console.log(`Сервер запущен на ${port || process.env.PORT || 80} порту`)
  await app.listen(port || 80);
}
bootstrap() ;
