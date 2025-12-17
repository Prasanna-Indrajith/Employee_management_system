import * as React from 'react';
import {
  // Common
  IconDashboard,
  IconInnerShadowTop,

  // Employees
  IconUsers,
  IconUserPlus,

  // Attendance (Admin)
  IconCalendarTime,
  IconCalendarOff,

  // Salary (Admin)
  IconCash,
  IconReportMoney,

  // User Side
  IconClockCheck,
  IconCalendarUser,
  IconFileDollar,
} from '@tabler/icons-react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// --- NAVIGATION DATA ---
// (We keep this because the Sidebar structure is static,
// but the User Profile data inside NavUser is dynamic)
const navData = {
  // --- ADMIN NAVIGATION ---
  admin: {
    main: [
      {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: IconDashboard,
      },
    ],
    employees: [
      {
        name: 'All Employees',
        url: '/admin/employees/all',
        icon: IconUsers,
      },
      {
        name: 'Add Employee',
        url: '/admin/employees/add',
        icon: IconUserPlus,
      },
    ],
    attendance: [
      {
        name: 'Timesheets',
        url: '/admin/attendance/timesheets',
        icon: IconCalendarTime,
      },
      {
        name: 'Time Off Requests',
        url: '/admin/attendance/time-off-requests',
        icon: IconCalendarOff,
      },
    ],
    salary: [
      {
        name: 'Payroll',
        url: '/admin/salary/payroll',
        icon: IconCash,
      },
      {
        name: 'Salary Report',
        url: '/admin/salary/report',
        icon: IconReportMoney,
      },
    ],
  },

  // --- USER (EMPLOYEE) NAVIGATION ---
  user: {
    main: [
      {
        title: 'Dashboard',
        url: '/user/dashboard',
        icon: IconDashboard,
      },
    ],
    work: [
      {
        name: 'My Attendance',
        url: '/user/attendance',
        icon: IconClockCheck,
      },
      {
        name: 'My Leaves',
        url: '/user/leaves',
        icon: IconCalendarUser,
      },
    ],
    finance: [
      {
        name: 'My Payslips',
        url: '/user/salary',
        icon: IconFileDollar,
      },
    ],
  },
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: 'admin' | 'user';
}

export function AppSidebar({ role = 'admin', ...props }: AppSidebarProps) {
  // Select navigation links based on the role passed from Layout
  const activeNavData = role === 'user' ? navData.user : navData.admin;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex gap-x-2 m-auto justify-center py-8 bg-accent rounded-2xl">
              <IconInnerShadowTop className="!size-8" />
              <span className="text-2xl font-semibold">Orian Bridge</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Dashboard Link */}
        <NavMain items={activeNavData.main} />

        {/* Dynamic Sections based on Role */}
        {role === 'admin' ? (
          /* --- ADMIN VIEW --- */
          <>
            <NavDocuments
              items={navData.admin.employees}
              sectionName="Employees"
            />
            <NavDocuments
              items={navData.admin.attendance}
              sectionName="Attendance"
            />
            <NavDocuments items={navData.admin.salary} sectionName="Salary" />
          </>
        ) : (
          /* --- USER VIEW --- */
          <>
            <NavDocuments items={navData.user.work} sectionName="My Work" />
            <NavDocuments items={navData.user.finance} sectionName="Finance" />
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        {/* Clean implementation: No props needed! */}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
