import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

// Import User Tabs
import UserDashboard from '@/components/tabs/user/Dashboard';
// These act as placeholders until you build the specific files
import MyAttendance from '@/components/tabs/user/MyAttendance';
import MyLeaves from '@/components/tabs/user/MyLeaves';
import MyPayslips from '@/components/tabs/user/MyPayslips';
import UserProfile from '../tabs/user/Profile';
import EditUserProfile from '../tabs/user/EditProfile';

export default function UserPage() {
  const location = useLocation();

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      {/* NOTE: You will need to update AppSidebar to accept a 'role' prop 
        so it shows User links (Leaves, Attendance) instead of Admin links.
      */}
      <AppSidebar variant="inset" role="user" />

      <SidebarInset>
        <SiteHeader role="user" tabName={location.pathname} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Routes>
                  {/* User Dashboard */}
                  <Route path="dashboard" element={<UserDashboard />} />

                  {/* User Actions */}
                  <Route path="attendance" element={<MyAttendance />} />
                  <Route path="leaves" element={<MyLeaves />} />
                  <Route path="salary" element={<MyPayslips />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="profile/edit" element={<EditUserProfile />} />

                  {/* Default redirect */}
                  <Route
                    path=""
                    element={<Navigate to="dashboard" replace />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="dashboard" replace />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
