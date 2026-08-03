import { MOCK_DEPARTMENTS } from "../mocks/data";
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from "../types";

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    return MOCK_DEPARTMENTS;
  },

  getById: async (id: string): Promise<Department> => {
    const department = MOCK_DEPARTMENTS.find((d) => d._id === id);
    if (!department) throw new Error("Department not found");
    return department;
  },

  create: async (data: CreateDepartmentDto): Promise<Department> => {
    const newDepartment: Department = {
      ...data,
      _id: `dept-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newDepartment;
  },

  update: async (
    id: string,
    data: UpdateDepartmentDto,
  ): Promise<Department> => {
    const department = MOCK_DEPARTMENTS.find((d) => d._id === id);
    if (!department) throw new Error("Department not found");
    return { ...department, ...data, updatedAt: new Date().toISOString() };
  },

  delete: async (_id: string): Promise<void> => {
    return Promise.resolve();
  },
};
