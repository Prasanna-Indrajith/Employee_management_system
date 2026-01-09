import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';

import LoginPage from '@/components/login/page';
import UserDashboard from '@/layouts/UserLayout';
import AdminDashboard from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute'; // Ensure this import is correct (based on your file structure)
import { useAuth } from '@/contexts/AuthContext';
import RootRedirect from './components/RootRedirect';

function App() {
  const { isAuthenticated, user } = useAuth(); // Get auth state for Login route too

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="App">
        <Routes>
          {/* SMART LOGIN ROUTE:
               If user tries to go to /login but is ALREADY logged in, 
               bounce them to their dashboard immediately.
            */}
          <Route
            path="/login"
            element={
              isAuthenticated && user ? (
                <Navigate
                  to={
                    user.role === 'admin'
                      ? '/admin/dashboard'
                      : '/user/dashboard'
                  }
                  replace
                />
              ) : (
                <LoginPage />
              )
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* SMART ROOT ROUTE:
            Replaces the old <Navigate to="/login" />
          */}
          <Route path="/" element={<RootRedirect />} />

          {/* Catch All */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
