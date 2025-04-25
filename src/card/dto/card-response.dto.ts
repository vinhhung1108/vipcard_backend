import { ApiProperty } from '@nestjs/swagger';
import { Service } from '@src/service/entities/service.entity';
import { Partner } from '@src/partner/entities/partner.entity';
import { ReferralCode } from '@src/referral-code/entities/referral-code.entity';

export class CardResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'VIP-12345' })
  code: string;

  @ApiProperty({ example: 100000 })
  value: number;

  @ApiProperty({ example: 85000 })
  remainingValue: number;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  expireAt: string;

  @ApiProperty({ type: () => [Service] })
  services: Service[];

  @ApiProperty({ type: () => [Partner] })
  partners: Partner[];

  @ApiProperty({ type: () => ReferralCode, nullable: true })
  referralCode?: ReferralCode;

  @ApiProperty({ example: '2025-04-25T12:45:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-04-25T12:45:00Z' })
  updatedAt: string;
}
