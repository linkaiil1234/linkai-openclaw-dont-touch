"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search01Icon,
  ArrowUpDownIcon,
  MoreHorizontalIcon,
  UserMultipleIcon,
  InformationCircleIcon,
  Add01Icon,
  Loading01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdSms } from "react-icons/md";
import { FaTelegramPlane } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Table,
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
import {
  useGetAllClients,
  useDeleteClient,
  useGetAllClientsSynced,
} from "@/hooks/api/crm/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe2 } from "lucide-react";
import { ProductTour } from "@/components/tour/product-tour";
import { useTour } from "@/hooks/custom/use-tour";
import { tourConfigs } from "@/constants/tour-configs";
import { useAuth } from "@/providers/auth-provider";
import { InstagramIconGradient } from "@/constants/channel-icons";
import { useQueryParams } from "@/hooks/custom/use-query-params";
import { useInbox } from "@/providers/inbox-provider";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination,
} from "@/components/ui/pagination";
import { invalidateQueries } from "@/lib/query-client";
import { toast } from "sonner";
import { getAvatarColors, cn } from "@/lib/utils";
import { useOpenClose } from "@/hooks/custom/use-open-close";
import { NewCustomerDialog } from "@/components/new-customer-dialog";
import { getInitials } from "@/constants/get-initials";

type SortKey = "name" | "email" | "status";
type SortOrder = "asc" | "desc";

