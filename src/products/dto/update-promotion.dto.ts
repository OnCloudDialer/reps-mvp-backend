import { IsUUID } from 'class-validator';
import { CreatePromotionDto } from './create-promotion.dto';

export class UpdatePromotionDto extends CreatePromotionDto {
  @IsUUID()
  id: string;
}
