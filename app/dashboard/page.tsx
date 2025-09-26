"use client"

import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default function Page() {

  return (
    <div className="@container/main flex flex-1 flex-col">
      <div className="flex flex-col py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </div>
    </div>
  )
}
