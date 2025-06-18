import { BadRequestException, Injectable } from '@nestjs/common';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma, Product, Promotion, UnitOfMeasure } from '@prisma/client';
import { ApiResponseDto } from 'src/dto/api-response.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { BulkProductCreateDTO } from './dto/bulk-create-product.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: UserPayload,
    payload: CreateProductDto,
  ): Promise<ApiResponseDto<Product>> {
    const data = await this.prisma.product.create({
      data: {
        name: payload.name,
        description: payload.description,
        regular_price: payload.regular_price,
        default_price: payload.default_price,
        unit_of_measure: payload.unit_of_measure,
        announcements: payload.announcements,
        shareable_info: payload.shareable_info,
        special_price: payload.special_price,
        userId: user.id,
        organizationId: user.organizationId,
      },
    });

    if (payload.imageUrls?.length) {
      await this.prisma.imageUrl.createMany({
        data: payload.imageUrls.map((url) => ({
          productId: data.id,
          url,
        })),
      });
    }

    if (payload.promotion_id) {
      await this.prisma.productPromotion.create({
        data: {
          productId: data.id,
          promotionId: payload.promotion_id,
        },
      });
    }
    return {
      data,
      message: 'Product Created',
    };
  }

  async bulkCreate(
    user: UserPayload,
    payload: BulkProductCreateDTO,
  ): Promise<ApiResponseDto<Prisma.BatchPayload>> {
    const results = await this.validateProductCsvData(payload.entities);
    const invalid = results.filter((r) => !r.valid);

    if (invalid.length > 0) {
      throw new BadRequestException(
        'Invalid CSV File: Missing or incorrect headers for product import.',
      );
    }

    const validData = results
      .filter((r) => r.valid)
      .map((r) => ({
        ...r.row,
        userId: user.id,
        organizationId: user.organizationId,
      })) as Prisma.ProductCreateManyInput[];

    const data = await this.prisma.product.createMany({
      data: validData,
    });

    return {
      data: data,
      message: 'Bulk Products Imported!',
    };
  }

  async findAll(
    user: UserPayload,
    query: { name?: string; unit?: string; promotion?: string },
  ): Promise<ApiResponseDto<Product[]>> {
    const queryParams: Prisma.ProductWhereInput = {
      organizationId: user.organizationId,
    };

    if (query.name) {
      queryParams.name = {
        contains: query.name,
      };
    }

    if (query.promotion) {
      queryParams.ProductPromotion = {
        some: {
          promotionId: {
            in: query.promotion.split(','),
          },
        },
      };
    }

    if (query.unit) {
      queryParams.unit_of_measure = query.unit as UnitOfMeasure;
    }

    const data = await this.prisma.product.findMany({
      where: queryParams,
      include: {
        imageUrls: true,
        ProductPromotion: {
          include: {
            promotion: true,
          },
        },
      },
    });

    return {
      data,
      message: '',
    };
  }

  async findAllPromotion(
    user: UserPayload,
  ): Promise<ApiResponseDto<Promotion[]>> {
    const queryParams: Prisma.PromotionWhereInput = {
      userId: user.id,
    };

    const data = await this.prisma.promotion.findMany({
      where: queryParams,
    });

    return {
      data,
      message: '',
    };
  }

  async findOne(id: string): Promise<ApiResponseDto<Product>> {
    const data = await this.prisma.product.findUnique({
      where: { id },
      include: {
        imageUrls: true,
        ProductPromotion: {
          include: {
            promotion: true,
          },
        },
      },
    });
    return {
      data,
      message: '',
    };
  }

  async update(
    id: string,
    payload: UpdateProductDTO,
  ): Promise<ApiResponseDto<Product>> {
    const data = await this.prisma.product.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description,
        regular_price: payload.regular_price,
        default_price: payload.default_price,
        unit_of_measure: payload.unit_of_measure,
        announcements: payload.announcements,
        shareable_info: payload.shareable_info,
        special_price: payload.special_price,
      },
    });

    if (payload.imageUrls?.length) {
      await this.prisma.imageUrl.deleteMany({
        where: {
          productId: id,
        },
      });

      await this.prisma.imageUrl.createMany({
        data: payload.imageUrls.map((url) => ({
          productId: data.id,
          url,
        })),
      });
    }

    if (payload.promotion_id) {
      // Deleting Existing Records
      await this.prisma.productPromotion.deleteMany({
        where: {
          productId: id,
        },
      });
      await this.prisma.productPromotion.create({
        data: {
          productId: data.id,
          promotionId: payload.promotion_id,
        },
      });
    }

    return {
      data,
      message: 'Product Updated',
    };
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    await this.prisma.product.delete({ where: { id } });
    return {
      data: null,
      message: 'Product Deleted',
    };
  }

  private async validateProductCsvData(csvData: any) {
    // 1️⃣ Separate headers and rows
    const [headers, ...rows] = csvData;

    // 2️⃣ Filter out bad rows (e.g., empty or incorrect length)
    const filteredRows = rows.filter((row) => row.length === headers.length);

    // 3️⃣ Map each row to an object
    const objectRows = filteredRows.map((row) =>
      Object.fromEntries(row.map((value, index) => [headers[index], value])),
    );

    // 4️⃣ Validate each object
    const results = [];

    for (const obj of objectRows) {
      const parsedObj = {
        ...obj,
        default_price: parseInt(obj.default_price, 10),
        regular_price: parseInt(obj.regular_price, 10),
        special_price: parseInt(obj.special_price, 10),
      };

      const instance = plainToInstance(CreateProductDto, parsedObj);
      const errors = await validate(instance);

      if (errors.length > 0) {
        results.push({
          valid: false,
          row: parsedObj,
          errors,
        });
      } else {
        results.push({
          valid: true,
          row: parsedObj,
        });
      }
    }

    return results;
  }

  async createPromotion(
    user: UserPayload,
    payload: CreatePromotionDto,
  ): Promise<ApiResponseDto<Promotion>> {
    const data = await this.prisma.promotion.create({
      data: {
        ...payload,
        userId: user.id,
      },
    });

    return {
      data,
      message: 'Promotion Created',
    };
  }

  async updatePromotion(
    user: UserPayload,
    payload: UpdatePromotionDto,
  ): Promise<ApiResponseDto<Promotion>> {
    const data = await this.prisma.promotion.update({
      where: {
        userId: user.id,
        id: payload.id,
      },
      data: {
        ...payload,
      },
    });

    return {
      data,
      message: 'Promotion Update',
    };
  }

  async deletePromotion(
    organizationId: string,
    id: string,
  ): Promise<ApiResponseDto<null>> {
    await this.prisma.promotion.delete({ where: { id, organizationId } });
    return {
      data: null,
      message: 'Promotion Deleted',
    };
  }
}
