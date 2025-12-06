import apiClient from "../lib/axios/client";
import { Facility } from "../types/resources";

export const resourceService = {
  getAll: async (): Promise<Facility[]> => {
    const response = await apiClient.get<Facility[]>("/resources");
    return response.data;
  },

  getById: async (id: string): Promise<Facility> => {
    const response = await apiClient.get<Facility>(`/resources/${id}`);
    return response.data;
  },

  create: async (data: Omit<Facility, "id">): Promise<Facility> => {
    const response = await apiClient.post<Facility>("/resources", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Facility>): Promise<Facility> => {
    const response = await apiClient.put<Facility>(`/resources/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resources/${id}`);
  },
};
