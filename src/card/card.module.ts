import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from './entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '@src/service/entities/service.entity';
import { Partner } from '@src/partner/entities/partner.entity';
import { ReferralCode } from '@src/referral-code/entities/referral-code.entity';
import { ServiceModule } from '@src/service/service.module';
import { PartnerModule } from '@src/partner/partner.module';
import { ReferralCodeModule } from '@src/referral-code/referral-code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, Service, Partner, ReferralCode]),
    ServiceModule,
    PartnerModule,
    ReferralCodeModule,
  ],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
