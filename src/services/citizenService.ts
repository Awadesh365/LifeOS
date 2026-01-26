import { MOCK_CITIZENS } from "../mocks/data";
import { Citizen, CreateCitizenDto, UpdateCitizenDto } from "../types";

export const citizenService = {
  getAll: async (): Promise<Citizen[]> => {
    return MOCK_CITIZENS;
  },

  getById: async (id: string): Promise<Citizen> => {
    const citizen = MOCK_CITIZENS.find((c) => c._id === id);
    if (!citizen) throw new Error("Citizen not found");
    return citizen;
  },

  create: async (data: CreateCitizenDto): Promise<Citizen> => {
    const newCitizen: Citizen = {
      ...data,
      _id: `cit-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newCitizen;
  },

  update: async (id: string, data: UpdateCitizenDto): Promise<Citizen> => {
    const citizen = MOCK_CITIZENS.find((c) => c._id === id);
    if (!citizen) throw new Error("Citizen not found");
    return { ...citizen, ...data, updatedAt: new Date().toISOString() };
  },

  delete: async (_id: string): Promise<void> => {
    return Promise.resolve();
  },
};
