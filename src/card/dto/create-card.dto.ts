import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    example: 'VIP-12345',
    description: 'Mã thẻ duy nhất',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 100000,
    description: 'Giá trị ban đầu của thẻ',
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    example: 100000,
    description: 'Số tiền còn lại trong thẻ',
  })
  @IsNumber()
  remainingValue: number;

  @ApiProperty({
    example: '2025-12-31T23:59:59Z',
    description: 'Thời hạn sử dụng thẻ (ISO 8601)',
  })
  @IsDateString()
  expireAt: string;

  @ApiProperty({
    type: [Number],
    description: 'Danh sách ID dịch vụ áp dụng',
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds: number[];

  @ApiProperty({
    type: [Number],
    description: 'Danh sách ID đối tác áp dụng',
    example: [3, 4],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  partnerIds: number[];

  @ApiProperty({
    type: Number,
    required: false,
    description: 'ID mã giới thiệu nếu có',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  referralCodeId?: number;
}
