import { IsUUID } from 'class-validator';
import { CreateVisitDTO } from './create.visit.dto';

export class UpdateVisitDTO extends CreateVisitDTO {
  @IsUUID()
  id: string;
}
