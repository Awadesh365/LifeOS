import { Department } from "../../types/department";

export const DUMMY_DEPARTMENTS: Department[] = [
  {
    _id: "dept1",
    name: "Health Department",
    description: "Responsible for healthcare services, hospitals, and medical facilities in the city.",
    head: "head1",
    services: [
      "Hospital Management",
      "Public Health Programs",
      "Medical Emergency Services",
      "Health Insurance Schemes"
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    _id: "dept2",
    name: "Police Department",
    description: "Ensures law and order, crime prevention, and public safety across the city.",
    head: "head2",
    services: [
      "Law and Order",
      "Traffic Management",
      "Crime Investigation",
      "Public Safety"
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    _id: "dept3",
    name: "Education Department",
    description: "Manages educational institutions, curriculum development, and literacy programs.",
    head: "head3",
    services: [
      "School Management",
      "Teacher Training",
      "Curriculum Development",
      "Scholarship Programs"
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    _id: "dept4",
    name: "Public Works Department",
    description: "Responsible for construction and maintenance of roads, buildings, and infrastructure.",
    head: "head4",
    services: [
      "Road Construction",
      "Building Maintenance",
      "Infrastructure Development",
      "Urban Planning"
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    _id: "dept5",
    name: "Water Supply Department",
    description: "Manages water supply, treatment plants, and distribution network across the city.",
    head: "head5",
    services: [
      "Water Supply",
      "Water Treatment",
      "Pipeline Maintenance",
      "Quality Testing"
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];
