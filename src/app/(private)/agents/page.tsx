"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Add01Icon,
  HelpCircleIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Input } from "@/components/ui/input";

import type { TAgent, TAgentWithPartialConfig } from "@/types/models/agent";
import {
  TDeleteAgentPayload,
  useDeleteAgent,
  useGetAllAgents,
  useUpdateAgent,
} from "@/hooks/api/agent";
import { useOpenClose } from "@/hooks/custom/use-open-close";
import { AgentCreationModal } from "@/components/shared/agent-creation-modal";
import { AgentCard } from "@/components/shared/agent-card";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { invalidateQueries } from "@/lib/query-client";
import { HugeiconsIcon } from "@hugeicons/react";
import { ProductTour } from "@/components/tour/product-tour";
import { useTour } from "@/hooks/custom/use-tour";
import { tourConfigs } from "@/constants/tour-configs";
import { Pagination } from "@/components/shared/pagination";
import { HowToCreateAgentDialog } from "@/components/agents/how-to-create-agent-dialog";

// Animation variants (matching Actions page style)
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Agents() {
  const { session } = useAuth();
  const [hasClosedModal, setHasClosedModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  // Check if user is authenticated (not anonymous)
  const isAuthenticated =
    session.user?.auth_type !== "anonymous" && !session.loading;

  // Tour functionality - use different tour keys for anonymous vs authenticated users
  // For authenticated users, use user-specific keys so each user gets their own tour state
  const { isTourOpen, completeTour, skipTour } = useTour({
    isAuthenticated,
    userId: session.user?._id,
    tourKey: isAuthenticated ? "agents-tour" : "agents-tour-anonymous",
  });

  const {
    isOpen: isAgentCreationModalOpen,
    open: openAgentCreationModal,
    onOpenChange: onAgentCreationModalOpenChange,
  } = useOpenClose();

  const {
    isOpen: isHowToDialogOpen,
    open: openHowToDialog,
    onOpenChange: onHowToDialogOpenChange,
  } = useOpenClose();

  // Auto-open modal for anonymous users
  useEffect(() => {
    if (
      session.user?.auth_type === "anonymous" &&
      !session.loading &&
      !hasClosedModal
    ) {
      openAgentCreationModal();
    }
  }, [
    session.user?.auth_type,
    session.loading,
    openAgentCreationModal,
    hasClosedModal,
  ]);

  // Handle modal close
  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setHasClosedModal(true);
      // Refetch agents when modal is closed
      invalidateQueries({ queryKey: ["useGetAllAgents"] });
    }
    onAgentCreationModalOpenChange(open);
  };
  const { mutate: deleteAgent } = useDeleteAgent({
    onSuccess: (data) => {
      toast.success(data.message);
      invalidateQueries({ queryKey: ["useGetAllAgents"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateAgentStatus } = useUpdateAgent({
    onSuccess: () => {
      toast.success("Agent status updated successfully");
      invalidateQueries({ queryKey: ["useGetAllAgents"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteAgent = ({ _id }: TDeleteAgentPayload) => {
    deleteAgent({ _id: _id });
    invalidateQueries({ queryKey: ["useGetAllAgents"] });
  };

  const handleStatusChange = (agentId: string, currentStatus: string) => {
    updateAgentStatus({
      _id: agentId,
      status: currentStatus === "active" ? "inactive" : "active",
    });
  };

  // Fetch agents with polling enabled when any agent is being set up
  const { data: agents } = useGetAllAgents(
    {},
    {
      refetchInterval: (query) => {
        const agentsData = query.state.data?.data as
          | TAgentWithPartialConfig[]
          | undefined;
        // Poll every 3 seconds if any agent has setup_step < 5
        const hasIncompleteSetup = agentsData?.some(
          (agent) => agent.setup_step < 5,
        );
        return hasIncompleteSetup ? 3000 : false;
      },
    },
  );

  const hasAgentInSetup = useMemo(() => {
    // Only disable if there's an agent that's actively being set up (1-4)
    // Allow creation when agents are not started (0) or onboarding (1-4)
    return false; // Always allow creating new agents
  }, [agents?.data]);

  // Filter agents by search query
  const filteredAgents = useMemo(() => {
    const allAgents = agents?.data ?? [];
    if (!searchQuery.trim()) {
      return allAgents;
    }
    const query = searchQuery.toLowerCase().trim();
    return allAgents.filter((agent) =>
      agent.name.toLowerCase().includes(query),
    );
  }, [agents?.data, searchQuery]);

  const totalPages = useMemo(() => {
    const totalAgents = filteredAgents.length;
    return Math.ceil(totalAgents / itemsPerPage);
  }, [filteredAgents.length]);

  // Ensure currentPage is valid
  const validCurrentPage = useMemo(() => {
    if (totalPages === 0) return 1;
    return Math.min(Math.max(1, currentPage), totalPages);
  }, [currentPage, totalPages]);

  // Pagination logic
  const paginatedAgents = useMemo(() => {
    const page = validCurrentPage;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAgents.slice(startIndex, endIndex);
  }, [filteredAgents, validCurrentPage]);

  // Handle search query change and reset pagination
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Helper function to get agent stats (mock data for demo)
  const getAgentStats = (
    agent: TAgent | TAgentWithPartialConfig,
    index: number,
  ) => {
    const stats = [
      {
        conversations: 1240,
        total: 1000,
        renewDays: 12,
        cost: 98000,
        progressColor: "bg-orange-500",
        extraUsage: true,
      },
      {
        conversations: 856,
        total: 1500,
        renewDays: 2,
        cost: 58000,
        progressColor: "bg-blue-500",
        extraUsage: false,
      },
      {
        conversations: 45,
        total: 100,
        renewDays: 30,
        cost: 10000,
        progressColor: "bg-gray-400",
        extraUsage: false,
      },
    ];
    return stats[index % stats.length];
  };

  return (
    <div
      className="w-full h-full mx-auto flex flex-col gap-1 container overflow-hidden p-4 "
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4  ">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1 items-start justify-start">
            <h1 className="text-xl font-semibold tracking-tight text-left">
              Your Agents
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Search, Manage and train your AI workforce
            </p>
          </div>
          <div className="flex items-center gap-2">
            {session.user?.auth_type === "anonymous" && (
              <Button
                onClick={openHowToDialog}
                className="rounded-lg px-6 font-semibold shadow-lg transition-all duration-300 cursor-pointer hover:shadow-xl"
              >
                <HugeiconsIcon
                  icon={HelpCircleIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={2}
                />
              </Button>
            )}
            <Button
              id="create-agent-button"
              onClick={openAgentCreationModal}
              disabled={hasAgentInSetup}
              className={`rounded-lg px-6  font-semibold shadow-lg transition-all duration-300 ${
                hasAgentInSetup
                  ? "cursor-not-allowed opacity-60"
                  : "hover:shadow-xl cursor-pointer"
              }`}
            >
              {hasAgentInSetup ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent" />
                </motion.div>
              ) : (
                <HugeiconsIcon icon={Add01Icon} className="h-5 w-5 mr-2" />
              )}
              {hasAgentInSetup ? "Setting up..." : "New Agent"}
            </Button>
          </div>
        </div>
        <div>
          <div className="relative border rounded-xl">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              placeholder="Search for agents by name..."
              className="pl-9 h-12 rounded-xl bg-background border-input"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Agents Grid */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 pb-8 overflow-y-auto scrollbar-hide rounded-xl pt-6 px-6 h-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Create New Agent Card */}
        <motion.div variants={item} className="w-full h-full">
          <CardContainer className="w-full h-full rounded-3xl">
            <CardBody className="w-full h-auto">
              <CardItem translateZ="50" className="w-full h-full rounded-3xl">
                <Card
                  onMouseEnter={() => !hasAgentInSetup && setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={hasAgentInSetup ? undefined : openAgentCreationModal}
                  className={`group relative rounded-3xl border transition-all duration-500 ease-in-out overflow-hidden cursor-pointer flex-1 gap-0 py-0 ${
                    hasAgentInSetup
                      ? "border-slate-200/60 cursor-not-allowed opacity-60"
                      : "border-gray-200/60 shadow-sm hover:shadow-xl"
                  }`}
                  id="create-agent-card"
                >
                  {/* Top Section - Gradient Banner with Chat Interface */}
                  <div
                    className={`relative h-[260px] rounded-t-3xl overflow-hidden ${
                      hasAgentInSetup
                        ? "bg-linear-to-tr from-slate-400 via-slate-300 to-slate-400"
                        : "bg-linear-to-tr from-gray-500 via-gray-300 to-slate-400"
                    }`}
                  >
                    {/* Chat Interface Mockup with Scrolling Animation */}
                    <div className="absolute inset-0 flex items-end justify-end px-20">
                      <CardItem translateZ="80" className="w-full">
                        <div className="relative w-full bg-white rounded-t-2xl shadow-xl p-4 transform transition-all duration-500 group-hover:scale-[1.02] border-b">
                          {/* Agent Name in Chat */}
                          <div className="mb-6 relative z-40">
                            <h3
                              className={`text-sm font-semibold text-gray-900 dark:text-white truncate ${
                                hasAgentInSetup ? "text-slate-500" : ""
                              }`}
                            >
                              {hasAgentInSetup
                                ? "Setting up Agent..."
                                : "Create New Agent"}
                            </h3>
                          </div>

                          {/* Scrolling Chat Messages */}
                          <motion.div
                            className="space-y-3 overflow-hidden min-h-[80px] relative z-10"
                            animate={
                              isHovered && !hasAgentInSetup
                                ? {
                                    y: [0, -30, 0],
                                  }
                                : { y: 0 }
                            }
                            transition={{
                              duration: 3,
                              repeat:
                                isHovered && !hasAgentInSetup ? Infinity : 0,
                              ease: "easeInOut",
                            }}
                          >
                            <div className="flex gap-2">
                              <div className="w-32 h-6 bg-gray-100 rounded-full" />
                            </div>
                            <div className="flex justify-end">
                              <div className="w-40 h-6 bg-gray-300 rounded-full" />
                            </div>
                            <div className="flex gap-2">
                              <div className="w-28 h-6 bg-gray-100 rounded-full" />
                            </div>
                            <div className="flex justify-end">
                              <div className="w-36 h-6 bg-gray-300 rounded-full" />
                            </div>
                          </motion.div>
                          {/* <div className=" w-max flex items-center justify-center border border-gray-200 rounded-full p-4 mx-auto">
                            <PlusIcon className="size-20" />
                          </div> */}
                        </div>
                      </CardItem>
                    </div>
                  </div>

                  {/* Bottom Section - White Background with Details */}
                  <CardItem translateZ="60" className="w-full">
                    <div className="relative w-full p-6 rounded-b-3xl">
                      <div className="w-full flex items-start justify-between gap-4">
                        {/* Left Side - Agent Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-start gap-2 mb-2">
                            <h3
                              className={`text-xl font-bold truncate ${
                                hasAgentInSetup
                                  ? "text-slate-500"
                                  : "text-gray-900"
                              }`}
                            >
                              {hasAgentInSetup
                                ? "Setting up Agent..."
                                : "Create New Agent"}
                            </h3>
                            <div
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${
                                hasAgentInSetup ? "bg-slate-100" : "bg-blue-50"
                              }`}
                            >
                              <motion.span
                                className={`size-1.5 rounded-xl ${
                                  hasAgentInSetup
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                                } ${!hasAgentInSetup ? "animate-pulse" : ""}`}
                                animate={
                                  hasAgentInSetup ? { scale: [1, 1.3, 1] } : {}
                                }
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                              />
                              <span
                                className={`text-xs font-medium ${
                                  hasAgentInSetup
                                    ? "text-slate-600"
                                    : "text-blue-700"
                                }`}
                              >
                                {hasAgentInSetup ? "Please Wait..." : "Ready"}
                              </span>
                            </div>
                          </div>

                          {/* Skeleton Channel Icons */}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-7 w-7 rounded-lg bg-gray-200 animate-pulse" />
                            <div className="h-7 w-7 rounded-lg bg-gray-200 animate-pulse" />
                            <div className="h-7 w-7 rounded-lg bg-gray-200 animate-pulse" />
                            <div className="h-7 w-7 rounded-lg bg-gray-200 animate-pulse" />
                          </div>

                          {/* Description Text */}
                          {/* <p
                            className={`text-sm mt-3 line-clamp-2 leading-relaxed ${
                              hasAgentInSetup
                                ? "text-slate-500"
                                : "text-gray-600"
                            }`}
                          >
                            {hasAgentInSetup
                              ? "Another agent is being configured. Please wait..."
                              : "Build and configure a custom AI agent for your business needs"}
                          </p> */}
                        </div>

                        {/* Right Side - Action Button */}
                        <Button
                          size="sm"
                          disabled={hasAgentInSetup}
                          className={`text-sm font-semibold text-white gap-2 shadow-sm rounded-xl px-4 h-11 shrink-0 ${
                            hasAgentInSetup
                              ? "bg-slate-400 cursor-not-allowed"
                              : "bg-slate-900 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md transition-all duration-200 cursor-pointer"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!hasAgentInSetup) {
                              openAgentCreationModal();
                            }
                          }}
                        >
                          {hasAgentInSetup ? "Please Wait" : "Get Started"}
                          {hasAgentInSetup ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent" />
                            </motion.div>
                          ) : (
                            <HugeiconsIcon
                              icon={Add01Icon}
                              className="h-3.5 w-3.5"
                            />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardItem>
                </Card>
              </CardItem>
            </CardBody>
          </CardContainer>
        </motion.div>
        {/* Agent Cards */}
        {paginatedAgents.length > 0 ? (
          <>
            {paginatedAgents.map((agent, index) => {
              const originalIndex =
                (validCurrentPage - 1) * itemsPerPage + index;
              const stats = getAgentStats(agent, originalIndex);

              return (
                <AgentCard
                  setup_step={agent.setup_step}
                  key={agent._id}
                  agent={agent}
                  index={originalIndex}
                  stats={stats}
                  onDelete={handleDeleteAgent}
                  onStatusChange={handleStatusChange}
                  variants={item}
                />
              );
            })}
          </>
        ) : null}
      </motion.div>
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          pagination={{
            page: validCurrentPage,
            limit: itemsPerPage,
            total_pages: totalPages,
            total_count: filteredAgents.length,
          }}
          onChange={(page) => setCurrentPage(page)}
        />
      )}
      <AgentCreationModal
        open={isAgentCreationModalOpen}
        onOpenChange={handleModalOpenChange}
      />
      <HowToCreateAgentDialog
        open={isHowToDialogOpen}
        onOpenChange={onHowToDialogOpenChange}
      />
      {/* Product Tour */}
      {session.user?.auth_type === "anonymous" ? (
        <></>
      ) : (
        // <></>
        <ProductTour
          isOpen={isTourOpen}
          onComplete={completeTour}
          onSkip={skipTour}
          steps={tourConfigs.agents.steps}
        />
      )}
    </div>
  );
}
