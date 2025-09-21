import { IconBuildingSkyscraper, IconClipboardList, IconTrendingDown, IconTrendingUp, IconUserPlus, IconUsers, IconWebhook, IconWorld } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* Card 1: Total Employees */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Employees</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,250
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-4" />
              Users
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      
      {/* Card 2: New Hires This Month */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Hires</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUserPlus className="size-4" />
              Joiners
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Card 3: Active Projects */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconWorld className="size-4" />
              Online
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Card 4: Pending Tasks */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Requests</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClipboardList className="size-4" />
              Action
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

    </div>
  );
}
