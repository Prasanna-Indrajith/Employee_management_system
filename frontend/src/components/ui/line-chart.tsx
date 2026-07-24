// src/components/charts/SalaryGrowthChart.tsx (or wherever you want to save it)

"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

// We no longer import Card, CardHeader, CardDescription, CardFooter, CardTitle
// as we are removing them for a seamless look.
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { SalaryGrowthTrend } from "@/types";

export const description = "A line chart for salary growth";

// Custom data for monthly average salary
const chartData = [
  { month: "January", salary: 85000 },
  { month: "February", salary: 85500 },
  { month: "March", salary: 86500 },
  { month: "April", salary: 88000 },
  { month: "May", salary: 89000 },
  { month: "June", salary: 91500 },
];

const chartConfig = {
  salary: {
    label: "Average Salary",
    // Set color to a specific dark value for the "full black" effect
    color: "hsl(0 0% 25%)", // A dark gray/near black for the line
  },
} satisfies ChartConfig;

export function SalaryGrowthChart({ data }: { data?: SalaryGrowthTrend[] }) {
  // Transform API data to chart format, fallback to mock data if no data provided
  const transformedChartData = data?.map(item => ({
    month: item.month,
    salary: item.averageSalary,
  })) || chartData;

  return (
    // Removed Card component. The fragment <> is used here for a direct render.
    // Use a <div> if you need a containing element for layout.
    <div className="w-full"> {/* Ensure it fills its parent container */}
      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          // Adjusted height to ensure it fits well, and width to fill parent
          className="mx-auto w-full"
        >
          <LineChart
            accessibilityLayer
            data={transformedChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="hsl(0 0% 75%)" /> {/* Dark grid lines */}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="salary"
              type="natural"
              stroke="hsl(0 0 25%)" // Dark gray/near black
              strokeWidth={2}
              dot={false} // Removed dots for a cleaner look, or set their fill to the same dark color
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
