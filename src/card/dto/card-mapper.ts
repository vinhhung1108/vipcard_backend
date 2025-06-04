import { CardResponseDto } from './card-response.dto';
import { Card } from '../entities/card.entity';

export function toCardResponseDto(card: Card): CardResponseDto {
  if (!(card.expiredAt instanceof Date) || isNaN(card.expiredAt.getTime())) {
    console.error('expiredAt không hợp lệ:', card.expiredAt);
    throw new Error('expiredAt không hợp lệ trong toCardResponseDto');
  }
  if (!(card.createdAt instanceof Date) || isNaN(card.createdAt.getTime())) {
    console.error('createdAt không hợp lệ:', card.createdAt);
    throw new Error('createdAt không hợp lệ trong toCardResponseDto');
  }
  if (!(card.updatedAt instanceof Date) || isNaN(card.updatedAt.getTime())) {
    console.error('updatedAt không hợp lệ:', card.updatedAt);
    throw new Error('updatedAt không hợp lệ trong toCardResponseDto');
  }
  return {
    id: card.id,
    code: card.code,
    value: card.value,
    remainingValue: card.remainingValue,
    expiredAt: card.expiredAt.toISOString(),
    services: card.services,
    partners: card.partners,
    referralCode: card.referralCode,
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
}
