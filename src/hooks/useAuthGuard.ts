import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function useAuthGuard(options: AuthGuardOptions = {}) {
  const { 
    requireAuth = true, 
    requireAdmin = false, 
    redirectTo = '/login' 
  } = options;
  
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Esperar a que termine la verificación

    // Si requiere autenticación pero no está autenticado
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Si requiere admin pero no es admin
    if (requireAdmin && user?.role !== 'admin') {
      router.push('/'); // Redirigir a home si no es admin
      return;
    }
  }, [isAuthenticated, user, isLoading, requireAuth, requireAdmin, redirectTo, router]);

  return {
    isAuthorized: isAuthenticated && (!requireAdmin || user?.role === 'admin'),
    isLoading,
    user
  };
}