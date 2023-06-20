import { IsEmail } from 'class-validator';

export class Jwtdto {
  @IsEmail()
  email: string;
}
