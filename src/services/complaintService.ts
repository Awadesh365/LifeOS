import apiClient from "../lib/axios/client";
import {
  ApiResponse,
  Complaint,
  CreateComplaintDto,
  UpdateComplaintDto,
} from "../types";

const COMPLAINT_ENDPOINT = "/complaints";

export const complaintService = {
  getAll: async (): Promise<Complaint[]> => {
    const response =
      await apiClient.get<ApiResponse<Complaint[]>>(COMPLAINT_ENDPOINT);
    return response.data.data;
  },

  getById: async (id: string): Promise<Complaint> => {
    const response = await apiClient.get<ApiResponse<Complaint>>(
      `${COMPLAINT_ENDPOINT}/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateComplaintDto): Promise<Complaint> => {
    const response = await apiClient.post<ApiResponse<Complaint>>(
      COMPLAINT_ENDPOINT,
      data
    );
    return response.data.data;
  },

  update: async (id: string, data: UpdateComplaintDto): Promise<Complaint> => {
    const response = await apiClient.put<ApiResponse<Complaint>>(
      `${COMPLAINT_ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${COMPLAINT_ENDPOINT}/${id}`);
  },
};
