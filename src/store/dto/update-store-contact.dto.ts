import { ContactRole } from '@prisma/client';

export class UpdateStoreContactDto {
  id: string;
  name: string;
  phone: string;
  email: string;
  profilePicture: string;
  role: ContactRole;
  storeId?: string;
  //
}
