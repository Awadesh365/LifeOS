// Department Types
export interface Department {
  _id: string;
  name: string;
  description?: string;
  head?: string;
  services?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  head?: string;
  services?: string[];
}

export interface UpdateDepartmentDto extends Partial<CreateDepartmentDto> {}
