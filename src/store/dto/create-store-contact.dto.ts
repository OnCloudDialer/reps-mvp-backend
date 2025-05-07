import { ContactRole } from '@prisma/client';

export class CreateStoreContactDTO {
  name: string;
  phone: string;
  email: string;
  profilePicture: string;
  role: ContactRole;
  storeId?: string;
  //
}
