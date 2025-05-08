import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsUUID,
  IsUrl,
  IsArray,
} from 'class-validator';
import { ContactRole } from '@prisma/client';

export class CreateStoreContactDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  profilePicture: string;

  @IsEnum(ContactRole)
  role: ContactRole;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  storeIds?: string[];
}
