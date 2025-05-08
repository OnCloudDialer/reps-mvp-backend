import { CreateStoreContactDTO } from './create-store-contact.dto';
import { IsUUID } from 'class-validator';

export class UpdateStoreContactDto extends CreateStoreContactDTO {
  @IsUUID()
  id: string;
}
