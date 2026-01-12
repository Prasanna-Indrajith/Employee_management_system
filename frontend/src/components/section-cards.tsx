'use client';

import { useEffect, useState } from 'react';
import {
  IconClipboardList,
  IconUserPlus,
  IconUsers,
  IconWorld,
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Import the new optimized API
import { dashboardAPI } from '@/services/api';

export function SectionCards() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    newHires: 0,
    activeUsers: 0,
    pendingRequests: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // 1. Single efficient call
        const data = await dashboardAPI.getAdminStats();

        // 2. Set data directly
        setStats({
          totalEmployees: data.data.totalEmployees || 0,
          newHires: data.data.newHires || 0,
          activeUsers: data.data.activeUsers || 0,
          pendingRequests: data.data.pendingRequests || 0,
        });
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: Total Employees */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Employees</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '...' : stats.totalEmployees}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-4 mr-1" />
              Users
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Card 2: New Hires */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Hires</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '...' : stats.newHires}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUserPlus className="size-4 mr-1" />
              This Month
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Card 3: Active Users */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '...' : stats.activeUsers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconWorld className="size-4 mr-1" />
              Online
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Card 4: Pending Requests */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Requests</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? '...' : stats.pendingRequests}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                stats.pendingRequests > 0
                  ? 'text-orange-600 border-orange-200 bg-orange-50'
                  : ''
              }
            >
              <IconClipboardList className="size-4 mr-1" />
              Action
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