export default function Customers() {
  const router = useRouter();
  const { session } = useAuth();
  const { params, updateParams } = useQueryParams();
  const { openConversation } = useInbox();
  const { open, isOpen, onOpenChange } = useOpenClose();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const itemsPerPage = 10;
  const currentPage = parseInt(params.page || "1", 10);

  // Check if user is authenticated (not anonymous)
  const isAuthenticated =
    session.user?.auth_type !== "anonymous" && !session.loading;

  // Tour functionality - only for authenticated users
  // Use user-specific keys so each user gets their own tour state
  const { isTourOpen, completeTour, skipTour } = useTour({
    isAuthenticated,
    userId: session.user?._id,
    tourKey: "customers-tour",
  });

  const { mutate: syncWithChatwoot, isPending: isSyncingWithChatwoot } =
    useGetAllClientsSynced({
      onSuccess: () => {
        toast.success("Customers synced with Chatwoot");
        invalidateQueries({ queryKey: ["useGetAllClients"] });
      },
      onError: (error) => {
        toast.error("Failed to sync customers with Chatwoot");
      },
    });

  // Fetch customers from API
  const {
    data: clientsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllClients();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const { mutate: deleteClient } = useDeleteClient({
    onSuccess: () => {
      toast.success("Client deleted successfully");
      invalidateQueries({ queryKey: ["useGetAllClients"] });
    },
  });

  // Transform API data to match component structure
  const customers = useMemo(() => {
    if (!clientsResponse?.data) return [];

    return clientsResponse.data.map((client) => ({
      id: client._id,
      thumbnail: client.thumbnail,
      name: client.name || client.username || "Unknown",
      email: client.email || "No email",
      status: client.status === "online" ? "Active" : "Inactive",
      channels: [client.channel?.toLowerCase() || ""].filter(Boolean), // Convert to lowercase for icon matching
      phone: client.phone || "No phone",
      location: "N/A",
    }));
  }, [clientsResponse]);

  const filteredAndSortedCustomers = useMemo(() => {
    const sessionEmail = session.user?.email?.toLowerCase();

    let filtered = customers.filter((customer) => {
      // Filter out customers with email matching session email
      if (sessionEmail && customer.email.toLowerCase() === sessionEmail) {
        return false;
      }
      return (
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const aValue: string = String(a[sortKey]).toLowerCase();
        const bValue: string = String(b[sortKey]).toLowerCase();

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [customers, searchQuery, sortKey, sortOrder, session.user?.email]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / itemsPerPage,
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    startIndex,
    endIndex,
  );

  // Reset to page 1 if current page is out of bounds
  const validPage =
    currentPage > totalPages && totalPages > 0 ? 1 : currentPage;

  // Update page if it's invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateParams({ page: "1" });
    }
  }, [currentPage, totalPages, updateParams]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateParams({ page: page.toString() });
    }
  };

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

  // Channel icon rendering function
  const renderChannelIcon = (channelType: string) => {
    switch (channelType) {
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

  const getChannelName = (channelType: string) => {
    switch (channelType) {
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
        return channelType.charAt(0).toUpperCase() + channelType.slice(1);
    }
  };

  const handleSendMessage = (customerId: string) => {
    // console.log("handleSendMessage called with customerId:", customerId);
    // Set the conversation ID in the global context
    openConversation(customerId);
    // Navigate to inbox page
    router.push("/inbox");
  };

  return (
    <div
      className="flex flex-col gap-6 max-w-[1500px] mx-auto p-4 h-full "
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Customers
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage leads and customer relationships across all channels
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => syncWithChatwoot()}
              className="cursor-pointer"
            >
              <HugeiconsIcon icon={Loading01Icon} className="size-4 mr-2" />
              Sync with Chatwoot
            </Button> */}
            <Button
              variant="default"
              size="sm"
              onClick={open}
              className="bg-[#1A89FF] hover:bg-[#0D5FCC] cursor-pointer"
            >
              <HugeiconsIcon icon={Add01Icon} className="size-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className=" h-full">
        <div className="flex flex-col rounded-xl border bg-background overflow-hidden h-full">
          {/* Search and Filter Bar */}
          <div className="flex items-center justify-between gap-4 p-4 bg-muted/50">
            <div className="customer-search-bar relative flex-1 max-w-sm">
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
                  {filteredAndSortedCustomers.length > 0
                    ? `${startIndex + 1}-${Math.min(
                        endIndex,
                        filteredAndSortedCustomers.length,
                      )}`
                    : 0}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredAndSortedCustomers.length}
                </span>{" "}
                results
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="customers-table border-t overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 ">
                  <TableHead className="h-12 pl-6">
                    <button
                      onClick={() => handleSort("name")}
                      className="text-xs font-bold flex items-center gap-1 hover:text-foreground transition-colors uppercase tracking-wider text-muted-foreground"
                    >
                      User
                      <HugeiconsIcon
                        icon={ArrowUpDownIcon}
                        className="size-3.5"
                      />
                    </button>
                  </TableHead>
                  <TableHead className="h-12">
                    <button
                      onClick={() => handleSort("email")}
                      className="text-xs font-bold flex items-center gap-1 hover:text-foreground transition-colors uppercase tracking-wider text-muted-foreground"
                    >
                      Email
                      <HugeiconsIcon
                        icon={ArrowUpDownIcon}
                        className="size-3.5"
                      />
                    </button>
                  </TableHead>
                  <TableHead className="customer-channels-column h-12 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Channels
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
                  {/* <TableHead className="h-12">
                    <button
                      onClick={() => handleSort("spending")}
                      className="text-xs font-bold flex items-center gap-1 hover:text-foreground transition-colors uppercase tracking-wider text-muted-foreground"
                    >
                      Spending
                      <HugeiconsIcon
                        icon={ArrowUpDownIcon}
                        className="size-3.5"
                      />
                    </button>
                  </TableHead> */}
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider text-muted-foreground pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-9 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-7 w-16" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  // Error state
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <p className="text-sm text-destructive">
                        Failed to load customers. Please try again.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedCustomers.length === 0 ? (
                  // Empty state
                  <TableRow className="h-full">
                    <TableCell
                      colSpan={5}
                      className="text-center h-full py-16 px-6"
                    >
                      <div className=" h-full flex flex-col items-center justify-center max-w-md mx-auto">
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                          <div className="relative bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border border-primary/20">
                            <HugeiconsIcon
                              icon={UserMultipleIcon}
                              className="size-10 text-primary"
                            />
                          </div>
                        </div>
                        <h3 className="text-2xl font-semibold text-foreground mb-3">
                          No Customers Found
                        </h3>
                        <div className="space-y-2">
                          <p className="text-base text-muted-foreground leading-relaxed">
                            Here you will see your business customers from all
                            your connected channels.
                          </p>
                          <p className="text-sm text-muted-foreground/80 leading-relaxed whitespace-break-spaces">
                            When customers interact with your agents through
                            WhatsApp, Instagram, Telegram, or other channels,
                            their profiles will automatically appear here for
                            you to manage and track.
                          </p>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                          <HugeiconsIcon
                            icon={InformationCircleIcon}
                            className="size-4"
                          />
                          <span>
                            Sync with Chatwoot to load existing customers
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Data rows
                  paginatedCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => router.push(`/customers/${customer.id}`)}
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            {customer.thumbnail && (
                              <AvatarImage
                                src={customer.thumbnail}
                                alt={customer.name}
                                className="rounded-full"
                              />
                            )}
                            <AvatarFallback
                              className={cn(
                                "text-xs font-semibold rounded-full",
                                getAvatarColors(customer.name).bg,
                                getAvatarColors(customer.name).text,
                              )}
                            >
                              {getInitials(customer.name).slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-foreground font-bold">
                            {customer.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {customer.email}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <TooltipProvider>
                          <div className="flex -space-x-1">
                            {customer.channels.map((channel, index) => (
                              <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center justify-center size-7 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-all cursor-pointer">
                                    {renderChannelIcon(channel)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="text-xs"
                                >
                                  <p>{getChannelName(channel)}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </TooltipProvider>
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
                      {/* <TableCell className="py-4">
                        <span className="text-xs font-bold text-foreground">
                          ${customer.spending.toFixed(2)}
                        </span>
                      </TableCell> */}
                      <TableCell className="py-4 pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <HugeiconsIcon
                                icon={MoreHorizontalIcon}
                                className="size-4"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/customers/${customer.id}`)
                              }
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendMessage(customer.id);
                              }}
                            >
                              Send Message
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>Edit</DropdownMenuItem>*/}
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                deleteClient({
                                  client_id: customer.id,
                                });
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <ShadcnPagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    validPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={() => handlePageChange(validPage - 1)}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink isActive className="cursor-default">
                  {validPage}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  className={
                    validPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={() => handlePageChange(validPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </ShadcnPagination>
        </div>
      )}

      {/* Product Tour */}
      <ProductTour
        isOpen={isTourOpen}
        onComplete={completeTour}
        onSkip={skipTour}
        steps={tourConfigs.customers.steps}
      />

      {/* New Customer Dialog */}
      <NewCustomerDialog open={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
