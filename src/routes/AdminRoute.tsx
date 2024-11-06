import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;

  return user && isAdmin ? <Outlet /> : <Navigate to="/" />;
}