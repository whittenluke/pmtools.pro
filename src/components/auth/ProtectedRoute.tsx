import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/supabase/AuthProvider';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth state
  if (loading) {
    return null;
  }

  if (!user) {
    // Store the attempted URL
    sessionStorage.setItem('returnTo', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 