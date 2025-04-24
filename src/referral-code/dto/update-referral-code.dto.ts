// src/referral-code/dto/update-referral-code.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateReferralCodeDto } from './create-referral-code.dto';

export class UpdateReferralCodeDto extends PartialType(CreateReferralCodeDto) {}
