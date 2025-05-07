export class UpdateStoreDto {
  name?: string;
  address?: string;
  region: string;
  city: string;
  latitude?: number;
  longitude?: number;
  tagIds?: string[];
}
