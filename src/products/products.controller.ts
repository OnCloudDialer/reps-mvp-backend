import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { AuthUser } from 'src/decorators/authUser';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { BulkProductCreateDTO } from './dto/bulk-create-product.dto';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  create(@Body() data: CreateProductDto, @AuthUser() user: UserPayload) {
    return this.productService.create(user, data);
  }

  @Post('bulk-create')
  bulkCreate(
    @Body() data: BulkProductCreateDTO,
    @AuthUser() user: UserPayload,
  ) {
    return this.productService.bulkCreate(user, data);
  }

  @Get()
  findAll(
    @AuthUser() user: UserPayload,
    @Query('name') name: string,
    @Query('unit') unit: string,
    @Query('promotion') promotion: string,
  ) {
    return this.productService.findAll(user, {
      name,
      unit,
      promotion,
    });
  }

  @Get('promotion')
  findAllPromotion(@AuthUser() user: UserPayload) {
    return this.productService.findAllPromotion(user);
  }

  @Delete('promotion/:id')
  deletePromotion(@Param('id') id: string, @AuthUser() user: UserPayload) {
    return this.productService.deletePromotion(user.organizationId, id);
  }
  @Post('promotion')
  createPromotion(
    @Body() data: CreatePromotionDto,
    @AuthUser() user: UserPayload,
  ) {
    return this.productService.createPromotion(user, data);
  }

  @Patch('promotion')
  updatePromotion(
    @Body() data: UpdatePromotionDto,
    @AuthUser() user: UserPayload,
  ) {
    return this.productService.updatePromotion(user, data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductDTO) {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
