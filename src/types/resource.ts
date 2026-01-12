// Resource Types - matching NestJS backend
export type ResourceType =
  | "hospital"
  | "police_station"
  | "school"
  | "fire_station"
  | "other";

export interface Capacity {
  occupied: number;
  total: number;
  label: string;
}

export interface Vehicle {
  _id?: string;
  plate_number: string;
  type: string;
  status: "available" | "maintenance" | "busy";
}

export interface Staff {
  _id?: string;
  name: string;
  role: string;
  specialization?: string;
  status: "on_duty" | "off_duty" | "leave";
  shift_start?: string;
  shift_end?: string;
  contact?: string;
}

export interface Resource {
  _id: string;
  type: ResourceType;
  name: string;
  address: string;
  district: string;
  contact_number: string;
  head_of_dept: string;
  capacity?: Capacity;
  stats?: Record<string, number>;
  vehicles?: Vehicle[];
  staff?: Staff[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateResourceDto {
  type: ResourceType;
  name: string;
  address: string;
  district: string;
  contact_number: string;
  head_of_dept: string;
  capacity?: Partial<Capacity>;
  vehicles?: Partial<Vehicle>[];
  staff?: Partial<Staff>[];
}

export interface UpdateResourceDto extends Partial<CreateResourceDto> {}
