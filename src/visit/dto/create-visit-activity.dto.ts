import { ActivityType } from '@prisma/client';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateVisitActivityDTO {
  @IsString()
  details: string;

  @IsEnum(ActivityType)
  type: ActivityType;

  @IsString()
  @IsUUID()
  visitId: string;
}
