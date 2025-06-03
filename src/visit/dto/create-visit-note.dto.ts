import { IsString, IsUUID } from 'class-validator';

export class CreateVisitNoteDto {
  @IsString()
  content: string;

  @IsString()
  @IsUUID()
  visitId: string;
}
