import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import LoadingScreen from "../components/ui/LoadingScreen";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
