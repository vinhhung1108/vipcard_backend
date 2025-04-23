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
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);

  const config = new DocumentBuilder()
    .setTitle('VIPCard API')
    .setDescription('API quản lý hệ thống thẻ VIP')
    .setVersion('1.1')
    .addBearerAuth() // nếu bạn dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
