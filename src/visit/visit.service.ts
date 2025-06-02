import { Injectable } from '@nestjs/common';
import { Visit } from '@prisma/client';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { ApiResponseDto } from 'src/dto/api-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVisitDTO } from './dto/create.visit.dto';
import { UpdateVisitDTO } from './dto/update.visit.dto';

@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: UserPayload,
    payload: CreateVisitDTO,
  ): Promise<ApiResponseDto<Visit>> {
    const data = await this.prisma.visit.create({
      data: {
        ...payload,
        userId: user.id,
        organizationId: user.organizationId,
      },
    });
    return {
      data,
      message: 'Visit Created',
    };
  }

  async findAll(user: UserPayload): Promise<ApiResponseDto<Visit[]>> {
    const data = await this.prisma.visit.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        contact: true,
        store: true,
      },
    });
    return {
      data,
      message: '',
    };
  }

  async findOne(id: string): Promise<ApiResponseDto<Visit>> {
    const data = await this.prisma.visit.findUnique({
      where: { id },
    });
    return {
      data,
      message: '',
    };
  }

  async update(
    id: string,
    payload: UpdateVisitDTO,
  ): Promise<ApiResponseDto<Visit>> {
    const data = await this.prisma.visit.update({
      where: { id },
      data: payload,
    });
    return {
      data,
      message: 'Visit Updated',
    };
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    await this.prisma.visit.delete({ where: { id } });
    return {
      data: null,
      message: 'Visit Deleted',
    };
  }
}
