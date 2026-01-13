// src/components/ui/pie-chart-label.jsx

"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

// We no longer import Card, CardHeader, CardDescription, CardFooter, CardTitle
// as we are removing them for a seamless look.
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { DepartmentSalaryStats } from "@/types";

// Custom data for department-wise salaries
const chartData = [
  { department: "Product", salary: 780000, fill: "var(--chart-1)" },
  { department: "Design", salary: 550000, fill: "var(--chart-2)" },
  { department: "Data", salary: 690000, fill: "var(--chart-3)" },
  { department: "IT", salary: 920000, fill: "var(--chart-4)" },
  { department: "Marketing", salary: 610000, fill: "var(--chart-5)" },
  { department: "HR", salary: 450000, fill: "var(--chart-6)" },
];

const chartConfig = {
  salary: {
    label: "Total Salary",
  },
  engineering: {
    label: "Engineering",
    color: "hsl(0 0% 15%)", // Dark gray/black
  },
  marketing: {
    label: "Marketing",
    color: "hsl(0 0% 25%)", // Slightly lighter dark gray/black
  },
  sales: {
    label: "Sales",
    color: "hsl(0 0% 35%)", // Another shade of dark gray/black
  },
  hr: {
    label: "HR",
    color: "hsl(0 0% 45%)", // Another shade
  },
  finance: {
    label: "Finance",
    color: "hsl(0 0% 55%)", // Another shade
  },
} satisfies ChartConfig;

export function DepartmentSalaryChart({ data }: { data?: DepartmentSalaryStats[] }) {
  // Transform API data to chart format, fallback to mock data if no data provided
  const transformedChartData = data?.map(item => ({
    department: item.department,
    salary: item.totalSalary,
    fill: item.color || `var(--chart-${(data?.indexOf(item) || 0) % 6 + 1})`,
  })) || chartData;

  // We remove the Card wrapper here. The fragment <> is used if you just want to wrap
  // without adding a DOM element, or you can use a simple <div> if you need one.
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={transformedChartData}
              dataKey="salary"
              nameKey="department"
              stroke="none"
              label
            />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}