export type UserRole =
  | "state_admin"
  | "district_admin"
  | "dept_head"
  | "field_staff"
  | "citizen";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  designation?: string; // e.g., "Chief Minister", "District Magistrate"
  department?: string; // e.g., "Police", "Health"
  location?: string; // e.g., "Lucknow", "Varanasi"
}
