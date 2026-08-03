import { MOCK_RESOURCES } from "../mocks/data";
import { Resource, CreateResourceDto, UpdateResourceDto } from "../types";

export const resourceService = {
  /**
   * Get all resources
   */
  getAll: async (): Promise<Resource[]> => {
    return MOCK_RESOURCES;
  },

  /**
   * Get a single resource by ID
   */
  getById: async (id: string): Promise<Resource> => {
    const resource = MOCK_RESOURCES.find((r) => r._id === id);
    if (!resource) throw new Error("Resource not found");
    return resource;
  },

  /**
   * Create a new resource
   */
  create: async (data: CreateResourceDto): Promise<Resource> => {
    const newResource: Resource = {
      ...data,
      _id: `res-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      capacity: data.capacity as any,
      vehicles: (data.vehicles || []) as any,
      staff: (data.staff || []) as any,
    };
    return newResource;
  },

  /**
   * Update an existing resource
   */
  update: async (id: string, data: UpdateResourceDto): Promise<Resource> => {
    const resource = MOCK_RESOURCES.find((r) => r._id === id);
    if (!resource) throw new Error("Resource not found");
    return {
      ...resource,
      ...data,
      updatedAt: new Date().toISOString(),
      capacity: (data.capacity || resource.capacity) as any,
      vehicles: (data.vehicles || resource.vehicles) as any,
      staff: (data.staff || resource.staff) as any,
    } as Resource;
  },

  /**
   * Delete a resource
   */
  delete: async (_id: string): Promise<void> => {
    return Promise.resolve();
  },
};
