"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NotificationDropdown: React.FC = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: "New message",
      description: "You have a new message from John",
      time: "5m ago",
      read: false,
    },
    {
      id: 2,
      title: "Agent updated",
      description: "Your AI agent has been updated successfully",
      time: "1h ago",
      read: false,
    },
    {
      id: 3,
      title: "System update",
      description: "New features available",
      time: "2h ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700 rounded-full"
          aria-label="Notifications"
        >
          <div className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 flex items-center justify-center transition-all hover:bg-gray-200 dark:hover:bg-gray-800/50 hover:text-gray-700 ">
            <HugeiconsIcon icon={Notification03Icon} className="h-5 w-5" />
          </div>
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 ml-6 -left-6 ">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "group flex flex-col items-start gap-1 p-3 cursor-pointer",
                  !notification.read && "bg-blue-50 dark:bg-blue-950/20",
                )}
              >
                <div className="flex w-full items-start justify-between">
                  <p className="text-sm font-medium group-hover:text-gray-200 dark:group-hover:text-gray-200 duration-200 ease-in transition-all">
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-gray-200 dark:group-hover:text-gray-200 duration-200 ease-in transition-all">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground group-hover:text-gray-200 dark:group-hover:text-gray-200 duration-200 ease-in transition-all">
                  {notification.time}
                </p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center cursor-pointer text-sm font-medium text-blue-600">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
