import { Module } from '@nestjs/common';
import { ReferralCodeService } from './referral-code.service';
import { ReferralCodeController } from './referral-code.controller';
import { ReferralCode } from './entities/referral-code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ReferralCode])],
  providers: [ReferralCodeService],
  controllers: [ReferralCodeController],
})
export class ReferralCodeModule {}
