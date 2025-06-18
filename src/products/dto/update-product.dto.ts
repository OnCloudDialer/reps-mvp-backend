import { IsUUID } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDTO extends CreateProductDto {
  @IsUUID()
  id: string;
}
