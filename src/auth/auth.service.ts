import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { generateWorkspaceName } from './utils';
import { UserPayload } from './dto/jwt.user.dto';
import { StatsDTO } from './dto/stats.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    user: RegisterUserDto,
  ): Promise<ApiResponseDto<{ user: User; access_token: string }>> {
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

    // Associating User with a Organization
    await this.createUserOrganization(newUser.id);

    const token = await this.createPayload(newUser.id);

    return {
      data: {
        user: newUser,
        access_token: token.access_token,
      },
      message: 'user.created',
    };
  }

  private async createUserOrganization(userId: string) {
    const name = generateWorkspaceName();
    const newOrganization = await this.prismaService.organization.create({
      data: {
        name,
      },
    });

    return await this.prismaService.organizationMembers.create({
      data: {
        organizationId: newOrganization.id,
        userId,
        role: 'ORGANIZATION_OWNER',
      },
    });
  }

  async validateUser(loginUser: LoginUserDto): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginUser.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user.doesnt.exists');
    }

    if (!(await bcrypt.compare(loginUser.password, user.password))) {
      throw new UnauthorizedException('invalid.credentials');
    }
    return user;
  }

  async validateUserByEmail(loginUser: Jwtdto): Promise<UserPayload> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginUser.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user.doesnt.exists');
    }

    return await this.createUserPayload(user.id);
  }

  async login(
    user: LoginUserDto,
  ): Promise<ApiResponseDto<{ user: User; access_token: string }>> {
    const userRecord = await this.prismaService.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (!userRecord) {
      throw new BadRequestException('User Not Found');
    }

    const isPasswordCorrect = await bcrypt.compare(
      user.password,
      userRecord.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Either Password or Email is incorrect!');
    }

    const token = await this.createPayload(userRecord.id);
    return {
      data: {
        user: userRecord,
        access_token: token.access_token,
      },
      message: 'login.success',
    };
  }

  async refreshToken(
    user: User,
  ): Promise<ApiResponseDto<{ user: User; access_token: string }>> {
    const token = await this.createPayload(user.id);
    return {
      data: {
        user,
        access_token: token.access_token,
      },
      message: '',
    };
  }

  async createPayload(userId: string) {
    const payload = await this.createUserPayload(userId);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async createUserPayload(userId: string) {
    const userRecord = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        OrganizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    });
    const organizationId = userRecord.OrganizationMembers[0].organizationId;

    const payload: UserPayload = {
      ...userRecord,
      organizationId,
    };
    return payload;
  }

  async getStats(organizationId: string): Promise<ApiResponseDto<StatsDTO>> {
    const totalContacts = await this.prismaService.contact.count({
      where: {
        organizationId,
      },
    });

    const totalProducts = await this.prismaService.product.count({
      where: {
        organizationId,
      },
    });

    const totalStores = await this.prismaService.store.count({
      where: {
        organizationId,
      },
    });

    return {
      data: {
        totalContacts,
        totalProducts,
        totalStores,
      },
      message: '',
    };
    //
  }
}
