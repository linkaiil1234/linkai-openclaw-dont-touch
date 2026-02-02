"use client";

import { useState, useMemo } from "react";
import {
  Search01Icon,
  ArrowUpDownIcon,
  MoreHorizontalIcon,
  Calling02Icon,
  UserIcon,
  MessageMultiple01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { InstagramIconGradient } from "@/constants/channel-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/constants/get-initials";

// Demo customer data
const DEMO_CUSTOMERS = [
  {
    id: "1",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    status: "Active",
    channel: "Whatsapp",
    lastActive: "2 min ago",
    orders: 12,
    spent: 2450.0,
    assignedTo: "Sales Assistant",
  },
  {
    id: "2",
    name: "David Smith",
    email: "david.smith@example.com",
    status: "Lead",
    channel: "Instagram",
    lastActive: "1 day ago",
    orders: 1,
    spent: 85.0,
    assignedTo: "Support Bot",
  },
  {
    id: "3",
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    status: "Active",
    channel: "Facebook",
    lastActive: "3 hours ago",
    orders: 5,
    spent: 450.5,
    assignedTo: "Sales Assistant",
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "m.brown@company.net",
    status: "Inactive",
    channel: "Phone",
    lastActive: "2 weeks ago",
    orders: 0,
    spent: 0.0,
    assignedTo: "Booking Manager",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    status: "Active",
    channel: "Whatsapp",
    lastActive: "10 min ago",
    orders: 8,
    spent: 1200.0,
    assignedTo: "Sales Assistant",
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "robert.t@example.com",
    status: "Blocked",
    channel: "Facebook",
    lastActive: "1 month ago",
    orders: 2,
    spent: 120.0,
    assignedTo: "Support Bot",
  },
  {
    id: "7",
    name: "Jennifer Martin",
    email: "jen.m@example.com",
    status: "Lead",
    channel: "Instagram",
    lastActive: "5 hours ago",
    orders: 0,
    spent: 0.0,
    assignedTo: "Sales Assistant",
  },
  {
    id: "8",
    name: "William White",
    email: "will.white@example.com",
    status: "Active",
    channel: "Phone",
    lastActive: "1 hour ago",
    orders: 3,
    spent: 350.0,
    assignedTo: "Support Bot",
  },
];

type SortKey = "name" | "status" | "lastActive" | "spent" | "orders";
type SortOrder = "asc" | "desc";

export const Table = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isLoading] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = DEMO_CUSTOMERS.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: string | number = a[sortKey];
        let bValue: string | number = b[sortKey];

        if (sortKey === "spent" || sortKey === "orders") {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else if (sortKey === "lastActive") {
          const timeUnits: Record<string, number> = {
            min: 1,
            hour: 60,
            day: 1440,
            week: 10080,
            month: 43200,
          };
          const parseTime = (str: string) => {
            const match = str.match(/(\d+)\s*(min|hour|day|week|month)/);
            if (match) {
              return Number(match[1]) * timeUnits[match[2]];
            }
            return 0;
          };
          aValue = parseTime(String(aValue));
          bValue = parseTime(String(bValue));
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchQuery, sortKey, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Lead":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      case "Blocked":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Whatsapp":
        return <IoLogoWhatsapp className="size-4 text-green-600" />;
      case "Instagram":
        return <InstagramIconGradient className="size-4" />;
      case "Facebook":
        return <FaFacebookSquare className="size-4 text-blue-600" />;
      case "Phone":
        return (
          <HugeiconsIcon
            icon={Calling02Icon}
            className="size-4 text-purple-600"
          />
        );
      default:
        return (
          <HugeiconsIcon icon={MessageMultiple01Icon} className="size-4" />
        );
    }
  };

  return (
    <div className="flex flex-col rounded-xl border bg-background overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-4 bg-muted/50">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 h-10 rounded-xl bg-background border-input placeholder:text-muted-foreground placeholder:text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredAndSortedCustomers.length}
            </span>{" "}
            results
          </span>
        </div>
      </div>

      <div className="border-t overflow-x-auto">
        {isLoading ? (
          <CustomerTableSkeleton />
        ) : (
          <UITable>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="h-12 pl-6">
                  <button
                    onClick={() => handleSort("name")}
                    className="text-xs font-bold flex items-center gap-1 hover:text-foreground transition-colors uppercase tracking-wider text-muted-foreground"
                  >
                    Customer
                    <HugeiconsIcon
                      icon={ArrowUpDownIcon}
                      className="size-3.5"
                    />
                  </button>
                </TableHead>
                <TableHead className="h-12">
                  <button
                    onClick={() => handleSort("status")}
                    className="text-xs font-bold flex items-center gap-1 hover:text-foreground transition-colors uppercase tracking-wider text-muted-foreground"
                  >
                    Status
                    <HugeiconsIcon
                      icon={ArrowUpDownIcon}
                      className="size-3.5"
                    />
                  </button>
                </TableHead>
                <TableHead className="h-12 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Channel
                </TableHead>
                <TableHead className="h-12">
                  <button
                    onClick={() => handleSort("lastActive")}
                    className="text-xs font-bold flex items-center gap-1 hover:text-foreground transition-colors uppercase tracking-wider text-muted-foreground"
                  >
                    Last Active
                    <HugeiconsIcon
                      icon={ArrowUpDownIcon}
                      className="size-3.5"
                    />
                  </button>
                </TableHead>
                <TableHead className="h-12">
                  <button
                    onClick={() => handleSort("orders")}
                    className="text-xs font-bold flex items-center gap-1 hover:text-foreground transition-colors uppercase tracking-wider text-muted-foreground"
                  >
                    Orders / Spent
                    <HugeiconsIcon
                      icon={ArrowUpDownIcon}
                      className="size-3.5"
                    />
                  </button>
                </TableHead>
                <TableHead className="h-12 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Assigned To
                </TableHead>
                <TableHead className="h-12 text-xs font-bold uppercase tracking-wider text-muted-foreground pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <HugeiconsIcon
                        icon={UserIcon}
                        className="size-8 text-muted-foreground"
                      />
                      <p className="text-sm text-muted-foreground">
                        No customers found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="text-xs font-medium">
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs text-foreground font-bold">
                            {customer.name}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={
                          getStatusColor(customer.status) +
                          " text-[10px] font-semibold"
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(customer.channel)}
                        <span className="text-xs font-semibold">
                          {customer.channel}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {customer.lastActive}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">
                          ${customer.spent.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {customer.orders} orders
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6 text-xs font-semibold">
                          <AvatarFallback className="text-[10px] bg-primary/10 font-semibold">
                            {customer.assignedTo
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold">
                          {customer.assignedTo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <HugeiconsIcon
                              icon={MoreHorizontalIcon}
                              className="size-4"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </UITable>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 bg-muted/50 border-t">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="size-8 p-0">
            1
          </Button>
          <Button variant="outline" size="sm" className="size-8 p-0">
            2
          </Button>
          <Button variant="outline" size="sm" className="size-8 p-0">
            3
          </Button>
        </div>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
};

// Skeleton Loading Component
const CustomerTableSkeleton = () => {
  return (
    <UITable>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">
            Customer
          </TableHead>
          <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">
            Channel
          </TableHead>
          <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">
            Last Active
          </TableHead>
          <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">
            Orders / Spent
          </TableHead>
          <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">
            Assigned To
          </TableHead>
          <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(8)].map((_, i) => (
          <TableRow key={i} className="hover:bg-muted/30">
            <TableCell className="py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </TableCell>
            <TableCell className="py-4">
              <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
            <TableCell className="py-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
            </TableCell>
            <TableCell className="py-4">
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="py-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </TableCell>
            <TableCell className="py-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </TableCell>
            <TableCell className="py-4">
              <Skeleton className="size-8 rounded" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </UITable>
  );
};
