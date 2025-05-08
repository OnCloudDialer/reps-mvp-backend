// src/store/store.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ContactRole, Prisma, Store, StoreContact } from '@prisma/client';
import { ApiResponseDto } from 'src/dto/api-response.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(
    organizationId: string,
    userId: string,
    data: CreateStoreDto,
  ): Promise<ApiResponseDto<Store>> {
    const store = await this.prisma.store.create({
      data: {
        organizationId,
        userId,
        address: data.address,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        name: data.name,
      },
    });
    if (data.tagIds?.length) {
      await this.prisma.storeTag.createMany({
        data: data.tagIds.map((tagId) => ({
          storeId: store.id,
          tagId,
        })),
        skipDuplicates: true, // avoid inserting duplicates if they somehow exist
      });
    }

    return this.findOne(organizationId, store.id);
  }

  async findAll(
    userId: string,
    organizationId: string,
    query: { tagIds?: string; name?: string; contactId: string },
  ): Promise<ApiResponseDto<Store[]>> {
    const storeQuery: Prisma.StoreWhereInput = {
      organizationId,
      userId,
    };

    if (query.name) {
      storeQuery.name = query.name;
    }

    if (query.contactId) {
      storeQuery.StoreContact = {
        some: {
          contactId: query.contactId,
        },
      };
    }

    if (query.tagIds) {
      storeQuery.tags = {
        some: {
          tagId: {
            in: query.tagIds.split(','),
          },
        },
      };
    }

    const data = await this.prisma.store.findMany({
      where: storeQuery,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return {
      data,
      message: '',
    };
  }

  async findOne(
    organizationId: string,
    id: string,
  ): Promise<ApiResponseDto<Store>> {
    const checkStore = await this.prisma.store.findUnique({
      where: { id, organizationId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!checkStore) {
      throw new NotFoundException('No Store Found with this ID');
    }

    return {
      data: checkStore,
      message: '',
    };
  }

  async findStoreContacts(
    organizationId: string,
    id: string,
    { role, name }: { role: string; name: string },
  ): Promise<ApiResponseDto<StoreContact[]>> {
    const query: Prisma.StoreContactWhereInput = {
      storeId: id,
      contact: {
        ...(role && {
          role: {
            in: role.split(',') as ContactRole[],
          },
        }),
        ...(name && { name }),
      },
    };

    const checkStore = await this.prisma.store.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!checkStore) {
      throw new NotFoundException('No Store Found with this ID');
    }

    const contacts = await this.prisma.storeContact.findMany({
      where: query,
      include: {
        contact: true,
      },
    });

    return {
      data: contacts,
      message: '',
    };
  }

  async update(
    organizationId: string,
    id: string,
    data: UpdateStoreDto,
  ): Promise<ApiResponseDto<Store>> {
    const checkStore = await this.prisma.store.findFirst({
      where: {
        organizationId,
        id,
      },
    });

    if (!checkStore) {
      throw new NotFoundException('No Store Found with this ID');
    }

    await this.prisma.store.update({
      where: { id: checkStore.id },
      data: {
        address: data.address,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        name: data.name,
      },
    });

    if (data.tagIds) {
      await this.prisma.storeTag.deleteMany({
        where: { storeId: id },
      });

      await this.prisma.storeTag.createMany({
        data: data.tagIds.map((tagId) => ({
          storeId: id,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    return await this.findOne(organizationId, id);
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    const checkStore = await this.prisma.store.findFirst({
      where: {
        id,
      },
    });

    if (!checkStore) {
      throw new NotFoundException('No Store Found with this ID');
    }
    await this.prisma.store.delete({ where: { id: checkStore.id } });

    return {
      data: null,
      message: 'Store Deleted!',
    };
  }
}
