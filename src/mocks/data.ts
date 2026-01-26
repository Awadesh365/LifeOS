import {
  Resource,
  Citizen,
  Complaint,
  Department,
  CityService,
} from "../types";

export const MOCK_RESOURCES: Resource[] = [
  {
    _id: "res-1",
    type: "hospital",
    name: "City Central Hospital",
    address: "123 Healthcare Blvd, Medical District",
    district: "Central",
    contact_number: "555-0101",
    head_of_dept: "Dr. Sarah Smith",
    capacity: {
      occupied: 180,
      total: 200,
      label: "Beds",
    },
    stats: {
      doctors: 45,
      nurses: 120,
      emergency_wait: 15,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "res-2",
    type: "police_station",
    name: "Downtown Police Headquarters",
    address: "456 Safety St, Security Plaza",
    district: "South",
    contact_number: "555-9111",
    head_of_dept: "Commissioner James Gordon",
    stats: {
      officers: 150,
      active_patrols: 12,
      cases_resolved_this_month: 85,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "res-3",
    type: "school",
    name: "Greenwood International School",
    address: "789 Knowledge Way, Academic Grove",
    district: "North",
    contact_number: "555-0202",
    head_of_dept: "Principal Maria Garcia",
    capacity: {
      occupied: 450,
      total: 500,
      label: "Students",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "res-4",
    type: "fire_station",
    name: "Station 7 Fire & Rescue",
    address: "101 Flame Rd, Industrial Zone",
    district: "East",
    contact_number: "555-0303",
    head_of_dept: "Chief Robert Miller",
    stats: {
      engines: 4,
      firefighters: 30,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_CITIZENS: Citizen[] = [
  {
    _id: "cit-1",
    name: "John Doe",
    aadhaarNumber: "1234-5678-9012",
    address: "Apartment 4B, Sunrise Heights",
    contact: "9876543210",
    registeredServices: ["water_tax", "property_tax"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "cit-2",
    name: "Jane Wilson",
    aadhaarNumber: "5678-9012-3456",
    address: "House 12, Valley View",
    contact: "9876543211",
    registeredServices: ["voter_id", "driving_license"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    _id: "comp-1",
    title: "Street light not working",
    description: "The street light in front of house 42 is broken for 3 days.",
    citizen: "John Doe",
    status: "open",
    department: "Public Works",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "comp-2",
    title: "Water leakage",
    description: "Main pipe leaking near the central park entrance.",
    citizen: "Jane Wilson",
    status: "in-progress",
    department: "Water Department",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_DEPARTMENTS: Department[] = [
  {
    _id: "dept-1",
    name: "Health Department",
    description: "Responsible for public health and hospitals.",
    head: "Dr. Arvind Kumar",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "dept-2",
    name: "Education Department",
    description: "Managing city schools and educational programs.",
    head: "Mrs. Meena Sharma",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "dept-3",
    name: "Police Department",
    description: "Maintaining law and order in the city.",
    head: "Mr. Rajesh Singh",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_CITY_SERVICES: CityService[] = [
  {
    _id: "svc-1",
    name: "Marriage Certificate",
    description: "Registration and issuance of marriage certificates.",
    department: "Registrar Office",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "svc-2",
    name: "Property Tax Payment",
    description: "Online payment of residential and commercial property taxes.",
    department: "Revenue Department",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
