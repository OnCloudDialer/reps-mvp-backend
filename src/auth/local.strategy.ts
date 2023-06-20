import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { IsEmail, ValidationError, validateOrReject } from 'class-validator';
import { LoginUserDto } from './dto/login.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(username: string, password: string): Promise<User> {
    const authDto = plainToClass(LoginUserDto, { email: username, password });

    try {
      await validateOrReject(authDto);
    } catch (errors) {
      const formattedErrors = errors.map((error: ValidationError) =>
        Object.values(error.constraints),
      );

      throw new UnauthorizedException(...formattedErrors);
    }

    const user = await this.authService.validateUser({
      email: username,
      password,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
