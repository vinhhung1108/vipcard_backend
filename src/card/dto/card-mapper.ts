import { CardResponseDto } from './card-response.dto';
import { Card } from '../entities/card.entity';

export function toCardResponseDto(card: Card): CardResponseDto {
  return {
    id: card.id,
    code: card.code,
    value: card.value,
    remainingValue: card.remainingValue,
    expiredAt: card.expiredAt.toISOString(),
    services: card.services,
    partners: card.partners,
    referralCode: card.referralCode,
    createdAt: card.createdAt?.toISOString(),
    updatedAt: card.updatedAt?.toISOString(),
  };
}
