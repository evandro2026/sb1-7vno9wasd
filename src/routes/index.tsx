import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { Login } from '../pages/Login';
import { Home } from '../pages/Home';
import { AdminDashboard } from '../pages/AdminDashboard';
import { CreateUser } from '../pages/CreateUser';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { PlaylistDetail } from '../pages/PlaylistDetail';

export function AppRoutes() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={isAdmin ? '/admin' : '/'} />} />
      
      {/* User Routes */}
      <Route element={<ProtectedRoute allowAdmin={false} />}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/playlists/:id" element={<PlaylistDetail />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={isAdmin ? '/admin' : '/'} />} />
    </Routes>
  );
}