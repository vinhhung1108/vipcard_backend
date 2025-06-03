import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ description: 'Mã thẻ', example: 'VIP-0001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Giá trị thẻ (VNĐ)', example: 600000000 })
  @IsNumber()
  value: number;

  @ApiProperty({ description: 'Số dư còn lại (VNĐ)', example: 500000 })
  @IsNumber()
  remainingValue: number;

  @ApiProperty({
    description: 'Ngày hết hạn (ISO 8601)',
    example: '2025-06-20T17:28:00.000Z',
  })
  @IsDateString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value;
    }
    throw new Error('expiredAt phải là chuỗi định dạng ISO 8601');
  })
  expiredAt: string;

  @ApiProperty({
    description: 'Danh sách ID dịch vụ',
    type: [Number],
    example: [1],
    nullable: true,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional() // Cho phép null
  serviceIds: number[] | null;

  @ApiProperty({
    description: 'Danh sách ID đối tác',
    type: [Number],
    example: [1],
    nullable: true,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional() // Cho phép null
  partnerIds: number[] | null;

  @ApiProperty({
    description: 'ID mã giới thiệu (tùy chọn)',
    example: 1,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  referralCodeId?: number | null;
}
