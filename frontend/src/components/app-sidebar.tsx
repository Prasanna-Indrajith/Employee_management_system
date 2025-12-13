import * as React from 'react';
import {
  // Common
  IconDashboard, // Dashboard
  IconInnerShadowTop, // Logo icon

  // Employees
  IconUsers, // All Employees
  IconUserPlus, // Add Employee

  // Attendance (Admin)
  IconCalendarTime, // Timesheets (Better than Book)
  IconCalendarOff, // Time Off Requests (Specific for leaves)

  // Salary (Admin)
  IconCash, // Payroll (Money flow)
  IconReportMoney, // Salary Report (Analytics + Money)

  // User Side
  IconClockCheck, // My Attendance (Clocking in)
  IconCalendarUser, // My Leaves (Personal Calendar)
  IconFileDollar, // My Payslips (Document + Money)
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

// --- FIXED DATA STRUCTURE ---
const userData = {
  admin: {
    name: 'Admin User',
    email: 'admin@orian.com',
    avatar: '/avatars/admin.jpg',
  },
  employee: {
    name: 'Kasun Perera',
    email: 'kasun@orian.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

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
        icon: IconCalendarTime, // Changed
      },
      {
        name: 'Time Off Requests',
        url: '/admin/attendance/time-off-requests',
        icon: IconCalendarOff, // Changed
      },
    ],
    salary: [
      {
        name: 'Payroll',
        url: '/admin/salary/payroll',
        icon: IconCash, // Changed
      },
      {
        name: 'Salary Report',
        url: '/admin/salary/report',
        icon: IconReportMoney, // Changed
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
        icon: IconClockCheck, // Changed
      },
      {
        name: 'My Leaves',
        url: '/user/leaves',
        icon: IconCalendarUser, // Changed
      },
    ],
    finance: [
      {
        name: 'My Payslips',
        url: '/user/salary',
        icon: IconFileDollar, // Changed
      },
    ],
  },
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: 'admin' | 'user';
}

export function AppSidebar({ role = 'admin', ...props }: AppSidebarProps) {
  // Select navigation data
  const activeNavData = role === 'user' ? navData.user : navData.admin;

  // Select user profile data
  const activeUserData = role === 'user' ? userData.employee : userData.admin;

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
        <NavMain items={activeNavData.main} />

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
        {/* Pass the dynamic user data and the role to NavUser */}
        <NavUser user={activeUserData} role={role} />
      </SidebarFooter>
    </Sidebar>
  );
}
