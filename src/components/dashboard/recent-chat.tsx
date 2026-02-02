"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { FilterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useGetAllConversations } from "@/hooks/api/chatwoot/conversations";
import { useMemo } from "react";
import type { TChatwootConversation } from "@/types/models/chatwoot/conversation";
import { Pagination } from "../shared/pagination";
import { useQueryParams } from "@/hooks/custom/use-query-params";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import DemoUserProfileImage from "@/assets/images/demo-user-profile-image.avif";
import { Globe2 } from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdSms } from "react-icons/md";
import { FaTelegramPlane } from "react-icons/fa";
import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";
import { InstagramIconGradient } from "@/constants/channel-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";

// Define the TypeScript interface for conversations
interface Conversation {
  id: number;
  agentName: string;
  thumbnail: string;
  channel: string;
  messageCount: number;
  status: "Active" | "Resolved" | "Pending";
  lastActivity: string;
}

// Helper function to format time ago
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp * 1000; // Convert to milliseconds
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
};

// Helper function to normalize channel type from "Channel::Api" to "api"
const normalizeChannelType = (channel: string): string => {
  if (!channel) return "";
  // Remove "Channel::" prefix and convert to lowercase
  const normalized = channel.replace("Channel::", "").toLowerCase();
  // Return empty string for API channels (don't render anything)
  if (normalized === "api") return "";
  // Map specific cases
  const channelMap: Record<string, string> = {
    webwidget: "webwidget",
    twiliosms: "sms",
    whatsapp: "whatsapp",
    email: "email",
    telegram: "telegram",
    instagram: "instagram",
  };
  return channelMap[normalized] || normalized;
};

// Helper function to get channel name for display
const getChannelName = (channelType: string): string => {
  const normalized = normalizeChannelType(channelType);
  switch (normalized) {
    case "whatsapp":
      return "WhatsApp";
    case "telegram":
      return "Telegram";
    case "email":
      return "Email";
    case "sms":
      return "SMS";
    case "instagram":
      return "Instagram";
    case "webwidget":
    case "web":
      return "Web Widget";
    default:
      return channelType.replace("Channel::", "");
  }
};

// Channel icon rendering function (matches customers page pattern)
const renderChannelIcon = (channelType: string) => {
  const normalized = normalizeChannelType(channelType);

  // Don't render anything for API channels
  if (!normalized || normalized === "") {
    return null;
  }

  switch (normalized) {
    case "webwidget":
    case "web":
      return <Globe2 className="text-gray-500 w-4 h-4" />;
    case "whatsapp":
      return <IoLogoWhatsapp className="text-[#25D366] w-4 h-4" />;
    case "telegram":
      return <FaTelegramPlane className="text-[#0088CC] w-4 h-4" />;
    case "email":
      return (
        <Image
          src={GmailIcon}
          alt="Gmail"
          width={16}
          height={16}
          className="w-4 h-4"
        />
      );
    case "sms":
      return <MdSms className="text-gray-700 dark:text-gray-300 w-4 h-4" />;
    case "instagram":
      return <InstagramIconGradient className="size-4" />;
    default:
      return null;
  }
};

// Helper function to map status
const mapStatus = (status: string): "Active" | "Resolved" | "Pending" => {
  const statusMap: Record<string, "Active" | "Resolved" | "Pending"> = {
    open: "Active",
    resolved: "Resolved",
    pending: "Pending",
    snoozed: "Pending",
  };
  return statusMap[status.toLowerCase()] || "Pending";
};

export default function RecentChats() {
  const { params } = useQueryParams();
  const currentPage = parseInt(params.page || "1", 10);

  const router = useRouter();
  const limit = 5;

  const { data: conversationsData, isLoading } = useGetAllConversations(
    {
      page: currentPage,
      limit: limit,
    },
    {},
  );

  // Transform conversation data to table format
  const tableData = useMemo<Conversation[]>(() => {
    if (!conversationsData?.data?.payload) {
      return [];
    }

    return conversationsData.data.payload.map(
      (conv: TChatwootConversation) => ({
        id: conv.id,
        agentName: conv.meta?.sender?.name || "Unknown",
        thumbnail: conv.meta?.sender?.thumbnail || "",
        channel: conv.meta?.channel || "", // Keep original channel format
        messageCount: conv.messages?.length || conv.unread_count || 0,
        status: mapStatus(conv.status),
        lastActivity: formatTimeAgo(conv.last_activity_at),
      }),
    );
  }, [conversationsData]);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6 animate-pulse">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-6 w-48 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-20 bg-gray-200 rounded-lg dark:bg-gray-700" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg dark:bg-gray-700" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-200 rounded-md dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded dark:bg-gray-700" />
                <div className="h-3 w-20 bg-gray-200 rounded dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tableData.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
        <div className="flex flex-col gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Conversations
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <HugeiconsIcon
              icon={FilterIcon}
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
            />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              No conversations yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No conversations found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Conversations
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200">
            <HugeiconsIcon icon={FilterIcon} className="size-5" />
            Filter
          </button> */}
          <Button
            variant="outline"
            onClick={() => {
              router.push("/inbox");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
          >
            See all
          </Button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                headers="customers"
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customers
              </TableCell>
              <TableCell
                headers="channel"
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Channel
              </TableCell>
              <TableCell
                headers="messages"
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Messages
              </TableCell>
              <TableCell
                headers="status"
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.slice(0, 5).map((conversation) => (
              <TableRow key={conversation.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    {conversation.thumbnail ? (
                      <Image
                        src={conversation.thumbnail}
                        alt={conversation.agentName}
                        width={50}
                        height={50}
                        className="h-[50px] w-[50px] rounded-md object-cover"
                      />
                    ) : (
                      <Image
                        src={DemoUserProfileImage}
                        alt={conversation.agentName}
                        width={50}
                        height={50}
                        className=" h-16 w-16 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {conversation.agentName}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {conversation.lastActivity}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  {conversation.channel &&
                  conversation.channel.toLowerCase() !== "channel::api" &&
                  normalizeChannelType(conversation.channel) ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center size-7 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-all cursor-pointer">
                            {renderChannelIcon(conversation.channel)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs">
                          <p>{getChannelName(conversation.channel)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : null}
                </TableCell>
                <TableCell className="py-3  text-theme-sm font-medium dark:text-gray-300">
                  <div className="text-gray-500 dark:text-gray-400">
                    {conversation.messageCount}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    variant={
                      conversation.status === "Active"
                        ? "default"
                        : conversation.status === "Resolved"
                          ? "secondary"
                          : "destructive"
                    }
                    className={
                      conversation.status === "Active"
                        ? "bg-green-500 hover:bg-green-600"
                        : conversation.status === "Resolved"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : ""
                    }
                  >
                    {conversation.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {conversationsData?.pagination && (
        <div className="flex justify-center mt-4">
          <Pagination
            pagination={conversationsData.pagination}
            isLoading={isLoading}
            pageParamKey="page"
          />
        </div>
      )}
    </div>
  );
}
