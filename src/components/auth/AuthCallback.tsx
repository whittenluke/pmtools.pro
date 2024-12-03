import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get returnTo from hash or query params
    const params = new URLSearchParams(location.hash.replace('#', '') || location.search);
    const returnTo = decodeURIComponent(params.get('returnTo') || '') || '/account/dashboard';
    
    // Small delay to ensure auth state is updated
    setTimeout(() => {
      navigate(returnTo, { replace: true });
    }, 100);
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-gray-600">Redirecting...</div>
    </div>
  );
} 