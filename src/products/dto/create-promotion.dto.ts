import {
  IsUUID,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsJSON,
} from 'class-validator';
import { PromotionType } from '@prisma/client';

export class CreatePromotionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PromotionType)
  type: PromotionType;

  @IsJSON()
  value: any;

  @IsDateString()
  valid_from: string;

  @IsDateString()
  valid_to: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  notes_for_rep?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
