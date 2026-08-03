import { Complaint } from "../../types/complaint";

export const DUMMY_COMPLAINTS: Complaint[] = [
  {
    _id: "c1",
    title: "Water Supply Issue",
    description:
      "No water supply in our area for the past 3 days. This is causing significant inconvenience to all residents.",
    citizen: "cit1",
    status: "open",
    department: "Water Department",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "c2",
    title: "Road Damage",
    description:
      "Main road has severe potholes causing accidents. Immediate repair required.",
    citizen: "cit2",
    status: "in-progress",
    department: "Public Works Department",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
  {
    _id: "c3",
    title: "Street Light Not Working",
    description:
      "Multiple street lights are not working in our colony, causing safety concerns at night.",
    citizen: "cit3",
    status: "resolved",
    department: "Electricity Department",
    createdAt: "2024-01-13T18:45:00Z",
    updatedAt: "2024-01-15T16:30:00Z",
  },
];
