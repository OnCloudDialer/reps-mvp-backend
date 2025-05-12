import { IsString, IsUUID } from 'class-validator';

export class CreateStoreNoteDto {
  @IsString()
  note: string;

  @IsString()
  @IsUUID()
  storeId: string;
}
