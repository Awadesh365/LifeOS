export type UserRole =
  | "customer"
  | "provider"
  | "admin"
  | "state_admin"
  | "district_admin"
  | "dept_head"
  | "field_staff"
  | "citizen"
  | "official";

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  designation?: string;
  department?: string;
  location?: string;
  token?: string;
  is_verified?: boolean;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}
