import { UnitOfMeasure } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'default_price must be a decimal number' },
  )
  default_price: number;

  @IsEnum(UnitOfMeasure)
  unit_of_measure: UnitOfMeasure;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'regular_price must be a decimal number' },
  )
  regular_price: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'special_price must be a decimal number' },
  )
  special_price?: number;

  @IsArray()
  @IsOptional()
  imageUrls?: string[];

  @IsOptional()
  @IsString()
  announcements?: string;

  @IsOptional()
  @IsString()
  shareable_info?: string;
}
