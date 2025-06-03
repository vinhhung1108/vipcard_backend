import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';

// Loại bỏ trường 'code' khỏi CreateCardDto, sau đó áp dụng PartialType
export class UpdateCardDto extends PartialType(
  OmitType(CreateCardDto, ['code']),
) {}
