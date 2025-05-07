import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  create(user: UserPayload, data: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        ...data,
        userId: user.id,
        organizationId: user.organizationId,
      },
    });
  }

  findAll(user: UserPayload) {
    return this.prisma.tag.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: { stores: { include: { store: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.tag.findUnique({
      where: { id },
      include: { stores: { include: { store: true } } },
    });
  }

  update(id: string, data: CreateTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
