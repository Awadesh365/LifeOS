import apiClient from "../lib/axios/client";
import {
  ApiResponse,
  CityService,
  CreateServiceDto,
  UpdateServiceDto,
} from "../types";

const SERVICE_ENDPOINT = "/services";

export const cityServiceService = {
  getAll: async (): Promise<CityService[]> => {
    const response =
      await apiClient.get<ApiResponse<CityService[]>>(SERVICE_ENDPOINT);
    return response.data.data;
  },

  getById: async (id: string): Promise<CityService> => {
    const response = await apiClient.get<ApiResponse<CityService>>(
      `${SERVICE_ENDPOINT}/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateServiceDto): Promise<CityService> => {
    const response = await apiClient.post<ApiResponse<CityService>>(
      SERVICE_ENDPOINT,
      data
    );
    return response.data.data;
  },

  update: async (id: string, data: UpdateServiceDto): Promise<CityService> => {
    const response = await apiClient.put<ApiResponse<CityService>>(
      `${SERVICE_ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${SERVICE_ENDPOINT}/${id}`);
  },
};
