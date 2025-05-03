import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { WebhookModule } from './webhook/webhook.module';
import { ServiceModule } from './service/service.module';
import { PartnerModule } from './partner/partner.module';
import { ReferralCodeModule } from './referral-code/referral-code.module';
import { CardModule } from './card/card.module';
import { Card } from './card/entities/card.entity';
import { Partner } from './partner/entities/partner.entity';
import { Service } from './service/entities/service.entity';
import { ReferralCode } from './referral-code/entities/referral-code.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Đọc file .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Card, Partner, Service, ReferralCode, User],
      // autoLoadEntities: true,
      // synchronize: process.env.NODE_ENV !== 'production',
      synchronize: true, // Chỉ nên dùng trong môi trường phát triển
      logging: true,
    }),
    TypeOrmModule.forFeature([User]), // Đăng ký entity
    UsersModule,
    AuthModule,
    WebhookModule,
    ServiceModule,
    PartnerModule,
    ReferralCodeModule,
    CardModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
