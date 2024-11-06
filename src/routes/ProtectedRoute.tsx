import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowAdmin?: boolean;
}

export function ProtectedRoute({ allowAdmin = true }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect admins to admin dashboard if they're not allowed
  if (isAdmin && !allowAdmin) {
    return <Navigate to="/admin" />;
  }

  return <Outlet />;
}