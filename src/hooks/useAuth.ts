import { useAppDispatch, useAppSelector } from "./redux";
import { login, register, logout } from "../redux/slices/authSlice";
import { LoginCredentials, RegisterCredentials } from "../types/auth";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  );

  const handleLogin = async (credentials: LoginCredentials) => {
    await dispatch(login(credentials)).unwrap();
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    await dispatch(register(credentials)).unwrap();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    loading,
    isAuthenticated,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
