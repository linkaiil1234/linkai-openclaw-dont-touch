"use client";
import { useState } from "react";
import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useGetAllAgents } from "@/hooks/api/agent";
import { useMemo } from "react";
import { TAgentWithPartialConfig } from "@/types/models/agent";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";

export default function StatisticsChart() {
  const { data: agentsData, isLoading } = useGetAllAgents();
  const [timeRange, setTimeRange] = useState<
    "Monthly" | "Quarterly" | "Annually"
  >("Monthly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    return { from: sevenDaysAgo, to: today };
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const agents = useMemo(
    () => (agentsData?.data ?? []) as TAgentWithPartialConfig[],
    [agentsData?.data],
  );

  // Static demo data - API not yet ready
  const chartData = useMemo(() => {
    // Generate consistent demo data for preview
    return [
      {
        month: "Jan",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Feb",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Mar",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Apr",
        conversations: 180,
        messages: 420,
      },
      {
        month: "May",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Jun",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Jul",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Aug",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Sep",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Oct",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Nov",
        conversations: 180,
        messages: 420,
      },
      {
        month: "Dec",
        conversations: 180,
        messages: 420,
      },
    ];
  }, []);

  const chartConfig = {
    conversations: {
      label: "Conversations",
      color: "#6B7280",
    },
    messages: {
      label: "Messages",
      color: "#9CA3AF",
    },
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6 animate-pulse">
        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
          <div className="w-full space-y-2">
            <div className="h-6 w-40 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="h-4 w-64 bg-gray-200 rounded dark:bg-gray-700" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-40 bg-gray-200 rounded-lg dark:bg-gray-700" />
            <div className="h-10 w-40 bg-gray-200 rounded-lg dark:bg-gray-700" />
          </div>
        </div>
        <div className="h-[310px] bg-gray-200 rounded-lg dark:bg-gray-700" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-5 mb-6">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Agent Statistics
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Conversations and messages handled by your agents
            </p>
          </div>
        </div>
        <div className="h-[310px] flex items-center justify-center">
          <div className="text-center">
            <HugeiconsIcon
              icon={Calendar01Icon}
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
            />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              No statistics available
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create agents to start tracking statistics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Agent Statistics
            </h3>
            {/* <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Demo Preview
            </span> */}
          </div>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Preview of analytics dashboard - Live data coming soon
          </p>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
            {(["Monthly", "Quarterly", "Annually"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          {/* Date Picker */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-10 lg:w-40 lg:h-auto lg:pl-10 lg:pr-3 lg:py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-3 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 text-gray-500 dark:text-gray-400 size-5"
                />
                {dateRange?.from && dateRange?.to ? (
                  <span className="hidden lg:inline">
                    {format(dateRange.from, "MMM d")} -{" "}
                    {format(dateRange.to, "MMM d")}
                  </span>
                ) : dateRange?.from ? (
                  <span className="hidden lg:inline">
                    {format(dateRange.from, "MMM d")}
                  </span>
                ) : (
                  <span className="hidden lg:inline">Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="flex min-w-0 flex-col gap-2">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  min={5}
                  className="rounded-lg border shadow-sm"
                />
                <div className="text-muted-foreground text-center text-xs">
                  A minimum of 5 days is required
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full relative">
          {/* Demo Data Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-gray-300 dark:text-gray-700 text-6xl font-bold opacity-5 select-none rotate-[-15deg]">
              DEMO DATA
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-[310px] w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="fillConversations"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#6B7280" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E4E7EC"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                domain={[0, 800]}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ stroke: "#6B7280", strokeWidth: 1 }}
              />
              <Area
                type="linear"
                dataKey="conversations"
                stroke="#6B7280"
                strokeWidth={2}
                fill="url(#fillConversations)"
                fillOpacity={1}
              />
              <Area
                type="linear"
                dataKey="messages"
                stroke="#9CA3AF"
                strokeWidth={2}
                fill="url(#fillMessages)"
                fillOpacity={1}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* Info Banner */}
      {/* <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 px-4 py-3">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Analytics API Integration in Progress
            </p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
              This chart displays sample data for preview purposes. Real-time
              analytics will be available once the API integration is complete.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
