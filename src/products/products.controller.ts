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
  ) {
    return this.productService.findAll(user, {
      name,
      unit,
    });
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
