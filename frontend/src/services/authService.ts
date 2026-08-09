import apiClient from "../lib/axios/client";
import { LoginCredentials, RegisterCredentials, User, AuthResponse } from "../types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiClient.post<AuthResponse>("/v1/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    const { user, token } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await apiClient.post<AuthResponse>("/v1/auth/register", {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      role: credentials.role,
    });

    const { user, token } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<{ user: User }>("/v1/auth/me");
    return response.data.user;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        return null;
      }
    }
    return null;
  },
};
