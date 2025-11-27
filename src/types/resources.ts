export interface StaffMember {
  id: string;
  name: string;
  role: string; // Doctor, Nurse, Constable, Inspector
  status: "on_duty" | "off_duty" | "leave";
  shift_start: string; // "08:00"
  shift_end: string; // "16:00"
  contact: string;
  specialization?: string; // For doctors
}

export interface Vehicle {
  id: string;
  type: "ambulance" | "police_car" | "fire_truck";
  plate_number: string;
  status: "available" | "dispatched" | "maintenance";
  location?: { lat: number; lng: number };
  assigned_to?: string; // Staff ID
}

export interface Facility {
  id: string;
  name: string;
  type: "hospital" | "police_station" | "school" | "college";
  address: string;
  district: string;
  head_of_dept: string; // Name of person in charge
  head_contact: string;
  contact_number: string;
  staff: StaffMember[];
  vehicles?: Vehicle[]; // For hospitals/police
  capacity?: {
    total: number;
    occupied: number;
    label: string; // "Beds", "Students", "Cells"
  };
  stats?: {
    daily_footfall?: number;
    pending_cases?: number;
    critical_patients?: number;
  };
}
