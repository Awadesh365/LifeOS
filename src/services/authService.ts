import apiClient from "../lib/axios/client";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from "../types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    const user = {
      ...response.data,
      id: response.data._id,
    };
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return user;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      credentials
    );
    const user = {
      ...response.data,
      id: response.data._id,
    };
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return user;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
