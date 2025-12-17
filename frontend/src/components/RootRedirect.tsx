import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function RootRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1. Show a loading spinner if we are still checking LocalStorage
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. If Logged In -> Go to correct Dashboard
  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
        replace
      />
    );
  }

  // 3. If Not Logged In -> Go to Login
  return <Navigate to="/login" replace />;
}
