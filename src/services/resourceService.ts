import apiClient from "../lib/axios/client";
import {
  ApiResponse,
  Resource,
  CreateResourceDto,
  UpdateResourceDto,
} from "../types";

const RESOURCE_ENDPOINT = "/resources";

export const resourceService = {
  /**
   * Get all resources
   */
  getAll: async (): Promise<Resource[]> => {
    const response =
      await apiClient.get<ApiResponse<Resource[]>>(RESOURCE_ENDPOINT);
    return response.data.data;
  },

  /**
   * Get a single resource by ID
   */
  getById: async (id: string): Promise<Resource> => {
    const response = await apiClient.get<ApiResponse<Resource>>(
      `${RESOURCE_ENDPOINT}/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new resource
   */
  create: async (data: CreateResourceDto): Promise<Resource> => {
    const response = await apiClient.post<ApiResponse<Resource>>(
      RESOURCE_ENDPOINT,
      data
    );
    return response.data.data;
  },

  /**
   * Update an existing resource
   */
  update: async (id: string, data: UpdateResourceDto): Promise<Resource> => {
    const response = await apiClient.put<ApiResponse<Resource>>(
      `${RESOURCE_ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a resource
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${RESOURCE_ENDPOINT}/${id}`);
  },
};
