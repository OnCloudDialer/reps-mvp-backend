import { IsString, IsUUID } from 'class-validator';

export class CreateContactNoteDTO {
  @IsString()
  note: string;

  @IsString()
  @IsUUID()
  contactId: string;
}
