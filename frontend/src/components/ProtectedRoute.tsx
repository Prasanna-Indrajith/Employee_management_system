import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // DEBUG LOGS
  console.log(`🛡️ ProtectedRoute [${location.pathname}]`);
  console.log(`   - Authenticated: ${isAuthenticated}`);
  console.log(`   - User Role: ${user?.role}`);
  console.log(`   - Required Role: ${requiredRole}`);

  // 2. Auth Check
  if (!isAuthenticated || !user) {
    // Redirect to login, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role Check
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the correct dashboard if they are in the wrong place
    const correctDashboard =
      user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={correctDashboard} replace />;
  }

  return <>{children}</>;
};
