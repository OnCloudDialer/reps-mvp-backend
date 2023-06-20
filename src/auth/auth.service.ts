import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ApiResponseDto } from 'src/dto/api-response.dto';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { Jwtdto } from './dto/jwt.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(user: RegisterUserDto): Promise<ApiResponseDto> {
    const rounds = parseInt(await this.configService.get('SALT_ROUNDS'));
    if (
      await this.prismaService.user.findFirst({
        where: {
          email: user.email,
        },
      })
    ) {
      throw new ForbiddenException('user.already.exists');
    }

    // get rounds from config!!

    const passwordSalt = await bcrypt.genSalt(rounds);

    const hashedPassword = await bcrypt.hash(user.password, passwordSalt);
    const newUser = await this.prismaService.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
      },
    });

    const token = await this.createPayload(newUser);

    return {
      data: {
        user: newUser,
        access_token: token.access_token,
      },
      message: 'user.created',
    };
  }

  async validateUser(loginUser: LoginUserDto): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginUser.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('user.doesnt.exists');
    }

    if (!(await bcrypt.compare(loginUser.password, user.password))) {
      throw new NotAcceptableException('invalid.credentials');
    }
    return user;
  }

  async validateUserByEmail(loginUser: Jwtdto): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginUser.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('user.doesnt.exists');
    }

    return user;
  }

  async login(user: User): Promise<ApiResponseDto> {
    const token = await this.createPayload(user);
    return {
      data: {
        access_token: token.access_token,
      },
      message: 'login.success',
    };
  }

  async refreshToken(user: User): Promise<ApiResponseDto> {
    const token = await this.createPayload(user);
    return {
      data: {
        user,
        access_token: token.access_token,
      },
      message: 'login.success',
    };
  }

  async createPayload(user: User) {
    return {
      access_token: this.jwtService.sign({ email: user.email, id: user.id }),
    };
  }
}
