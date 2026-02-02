"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryParams } from "@/hooks/custom/use-query-params";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FeatureCard3D } from "@/components/shared/feature-card-3d";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import {
  useGetAllToolsWithAgent,
  TGetAllToolsWithAgentQParams,
} from "@/hooks/api/tool";
import { ProductTour } from "@/components/tour/product-tour";
import { useTour } from "@/hooks/custom/use-tour";
import { tourConfigs } from "@/constants/tour-configs";
import { useAuth } from "@/providers/auth-provider";
import { useGetAllAgents } from "@/hooks/api/agent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TAgentConfig } from "@/types/models/agent";
import { useQueryClient } from "@tanstack/react-query";
import { useConnectMCPTool } from "@/hooks/custom/use-connect-mcp-tool";

type Integration = {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  iconBgColor: string;
  category: string;
};

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

const IntegrationsPage = () => {
  const { session } = useAuth();
  const { params, updateParams } = useQueryParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  const { data: toolsWithAgent, isLoading: isLoadingTools } =
    useGetAllToolsWithAgent({});

  // Fetch all agents for dropdown
  const { data: agentsData } = useGetAllAgents({});
  const agents = agentsData?.data || [];

  // Sync connected integrations with agent data
  const connectedIntegrations = useMemo(() => {
    const connected: Record<string, boolean> = {};
    agents.forEach((agent) => {
      const toolIds = (agent.config?.tools || []).map(
        (tool: string | { _id: string }) =>
          typeof tool === "string" ? tool : tool._id,
      );
      toolIds.forEach((toolId) => {
        connected[toolId] = true;
      });
    });
    return connected;
  }, [agents]);

  // Query client for invalidation
  const queryClient = useQueryClient();

  // Find the selected agent
  const selectedAgent = agents.find((agent) => agent._id === selectedAgentId);

  // Connect MCP tool hook
  const { connectTool: connectMCPTool } = useConnectMCPTool({
    agentId: selectedAgentId || "",
    toolId: selectedIntegration?.id || "",
    currentConfig: selectedAgent?.config as any,
    invalidateQueries: [
      { queryKey: ["useGetAllAgents"] },
      { queryKey: ["useGetAllToolsWithAgent"] },
    ],
    checkAlreadyConnected: (toolId: string) => {
      if (!selectedAgent) return false;
      const currentToolIds = (selectedAgent.config?.tools || []).map(
        (tool: string | { _id: string }) =>
          typeof tool === "string" ? tool : tool._id,
      );
      return currentToolIds.includes(toolId);
    },
    onAlreadyConnected: (toolName: string) => {
      toast.info(
        `${selectedIntegration?.name || toolName} is already connected to this agent`,
      );
      handleCloseDialog();
    },
  });

  const itemsPerPage = 9;
  const currentPage = parseInt(params.page || "1", 10);

  // Check if user is authenticated (not anonymous)
  const isAuthenticated =
    session.user?.auth_type !== "anonymous" && !session.loading;

  // Tour functionality - only for authenticated users
  // Use user-specific keys so each user gets their own tour state
  const { isTourOpen, completeTour, skipTour } = useTour({
    isAuthenticated,
    userId: session.user?._id,
    tourKey: "integrations-tour",
  });

  // Extract unique categories from toolsWithAgent data
  const categories = useMemo(() => {
    if (!toolsWithAgent?.data) return ["All"];
    const uniqueCategories = Array.from(
      new Set(
        toolsWithAgent.data
          .map((tool) => tool.category || "Tools")
          .filter(Boolean),
      ),
    ).sort();
    return ["All", ...uniqueCategories];
  }, [toolsWithAgent]);

  // Filter tools by search query and category
  const filteredTools = useMemo(() => {
    if (!toolsWithAgent?.data) return [];
    return toolsWithAgent.data.filter((tool) => {
      const matchesSearch =
        !searchQuery ||
        tool.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const toolCategory = tool.category || "Tools";
      const matchesCategory =
        selectedCategory === "All" || toolCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [toolsWithAgent, searchQuery, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.ceil((filteredTools.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIntegrations = filteredTools.slice(startIndex, endIndex);

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

  const handleAddIntegration = (integration: Integration) => {
    console.log("integration", integration);
    setSelectedIntegration(integration);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedIntegration(null);
    setSelectedAgentId("");
  };

  const handleConnect = async () => {
    if (!selectedIntegration || !selectedAgentId) {
      toast.error("Please select an agent");
      return;
    }

    if (!selectedAgent) {
      toast.error("Agent not found");
      return;
    }

    // Use the common hook for MCP tool connection
    await connectMCPTool({ onDialogClose: handleCloseDialog });
  };

  // Helper function to create Integration object from tool data
  const createIntegrationFromTool = (
    tool: TGetAllToolsWithAgentQParams,
  ): Integration => {
    const category = tool.category || "Tools";
    let iconBgColor = "bg-gray-50 text-gray-600";
    const categoryLower = category.toLowerCase();

    if (categoryLower.includes("communication")) {
      iconBgColor = "bg-blue-50 text-blue-600";
    } else if (categoryLower.includes("productivity")) {
      iconBgColor = "bg-purple-50 text-purple-600";
    } else if (
      categoryLower.includes("project") ||
      categoryLower.includes("management")
    ) {
      iconBgColor = "bg-indigo-50 text-indigo-600";
    } else if (categoryLower.includes("marketing")) {
      iconBgColor = "bg-yellow-50 text-yellow-600";
    }

    return {
      id: tool._id || "",
      name: tool.name || "",
      description:
        tool.description ||
        `Connect ${tool.name} to enhance your agent's capabilities.`,
      iconUrl: tool.icon_url || "https://cdn.simpleicons.org/link",
      iconBgColor,
      category,
    };
  };

  const handleToggleIntegration = (integrationId: string, checked: boolean) => {
    if (checked && !connectedIntegrations[integrationId]) {
      // If trying to enable, open dialog first
      const tool = filteredTools.find((t) => t._id === integrationId);
      if (tool) {
        const integration = createIntegrationFromTool(tool);
        handleAddIntegration(integration);
      }
    }
    // Note: Disabling is handled through agent config updates, not local state
  };

  return (
    <div
      className="flex gap-6 p-4 h-full "
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Category Sidebar */}
      <aside className="integration-categories w-64 shrink-0">
        <div className="sticky top-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Categories
            </h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {category}
                  <span className="ml-auto float-right text-xs opacity-60">
                    {category === "All"
                      ? filteredTools.length
                      : filteredTools.filter(
                          (tool) => (tool.category || "Tools") === category,
                        ).length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 relative">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Integrations
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Supercharge your agents with powerful capabilities
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="integration-search relative max-w-md border border-border rounded-lg">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              placeholder="Search for integrations..."
              className="pl-9 h-10 "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Integration Cards Grid */}
        {isLoadingTools ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              Loading integrations...
            </p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              No integrations found
            </p>
          </div>
        ) : (
          <>
            <motion.div
              className="integration-cards grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3 justify-items-center p-4 h-max"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {paginatedIntegrations.map((tool, index) => {
                const integration = createIntegrationFromTool(tool);
                return (
                  <motion.div key={tool._id || index} variants={item}>
                    <FeatureCard3D
                      agents={agents.filter((agent) =>
                        agent.config?.tools
                          ?.map((tool: string | { _id: string }) =>
                            typeof tool === "string" ? tool : tool._id,
                          )
                          .includes(tool._id || ""),
                      )}
                      name={integration.name}
                      description={integration.description}
                      iconUrl={integration.iconUrl}
                      buttonText="Connect"
                      onButtonClick={() => handleAddIntegration(integration)}
                      isEnabled={connectedIntegrations[tool._id || ""] || false}
                      onToggle={(checked) =>
                        handleToggleIntegration(tool._id || "", checked)
                      }
                      onMenuClick={() => handleAddIntegration(integration)}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-6 ">
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
      </div>

      {/* Integration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {selectedIntegration && (
                <div
                  className={`inline-flex items-center justify-center size-12 rounded-lg ${selectedIntegration.iconBgColor}`}
                >
                  <Image
                    src={selectedIntegration.iconUrl}
                    alt={`${selectedIntegration.name} logo`}
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </div>
              )}
              <div>
                <DialogTitle className="text-xl">
                  {selectedIntegration?.name}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedIntegration?.category}
                </p>
              </div>
            </div>
            <DialogDescription className="text-sm">
              {selectedIntegration?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agent-select" className="text-sm font-medium">
                Select Agent
              </Label>
              <Select
                value={selectedAgentId}
                onValueChange={setSelectedAgentId}
              >
                <SelectTrigger id="agent-select" className="w-full">
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.length === 0 ? (
                    <SelectItem value="no-agents" disabled>
                      No agents available
                    </SelectItem>
                  ) : (
                    agents
                      .filter((agent) => {
                        const toolIds = (agent.config?.tools || []).map(
                          (tool: string | { _id: string }) =>
                            typeof tool === "string" ? tool : tool._id,
                        );
                        return !toolIds.includes(selectedIntegration?.id || "");
                      })
                      .map((agent) => (
                        <SelectItem key={agent._id} value={agent._id}>
                          {agent.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <h4 className="font-medium text-sm mb-2">
                What you&apos;ll need:
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    An active {selectedIntegration?.name} account with admin
                    access
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Permission to authorize third-party applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>A few minutes to complete the setup process</span>
                </li>
              </ul>
            </div>

            <div className="text-xs text-muted-foreground">
              By connecting, you agree to allow access to your{" "}
              {selectedIntegration?.name} account. You can revoke access at any
              time from your settings.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleConnect} className=" cursor-pointer">
              Connect Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Tour */}
      <ProductTour
        isOpen={isTourOpen}
        onComplete={completeTour}
        onSkip={skipTour}
        steps={tourConfigs.integrations.steps}
      />
    </div>
  );
};

export default IntegrationsPage;
