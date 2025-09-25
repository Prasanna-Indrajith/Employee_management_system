import * as React from "react"
import {
  IconActivity,
  IconBook,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconTimeDurationOff,
  IconTimeline,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Badge } from "@/components/ui/badge"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
  ],
  Employees: [
    {
      name: "All Employees",
      url: "/admin/employees/all",
      icon: IconUsers,
    },
    {
      name: "Add Employee",
      url: "/admin/employees/add",
      icon: IconUserPlus,
    },
  ],
  Attendance: [
    {
      name: "Timesheets",
      url: "/admin/attendance/timesheets",
      icon: IconBook,
    },
    {
      name: "Time Off Requests",
      url: "/admin/attendance/time-off-requests",
      icon: IconTimeDurationOff,
    }
  ],
  Salary: [
    {
      name: "Payroll",
      url: "/admin/salary/payroll",
      icon: IconBook,
    },
    {
      name: "Salary Report",
      url: "/admin/salary/report",
      icon: IconTimeDurationOff,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavDocuments items={data.Employees} sectionName="Employees"/>
        <NavDocuments items={data.Attendance} sectionName="Attendance"/>
        <NavDocuments items={data.Salary} sectionName="Salary"/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
