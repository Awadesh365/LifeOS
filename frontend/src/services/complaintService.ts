import { MOCK_COMPLAINTS } from "../mocks/data";
import { Complaint, CreateComplaintDto, UpdateComplaintDto } from "../types";

export const complaintService = {
  getAll: async (): Promise<Complaint[]> => {
    return MOCK_COMPLAINTS;
  },

  getById: async (id: string): Promise<Complaint> => {
    const complaint = MOCK_COMPLAINTS.find((c) => c._id === id);
    if (!complaint) throw new Error("Complaint not found");
    return complaint;
  },

  create: async (data: CreateComplaintDto): Promise<Complaint> => {
    const newComplaint: Complaint = {
      ...data,
      _id: `comp-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "open",
    };
    return newComplaint;
  },

  update: async (id: string, data: UpdateComplaintDto): Promise<Complaint> => {
    const complaint = MOCK_COMPLAINTS.find((c) => c._id === id);
    if (!complaint) throw new Error("Complaint not found");
    return { ...complaint, ...data, updatedAt: new Date().toISOString() };
  },

  delete: async (_id: string): Promise<void> => {
    return Promise.resolve();
  },
};
