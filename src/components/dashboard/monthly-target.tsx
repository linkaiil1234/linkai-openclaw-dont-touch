"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const chartData = [{ target: "progress", value: 98.65, fill: "#475FFF" }];

const chartConfig = {
  value: {
    label: "Progress",
  },
  target: {
    label: "Target",
    color: "#475FFF",
  },
} satisfies ChartConfig;

export default function MonthlyTarget() {
  return (
    <div className="rounded-xl border bg-muted h-auto">
      <div className="px-5 pt-5 bg-card shadow sm:px-6 sm:pt-6 pb-8 rounded-xl">
        <div className="flex justify-between items-start ">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Satisfaction Rate
            </h3>
            <p className="mt-1.5 font-normal text-muted-foreground text-sm">
              Your satisfaction rate with the product and services
            </p>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <HugeiconsIcon icon={MoreHorizontalIcon} className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View More</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
        <div className="relative flex items-center justify-center py-4">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-w-[280px] w-full h-44"
          >
            <RadialBarChart
              data={chartData}
              startAngle={180}
              endAngle={5}
              innerRadius={100}
              outerRadius={115}
              cx="50%"
              cy="100%"
            >
              <RadialBar dataKey="value" cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <g>
                          <text
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 45}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 35}
                              className="fill-foreground text-2xl font-bold"
                              style={{ fill: "#475FFF" }}
                            >
                              {chartData[0].value}%
                            </tspan>
                          </text>
                          <foreignObject
                            x={(viewBox.cx || 0) - 25}
                            y={(viewBox.cy || 0) - 20}
                            width={50}
                            height={24}
                          >
                            <div className="flex items-center justify-center">
                              <span className="rounded-full bg-green-50 dark:bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-500">
                                +10%
                              </span>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
        <p className="mx-auto mt-4 w-full max-w-[380px] text-center text-sm text-muted-foreground leading-relaxed">
          Your satisfaction rate is 98.65%, it&apos;s higher than last month.
          <br className="hidden sm:inline" />
          Keep up your good work!
        </p>
      </div>

      <div className="flex items-end justify-center gap-8 px-6 py-5 sm:gap-12 ">
        <div>
          <p className="mb-1 text-center text-muted-foreground text-sm font-medium">
            Prev Month
          </p>
          <p className="flex items-center justify-center gap-1.5 text-lg font-bold text-foreground">
            00.00%
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                fill="#D92D20"
              />
            </svg>
          </p>
        </div>

        <div className="w-px bg-border h-8"></div>

        <div>
          <p className="mb-1 text-center text-muted-foreground text-sm font-medium">
            Today&apos;s Target
          </p>
          <p className="flex items-center justify-center gap-1.5 text-lg font-bold text-foreground">
            00.00%
          </p>
        </div>

        <div className="w-px bg-border h-8"></div>

        <div>
          <p className="mb-1 text-center text-muted-foreground text-sm font-medium">
            Today
          </p>
          <p className="flex items-center justify-center gap-1.5 text-lg font-bold text-foreground">
            00.00%
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
