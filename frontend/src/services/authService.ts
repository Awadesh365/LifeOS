import { LoginCredentials, RegisterCredentials, User } from "../types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Mock login - accept any credentials
    const mockUser: User = {
      _id: "user-1",
      id: "user-1",
      email: credentials.email,
      name: credentials.email.split("@")[0],
      role: "admin",
      token: "mock-jwt-token",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("token", mockUser.token || "");
    localStorage.setItem("user", JSON.stringify(mockUser));

    return mockUser;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    // Mock register
    const mockUser: User = {
      _id: "user-1",
      id: "user-1",
      email: credentials.email,
      name: credentials.name,
      role: "admin",
      token: "mock-jwt-token",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("token", mockUser.token || "");
    localStorage.setItem("user", JSON.stringify(mockUser));

    return mockUser;
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
