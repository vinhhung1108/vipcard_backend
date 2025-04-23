import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from './entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
