// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { type ReactNode } from 'react';
// import { Loader2 } from 'lucide-react';

// interface ProtectedRouteProps {
//   children: ReactNode;
//   requiredRole?: 'admin' | 'user'; // restrict to specific string values
// }

// export const ProtectedRoute = ({
//   children,
//   requiredRole,
// }: ProtectedRouteProps) => {
//   // 1. Use 'isLoading' to match AuthContext
//   const { user, isAuthenticated, isLoading } = useAuth();
//   const location = useLocation();

//   // 2. Show loading spinner while checking auth
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-background">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   // 3. Redirect to login if not authenticated
//   // We check '!user' as a safety fallback
//   if (!isAuthenticated || !user) {
//     // 'state={{ from: location }}' allows you to redirect them back after login
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 4. Role-Based Access Control
//   if (requiredRole && user.role !== requiredRole) {
//     // Smart Redirect: If an Admin tries to access User pages, send them to Admin Dashboard.
//     // If a User tries to access Admin pages, send them to User Dashboard.
//     const redirectPath =
//       user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
//     return <Navigate to={redirectPath} replace />;
//   }

//   // 5. Render the protected content
//   return <>{children}</>;
// };

// // export default ProtectedRoute;

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

  if (!isAuthenticated || !user) {
    console.warn('⛔ Redirecting to Login (Not Authenticated)');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.warn(
      `⛔ Role Mismatch! User is '${user.role}', Page needs '${requiredRole}'`
    );
    const redirectPath =
      user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
