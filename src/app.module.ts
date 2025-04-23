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
      entities: [User],
      // autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
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
