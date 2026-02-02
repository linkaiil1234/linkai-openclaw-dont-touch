"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useGetAllConversations } from "@/hooks/api/chatwoot/conversations";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { api } from "@/lib/api";
import type { TApiPromise } from "@/types/api";
import { TConversationMessagesResult } from "@/types/models/chatwoot/message";

type TimeRange = "week" | "month";

const getAllConversationMessages = (
  conversation_id: string,
): TApiPromise<TConversationMessagesResult> => {
  return api.get(`/chatwoot/conversation/${conversation_id}/messages`);
};

export default function MonthlySalesChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  // Fetch all conversations
  const { data: conversationsData, isLoading: isLoadingConversations } =
    useGetAllConversations({ limit: 100 });

  const conversations = useMemo(
    () => conversationsData?.data?.payload ?? [],
    [conversationsData?.data?.payload],
  );

  // Fetch messages for all conversations using useQueries
  const messageQueries = useQueries({
    queries: conversations.map((conv) => ({
      queryKey: ["useGetAllConversationMessages", conv.id.toString()],
      queryFn: () => getAllConversationMessages(conv.id.toString()),
      enabled: !!conv.id,
    })),
  });

  // Collect all messages from all conversations
  const allMessages = useMemo(() => {
    const messages: Array<{
      createdAt: Date;
      content: string;
    }> = [];

    messageQueries.forEach((query) => {
      if (query.data && "data" in query.data && query.data.data?.payload) {
        query.data.data.payload.forEach((msg) => {
          const createdAt = new Date(
            typeof msg.created_at === "number"
              ? msg.created_at * 1000
              : new Date(msg.created_at).getTime(),
          );
          messages.push({
            createdAt,
            content: msg.content || "",
          });
        });
      }
    });

    return messages;
  }, [messageQueries]);

  const isLoadingMessages = messageQueries.some((query) => query.isLoading);
  const isLoading = isLoadingConversations || isLoadingMessages;

  // Generate chart data based on time range
  const chartData = useMemo(() => {
    if (allMessages.length === 0) {
      return [];
    }

    const now = new Date();
    const data: Array<{ label: string; conversations: number }> = [];

    if (timeRange === "week") {
      // Show last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayMessages = allMessages.filter((msg) => {
          const msgDate = new Date(msg.createdAt);
          return msgDate >= date && msgDate < nextDate;
        });

        const dayLabel = date.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
        });

        data.push({
          label: dayLabel,
          conversations: dayMessages.length,
        });
      }
    } else {
      // Show last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

        const monthMessages = allMessages.filter((msg) => {
          const msgDate = new Date(msg.createdAt);
          return msgDate >= date && msgDate < nextDate;
        });

        const monthLabel = date.toLocaleDateString("en-US", {
          month: "short",
        });

        data.push({
          label: monthLabel,
          conversations: monthMessages.length,
        });
      }
    }

    return data;
  }, [allMessages, timeRange]);

  const chartConfig = {
    conversations: {
      label: "Conversations",
      color: "#465fff",
    },
  };

  // Show loading skeleton while fetching data
  if (isLoading) {
    return (
      <div className="overflow-hidden h-full rounded-xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:p-6 flex flex-col space-y-2 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="h-8 w-8 bg-gray-200 rounded dark:bg-gray-700" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto dark:bg-gray-700" />
            <div className="h-4 w-24 bg-gray-200 rounded mx-auto dark:bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  // Show "no data" banner when there are no messages
  const hasNoData = allMessages.length === 0 || chartData.length === 0;

  if (hasNoData) {
    return (
      <div className="overflow-hidden h-full rounded-xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:p-6 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {timeRange === "week"
              ? "Daily Conversations"
              : "Monthly Conversations"}
          </h3>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  {timeRange === "week" ? "Week" : "Month"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-center ">
          <div className="text-center ">
            <div className="flex items-center justify-center mb-3">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              No conversation data available
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Start conversations with your customers to see conversation
              statistics and analytics here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden h-full rounded-xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:p-6 flex flex-col space-y-2 ">
      <div className="flex items-center justify-between ">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {timeRange === "week"
            ? "Daily Conversations"
            : "Monthly Conversations"}
        </h3>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                {timeRange === "week" ? "Week" : "Month"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTimeRange("week")}
              >
                Week
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTimeRange("month")}
              >
                Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar flex-1 min-h-0 ">
        <div className="min-w-[650px] xl:min-w-full h-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E4E7EC"
              />
              <XAxis
                dataKey="label"
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
                domain={[0, "dataMax"]}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="conversations"
                fill="#465fff"
                radius={[5, 5, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
