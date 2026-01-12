import apiClient from "../lib/axios/client";
import {
  ApiResponse,
  Citizen,
  CreateCitizenDto,
  UpdateCitizenDto,
} from "../types";

const CITIZEN_ENDPOINT = "/citizens";

export const citizenService = {
  getAll: async (): Promise<Citizen[]> => {
    const response =
      await apiClient.get<ApiResponse<Citizen[]>>(CITIZEN_ENDPOINT);
    return response.data.data;
  },

  getById: async (id: string): Promise<Citizen> => {
    const response = await apiClient.get<ApiResponse<Citizen>>(
      `${CITIZEN_ENDPOINT}/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateCitizenDto): Promise<Citizen> => {
    const response = await apiClient.post<ApiResponse<Citizen>>(
      CITIZEN_ENDPOINT,
      data
    );
    return response.data.data;
  },

  update: async (id: string, data: UpdateCitizenDto): Promise<Citizen> => {
    const response = await apiClient.put<ApiResponse<Citizen>>(
      `${CITIZEN_ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${CITIZEN_ENDPOINT}/${id}`);
  },
};
