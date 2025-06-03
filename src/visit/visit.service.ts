import { Injectable, NotFoundException } from '@nestjs/common';
import { Visit, VisitActivity, VisitNote } from '@prisma/client';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { ApiResponseDto } from 'src/dto/api-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVisitDTO } from './dto/create.visit.dto';
import { UpdateVisitDTO } from './dto/update.visit.dto';
import { CreateVisitNoteDto } from './dto/create-visit-note.dto';
import { CreateVisitActivityDTO } from './dto/create-visit-activity.dto';

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
      include: {
        store: true,
        activities: true,
        contact: true,
        notes: true,
        photos: true,
      },
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

  async findVisitNotes(
    organizationId: string,
    visitId: string,
  ): Promise<ApiResponseDto<VisitNote[]>> {
    const checkVisit = await this.prisma.visit.findFirst({
      where: {
        organizationId,
        id: visitId,
      },
      include: {
        notes: true,
      },
    });
    if (!checkVisit) {
      throw new NotFoundException('No Visit Found with this ID!');
    }

    return {
      data: checkVisit.notes,
      message: '',
    };
  }

  async createVisitNote(
    data: CreateVisitNoteDto,
  ): Promise<ApiResponseDto<VisitNote>> {
    //

    const newNote = await this.prisma.visitNote.create({
      data: {
        visitId: data.visitId,
        content: data.content,
      },
    });

    return {
      data: newNote,
      message: 'New Note Created',
    };
  }

  async findVisitActivity(
    organizationId: string,
    visitId: string,
  ): Promise<ApiResponseDto<VisitActivity[]>> {
    const checkVisit = await this.prisma.visit.findFirst({
      where: {
        organizationId,
        id: visitId,
      },
      include: {
        activities: true,
      },
    });
    if (!checkVisit) {
      throw new NotFoundException('No Visit Found with this ID!');
    }

    return {
      data: checkVisit.activities,
      message: '',
    };
  }

  async createVisitActivity(
    data: CreateVisitActivityDTO,
  ): Promise<ApiResponseDto<VisitActivity>> {
    //

    const newNote = await this.prisma.visitActivity.create({
      data: {
        visitId: data.visitId,
        details: data.details,
        type: data.type,
      },
    });

    return {
      data: newNote,
      message: 'New Activity Created',
    };
  }
}
