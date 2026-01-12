import apiClient from "../lib/axios/client";
import {
  ApiResponse,
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "../types";

const DEPARTMENT_ENDPOINT = "/departments";

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const response =
      await apiClient.get<ApiResponse<Department[]>>(DEPARTMENT_ENDPOINT);
    return response.data.data;
  },

  getById: async (id: string): Promise<Department> => {
    const response = await apiClient.get<ApiResponse<Department>>(
      `${DEPARTMENT_ENDPOINT}/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateDepartmentDto): Promise<Department> => {
    const response = await apiClient.post<ApiResponse<Department>>(
      DEPARTMENT_ENDPOINT,
      data
    );
    return response.data.data;
  },

  update: async (
    id: string,
    data: UpdateDepartmentDto
  ): Promise<Department> => {
    const response = await apiClient.put<ApiResponse<Department>>(
      `${DEPARTMENT_ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${DEPARTMENT_ENDPOINT}/${id}`);
  },
};
