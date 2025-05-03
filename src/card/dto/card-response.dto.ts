import { Service } from '@src/service/entities/service.entity';
import { Partner } from '@src/partner/entities/partner.entity';
import { ReferralCode } from '@src/referral-code/entities/referral-code.entity';

export class CardResponseDto {
  id: number;
  code: string;
  value: number;
  remainingValue: number;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
  services: Service[];
  partners: Partner[];
  referralCode?: ReferralCode;
}
