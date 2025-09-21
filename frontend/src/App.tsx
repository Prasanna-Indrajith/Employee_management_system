// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"

import LoginPage from '@/components/login/page'
// import UserDashboard from '@/dashboard/user'
import AdminDashboard from '@/components/dashboard/admin'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AdminDashboard />
      {/* {children} */}
      {/* <LoginPage /> */}
    </ThemeProvider>
  );
}

export default App;