import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* <span className="px-4 lg:px-6">
            <h1 className="text-2xl font-medium">Salary Report</h1>
            <p className="text-muted-foreground text-sm mb-4">Detailed salary overview</p>
        </span> */}
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        {/* <DataTable data={data} /> */}
    </div>
  )
}
