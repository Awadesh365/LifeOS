// City Service Types
export interface CityService {
  _id: string;
  name: string;
  description?: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  department: string;
  isActive?: boolean;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}
