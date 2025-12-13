// import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';

import LoginPage from '@/components/login/page';
import UserDashboard from '@/components/dashboard/user';
import AdminDashboard from '@/components/dashboard/admin';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <AuthProvider> */}
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            {/* <Route path="/login" element={<LoginPage />} /> */}

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*"
              element={
                // <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
                // {</ProtectedRoute> }
              }
            />

            {/* Redirect root to admin dashboard */}
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            {/* Protected user Routes */}
            <Route
              path="/user/*"
              element={
                // <ProtectedRoute requiredRole="user">
                <UserDashboard />
                // {/* </ProtectedRoute> */}
              }
            />

            {/* Redirect root to admin dashboard */}
            <Route
              path="/"
              element={<Navigate to="/user/dashboard" replace />}
            />

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
      {/* </AuthProvider> */}
    </ThemeProvider>
  );
}

export default App;
