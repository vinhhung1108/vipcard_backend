import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReferralCodeDto {
  @ApiProperty({ example: 'REF123' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Mã giới thiệu dành cho khách hàng thân thiết' })
  @IsString()
  description: string;
}
