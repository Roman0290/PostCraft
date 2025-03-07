import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader';
import useAuth from '../hooks/useAuth';

/** Only logged-in users (optionally only admins) can see child routes. */
export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && !user.is_admin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

/** Logged-in users are sent away from /login and /register. */
export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
