import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralCode } from './entities/referral-code.entity';
import { ReferralCodeService } from './referral-code.service';
import { ReferralCodeController } from './referral-code.controller';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReferralCode]), AuthModule],
  controllers: [ReferralCodeController],
  providers: [ReferralCodeService],
  exports: [ReferralCodeService],
})
export class ReferralCodeModule {}
