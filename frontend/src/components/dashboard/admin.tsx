import { PayrollTab } from '../tabs/admin/PayrollTab';
import { SalaryReportsTab } from '../tabs/admin/SalaryReportsTab';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import Dashboard from '@/components/tabs//admin/Dashboard';
import AllEmployees from '@/components/tabs/admin/AllEmployees';
import EmployeeProfile from '@/components/tabs/admin/EmployeeProfile';
import TimeSheet from '@/components/tabs/admin/TimeSheet';
import TimeOffRequests from '@/components/tabs/admin/TimeOffRequests';
import EditEmployeeProfile from '../tabs/admin/EditEmployeeProfile';
import AddEmployee from '@/components/tabs/admin/AddEmployee';

export default function Page() {
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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader role="admin" tabName={location.pathname} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Routes>
                  {/* Dashboard */}
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Employee Routes */}
                  {/* Edit Users Profile */}
                  <Route
                    path="employees/:id/edit"
                    element={<EditEmployeeProfile />}
                  />
                  <Route path="employees/add" element={<AddEmployee />} />
                  <Route path="employees/all" element={<AllEmployees />} />
                  <Route path="employees/:id" element={<EmployeeProfile />} />

                  {/* Attendance Routes */}
                  <Route path="attendance/timesheets" element={<TimeSheet />} />
                  <Route
                    path="attendance/time-off-requests"
                    element={<TimeOffRequests />}
                  />

                  {/* Salary Routes */}
                  <Route path="salary/payroll" element={<PayrollTab />} />
                  <Route path="salary/report" element={<SalaryReportsTab />} />

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
