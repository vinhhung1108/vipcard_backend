import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { TransformDateInterceptor } from './common/interceptors/transform-date.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET); // Thêm dòng này

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformDateInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('VIPCARD API')
    .setDescription('Hệ thống quản lý api vipcard')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory());

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
