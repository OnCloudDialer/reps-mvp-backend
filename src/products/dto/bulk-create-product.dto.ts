import { IsArray } from 'class-validator';

export class BulkProductCreateDTO {
  @IsArray()
  entities: any[];
}
