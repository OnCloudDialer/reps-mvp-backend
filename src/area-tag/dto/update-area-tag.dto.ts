import { IsArray, IsString, IsUUID } from 'class-validator';

export class UpdateAreaTagDTO {
  @IsUUID()
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsArray()
  coords: any;
}
