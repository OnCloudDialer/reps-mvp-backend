import { Injectable } from '@nestjs/common';
import { AreaTag } from '@prisma/client';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { ApiResponseDto } from 'src/dto/api-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAreaTagDTO } from './dto/create-area-tag.dto';
import { UpdateAreaTagDTO } from './dto/update-area-tag.dto';

@Injectable()
export class AreaTagService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: UserPayload,
    payload: CreateAreaTagDTO,
  ): Promise<ApiResponseDto<AreaTag>> {
    const data = await this.prisma.areaTag.create({
      data: {
        ...payload,
        userId: user.id,
        organizationId: user.organizationId,
      },
    });
    return {
      data,
      message: 'Area Tag Created',
    };
  }

  async findAll(user: UserPayload): Promise<ApiResponseDto<AreaTag[]>> {
    const data = await this.prisma.areaTag.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: { StoreAreaTag: { include: { store: true } } },
    });
    return {
      data,
      message: '',
    };
  }

  async findOne(id: string): Promise<ApiResponseDto<AreaTag>> {
    const data = await this.prisma.areaTag.findUnique({
      where: { id },
      include: { StoreAreaTag: { include: { store: true } } },
    });
    return {
      data,
      message: '',
    };
  }

  async update(
    id: string,
    payload: UpdateAreaTagDTO,
  ): Promise<ApiResponseDto<AreaTag>> {
    const data = await this.prisma.areaTag.update({
      where: { id },
      data: payload,
    });
    return {
      data,
      message: 'Area Tag Updated',
    };
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    await this.prisma.areaTag.delete({ where: { id } });
    return {
      data: null,
      message: 'Area Tag',
    };
  }
}
