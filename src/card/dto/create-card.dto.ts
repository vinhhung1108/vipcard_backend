import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  value: number;

  @IsNumber()
  remainingValue: number;

  @IsDateString()
  expiredAt: string;

  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  partnerIds: number[];

  @IsOptional()
  @IsNumber()
  referralCodeId?: number;
}
