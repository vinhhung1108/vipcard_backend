import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from './entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerModule } from '@src/partner/partner.module';
import { ServiceModule } from '@src/service/service.module';
import { ReferralCodeModule } from '@src/referral-code/referral-code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    PartnerModule,
    ServiceModule,
    ReferralCodeModule,
  ],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
