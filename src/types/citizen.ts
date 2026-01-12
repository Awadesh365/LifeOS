// Citizen Types
export interface Citizen {
  _id: string;
  name: string;
  aadhaarNumber: string;
  address?: string;
  contact?: string;
  registeredServices?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCitizenDto {
  name: string;
  aadhaarNumber: string;
  address?: string;
  contact?: string;
  registeredServices?: string[];
}

export interface UpdateCitizenDto extends Partial<CreateCitizenDto> {}
