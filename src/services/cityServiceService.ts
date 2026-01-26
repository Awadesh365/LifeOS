import { MOCK_CITY_SERVICES } from "../mocks/data";
import { CityService, CreateServiceDto, UpdateServiceDto } from "../types";

export const cityServiceService = {
  getAll: async (): Promise<CityService[]> => {
    return MOCK_CITY_SERVICES;
  },

  getById: async (id: string): Promise<CityService> => {
    const service = MOCK_CITY_SERVICES.find((s) => s._id === id);
    if (!service) throw new Error("Service not found");
    return service;
  },

  create: async (data: CreateServiceDto): Promise<CityService> => {
    const newService: CityService = {
      ...data,
      _id: `svc-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };
    return newService;
  },

  update: async (id: string, data: UpdateServiceDto): Promise<CityService> => {
    const service = MOCK_CITY_SERVICES.find((s) => s._id === id);
    if (!service) throw new Error("Service not found");
    return { ...service, ...data, updatedAt: new Date().toISOString() };
  },

  delete: async (_id: string): Promise<void> => {
    return Promise.resolve();
  },
};
