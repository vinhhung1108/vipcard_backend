import { Card } from '../entities/card.entity';
import { CardResponseDto } from './card-response.dto';

export function toCardResponseDto(card: Card): CardResponseDto {
  return {
    ...card,
    expireAt: card.expireAt.toISOString(),
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
}
