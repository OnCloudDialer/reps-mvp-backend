import { IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDTO extends CreateProductDto {
  @IsString()
  id: string;
}
