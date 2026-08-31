import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function RequireAuth({ children }: PropsWithChildren) {
  const { authenticated } = useAuth();
  const location = useLocation();
  return authenticated
    ? children
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
