import { VisitType } from '@prisma/client';
import { IsUUID, IsOptional, IsISO8601, IsEnum } from 'class-validator';

export class CreateVisitDTO {
  @IsUUID()
  storeId: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsOptional()
  @IsISO8601()
  scheduledAt?: string; // ISO8601 string, e.g., "2025-05-28T10:00:00Z"

  @IsEnum(VisitType)
  visitType: VisitType;

  @IsOptional()
  @IsISO8601()
  startedAt?: string;

  @IsOptional()
  @IsISO8601()
  endedAt?: string;

  @IsOptional()
  @IsISO8601()
  followUpDate?: string;
}
