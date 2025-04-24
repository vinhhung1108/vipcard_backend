import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ example: 'Salon Nam Thành' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Đường ABC, Quận 1, TP.HCM' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
