import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth';
import type { AdminUser } from '@/types/auth';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Vérifier l'utilisateur actuel
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Écouter les changements d'authentification
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'autom8_user') {
        const updatedUser = getCurrentUser();
        setUser(updatedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}