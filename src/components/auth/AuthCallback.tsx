import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.hash.replace('#', '') || location.search);
    const returnTo = decodeURIComponent(params.get('returnTo') || '') || '/account/dashboard';
    
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