// Complaint Types
export type ComplaintStatus = "open" | "in-progress" | "resolved" | "closed";

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  citizen: string;
  status: ComplaintStatus;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComplaintDto {
  title: string;
  description: string;
  citizen: string;
  status?: ComplaintStatus;
  department: string;
}

export interface UpdateComplaintDto extends Partial<CreateComplaintDto> {}
