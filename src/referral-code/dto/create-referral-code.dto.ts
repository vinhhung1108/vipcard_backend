import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReferralCodeDto {
  @ApiProperty({ example: 'REF123' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'MNguồn giới thiệu' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'MNguồn giới thiệu' })
  @IsString()
  note: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  discount: number;
}
