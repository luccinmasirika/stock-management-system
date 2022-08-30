import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  const config = new DocumentBuilder()
    .setTitle('Edusys')
    .setDescription('Edusys API documentation')
    .setVersion('1.0.0')
    .addTag('Global config')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Roles')
    .addTag('Promotions')
    .addTag('Faculties')
    .addTag('Levels')
    .addTag('Teachers')
    .addTag('Submissions Settings')
    .addTag('Subjects')
    .addTag('Students')
    .addTag('Requests')
    .addTag('Mailer')
    .addTag('Files')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.PORT || 9000);
}
bootstrap();
