import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/auth";
import { DUMMY_USERS } from "../lib/constants/dummyUsers";

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("cityos_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userId: string) => {
    const foundUser = DUMMY_USERS.find((u) => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("cityos_user", JSON.stringify(foundUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cityos_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
