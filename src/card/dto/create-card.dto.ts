// src/card/dto/create-card.dto.ts
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
  @ApiProperty({ example: 'VIP-12345' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  value: number;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  remainingValue: number;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  @IsDateString()
  expireAt: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds: number[];

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  partnerIds: number[];

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  referralCodeId?: number;
}
