import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { ApiResponseDto } from 'src/dto/api-response.dto';
import { Tag } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: UserPayload,
    payload: CreateTagDto,
  ): Promise<ApiResponseDto<Tag>> {
    const data = await this.prisma.tag.create({
      data: {
        ...payload,
        userId: user.id,
        organizationId: user.organizationId,
      },
    });
    return {
      data,
      message: 'Tag Created',
    };
  }

  async findAll(user: UserPayload): Promise<ApiResponseDto<Tag[]>> {
    const data = await this.prisma.tag.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: { stores: { include: { store: true } } },
    });
    return {
      data,
      message: '',
    };
  }

  async findOne(id: string): Promise<ApiResponseDto<Tag>> {
    const data = await this.prisma.tag.findUnique({
      where: { id },
      include: { stores: { include: { store: true } } },
    });
    return {
      data,
      message: '',
    };
  }

  async update(
    id: string,
    payload: CreateTagDto,
  ): Promise<ApiResponseDto<Tag>> {
    const data = await this.prisma.tag.update({
      where: { id },
      data: payload,
    });
    return {
      data,
      message: 'Tag Updated',
    };
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    await this.prisma.tag.delete({ where: { id } });
    return {
      data: null,
      message: 'Tag Deleted',
    };
  }
}
