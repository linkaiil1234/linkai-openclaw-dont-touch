import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import IntegrationsSection from "@/components/shared/integrations-section";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateAgent } from "@/hooks/api/agent";
import { toast } from "sonner";
import { invalidateQueries } from "@/lib/query-client";
import { TAgentConfig } from "@/types/models/agent";
import { useState, useEffect } from "react";
import { useDeleteMCP } from "@/hooks/api/mcp";
import { useConnectMCPTool } from "@/hooks/custom/use-connect-mcp-tool";
import { DisconnectToolDialog } from "@/components/dialog/disconnect-tool-dialog";
import { createComposioMessageHandler } from "@/services/composio-tool-integration";

interface Tool {
  _id: string;
  name: string;
  icon?: React.ReactNode;
  icon_url?: string;
  color: string;
  description: string;
  bgGradient: string;
  isConnected?: boolean;
}

interface AllIntegrationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  agentConfig?: TAgentConfig;
  tools: Array<{
    _id: string;
    name?: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color?: string;
    isConnected: boolean;
    description?: string;
    bgGradient?: string;
  }>;
  onToolClick?: (
    tool: {
      _id: string;
      name: string;
      icon?: React.ReactNode;
      icon_url?: string;
      color: string;
      description: string;
      bgGradient: string;
    },
    type: "tool",
  ) => void;
}

export const AllIntegrationsDialog = ({
  open,
  onOpenChange,
  agentId,
  agentConfig,
  tools,
}: AllIntegrationsDialogProps) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showConnectToolDialog, setShowConnectToolDialog] = useState(false);
  const [showDisconnectToolDialog, setShowDisconnectToolDialog] =
    useState(false);

  // Update agent mutation (still needed for other operations)
  const { mutate: updateAgent, isPending: isUpdatingAgent } = useUpdateAgent({
    onSuccess: () => {
      // toast.success("Integration connected successfully!");
      invalidateQueries({ queryKey: ["useGetAgentById", agentId] });
      // invalidateQueries({ queryKey: ["useGetMCPAuthUrl"] });
      // onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete MCP mutation
  const { mutate: deleteMCP } = useDeleteMCP({
    onSuccess: (data) => {
      // toast.success(data.message || "MCP disconnected successfully")
    },
  });

  // Connect MCP tool hook
  const { connectTool: connectMCPTool } = useConnectMCPTool({
    agentId,
    toolId: selectedTool?._id || "",
    currentConfig: agentConfig,
    invalidateQueries: [{ queryKey: ["useGetAgentById", agentId] }],
  });

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    // If tool is already connected, show disconnect dialog
    // Otherwise show connect dialog
    if (tool.isConnected) {
      setShowDisconnectToolDialog(true);
    } else {
      setShowConnectToolDialog(true);
    }
  };

  const handleCloseAgentDialog = () => {
    setShowConnectToolDialog(false);
    setSelectedTool(null);
  };

  const handleDisconnectTool = (toolId: string, toolName: string) => {
    if (!agentId) return;

    deleteMCP({
      agent_id: agentId,
      tool_id: toolId,
    });

    updateAgent(
      {
        _id: agentId,
        config: {
          ...agentConfig,
          tools: (agentConfig?.tools || []).filter((id) => id !== toolId),
        } as TAgentConfig,
      },
      {
        onSuccess: () => {
          toast.success(`${toolName} disconnected successfully`);
          invalidateQueries({ queryKey: ["useGetAgentById", agentId] });
          setShowDisconnectToolDialog(false);
          setSelectedTool(null);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to disconnect");
        },
      },
    );
  };

  // Listen for postMessage from popup window
  useEffect(() => {
    const handleMessage = createComposioMessageHandler({
      agentId,
      onDialogClose: onOpenChange,
    });

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [agentId, onOpenChange]);

  const handleConnect = async () => {
    if (!selectedTool) {
      toast.error("No tool selected");
      return;
    }

    if (!agentId) {
      toast.error("No agent specified");
      return;
    }

    // Use the common hook for MCP tool connection
    await connectMCPTool({ onDialogClose: handleCloseAgentDialog });
  };

  return (
    <>
      {/* Main Integrations List Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          enableDialogClose
          className="max-h-[85vh] overflow-hidden bg-white/95 backdrop-blur-2xl border border-gray-200 shadow-2xl rounded-2xl p-0 animate-in fade-in-0 zoom-in-95 duration-300"
          style={{ width: "60vw", maxWidth: "60vw" }}
        >
          <DialogHeader className="px-8 pt-8 pb-6 border-b border-gray-100 bg-linear-to-b from-gray-50/50 to-transparent ">
            <DialogTitle className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2 ">
              <span>Integrate with your favorite tools</span>
              <Link href="/integrations" className="text-blue-500">
                <ExternalLink className="w-4 h-4" />
              </Link>
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-2">
              Connect seamlessly with popular platforms and services to enhance
              your workflow.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto hide-scrollbar px-8 pb-8 max-h-[calc(85vh-140px)] scroll-smooth">
            <IntegrationsSection
              tools={tools.map(
                (tool): Tool => ({
                  _id: tool._id,
                  name: tool.name || "Tool",
                  icon: tool.icon,
                  icon_url: tool.icon_url,
                  color: tool.color || "#6366F1",
                  description: tool.description || "External tool integration",
                  bgGradient:
                    tool.bgGradient ||
                    `from-[${tool.color || "#6366F1"}]/20 to-[${
                      tool.color || "#6366F1"
                    }]/5`,
                  isConnected: tool.isConnected,
                }),
              )}
              onToolClick={handleToolClick}
              onClose={() => onOpenChange(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Connect Confirmation Dialog */}
      <Dialog
        open={showConnectToolDialog}
        onOpenChange={setShowConnectToolDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Connect {selectedTool?.name}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Connect this integration to your agent.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border bg-muted/40 p-4">
              <h4 className="font-medium text-sm mb-2">
                What you&apos;ll need:
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    An active {selectedTool?.name} account with admin access
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
              {selectedTool?.name} account. You can revoke access at any time
              from your settings.
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseAgentDialog}
              disabled={isUpdatingAgent}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={isUpdatingAgent}
              className="cursor-pointer"
            >
              {isUpdatingAgent ? "Connecting..." : "Connect Integration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation Dialog */}
      <DisconnectToolDialog
        open={showDisconnectToolDialog}
        onOpenChange={setShowDisconnectToolDialog}
        tool={selectedTool}
        onConfirmDisconnect={handleDisconnectTool}
        isDisconnecting={isUpdatingAgent}
      />
    </>
  );
};
