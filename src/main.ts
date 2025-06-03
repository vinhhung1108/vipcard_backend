import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { TransformDateInterceptor } from './common/interceptors/transform-date.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

dotenv.config();
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình ValidationPipe để ánh xạ và xác thực dữ liệu chính xác
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Tự động ánh xạ và chuyển đổi kiểu
      transformOptions: { enableImplicitConversion: true },
      whitelist: true, // Chỉ chấp nhận các trường có trong DTO
      forbidNonWhitelisted: true, // Ném lỗi nếu payload chứa trường không được định nghĩa
      forbidUnknownValues: true, // Ném lỗi nếu payload chứa giá trị không xác định
    }),
  );

  // Giữ nguyên TransformDateInterceptor (giả định nó chuẩn hóa ngày tháng)
  app.useGlobalInterceptors(new TransformDateInterceptor());

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('VIPCARD API')
    .setDescription('Hệ thống quản lý api vipcard')
    .setVersion('1.1')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory());

  // Cấu hình cookie-parser và CORS
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://card.namident.com'],
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
