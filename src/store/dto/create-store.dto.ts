export class CreateStoreDto {
  name: string;
  address: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  tagIds?: string[]; // IDs of existing tags to associate
  contacts?: any[]; // IDs of existing tags to associate
}
