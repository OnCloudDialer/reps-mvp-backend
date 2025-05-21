import { IsArray, IsString } from 'class-validator';

export class CreateAreaTagDTO {
  @IsString()
  name: string;
  @IsArray()
  coords: any;
}
