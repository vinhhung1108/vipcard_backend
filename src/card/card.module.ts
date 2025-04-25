import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from './entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '@src/service/entities/service.entity';
import { Partner } from '@src/partner/entities/partner.entity';
import { ReferralCode } from '@src/referral-code/entities/referral-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Service, Partner, ReferralCode])],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
