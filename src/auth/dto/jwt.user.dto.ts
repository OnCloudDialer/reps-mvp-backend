import { User } from '@prisma/client';
export interface UserPayload extends User {
  organizationId: string;
}
