export type UserRole =
  | "state_admin"
  | "district_admin"
  | "dept_head"
  | "field_staff"
  | "citizen"
  | "admin" // Added admin as it's used in backend
  | "official"; // Added official as it's used in backend

export interface User {
  id: string;
  _id?: string; // For backend compatibility
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  designation?: string;
  department?: string;
  location?: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  role?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}
