import {
  IconClock,
  IconCalendarUser,
  IconCoffee,
  IconGitPullRequest,
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function UserSectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: Today's Work Duration */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Today's Hours</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            08:15
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="size-4 mr-1" />
              Checked In
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Card 2: Annual Leave Balance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Annual Leave</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12 Days
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCalendarUser className="size-4 mr-1" />
              Available
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Card 3: Next Holiday */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Next Holiday</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Dec 05
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCoffee className="size-4 mr-1" />
              Poya Day
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Card 4: Pending Requests */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>My Requests</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconGitPullRequest className="size-4 mr-1" />
              Pending
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
