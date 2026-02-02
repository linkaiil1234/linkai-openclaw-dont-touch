import { useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMCPAuthUrl } from "@/hooks/api/mcp";
import { useUpdateAgent, TUpdateAgentPayload } from "@/hooks/api/agent";
import type { TAgentConfig } from "@/types/models/agent";

export interface UseConnectMCPToolOptions {
  agentId: string;
  toolId: string;
  currentConfig?: TAgentConfig | { channels?: any[]; tools?: any[] } | null;
  // Optional callbacks
  onSuccess?: () => void;
  onError?: (error?: string) => void;
  // Optional optimistic update handlers
  selectedTools?: string[];
  setSelectedTools?: (updater: (prev: string[]) => string[]) => void;
  connectingToolId?: string | null;
  setConnectingToolId?: (id: string | null) => void;
  // Optional query invalidation keys
  invalidateQueries?: Array<{ queryKey: unknown[] }>;
  // Optional check for already connected
  checkAlreadyConnected?: (toolId: string) => boolean;
  onAlreadyConnected?: (toolName: string) => void;
}

export interface ConnectToolOptions {
  onDialogClose?: () => void;
}

export const useConnectMCPTool = (options: UseConnectMCPToolOptions) => {
  const {
    agentId,
    toolId,
    currentConfig,
    onSuccess,
    onError,
    selectedTools,
    setSelectedTools,
    connectingToolId,
    setConnectingToolId,
    invalidateQueries,
    checkAlreadyConnected,
    onAlreadyConnected,
  } = options;

  const queryClient = useQueryClient();

  // Get MCP auth URL hook (disabled by default, will be triggered manually)
  const { refetch: getMCPAuthUrl, isFetching: isGettingAuthUrl } =
    useGetMCPAuthUrl(
      {
        tool_id: toolId,
        agent_id: agentId,
      },
      {
        enabled: false,
      },
    );

  // Update agent mutation
  const { mutate: updateAgent, isPending: isUpdatingAgent } = useUpdateAgent({
    onSuccess: () => {
      toast.success("Tool connected successfully");

      // Reset connecting state
      if (setConnectingToolId) {
        setConnectingToolId(null);
      }

      // Invalidate queries
      if (invalidateQueries) {
        invalidateQueries.forEach(({ queryKey }) => {
          queryClient.invalidateQueries({ queryKey });
        });
      } else {
        // Default invalidation
        queryClient.invalidateQueries({
          queryKey: ["useGetAgentById", agentId],
        });
      }

      // Call custom success handler
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      // Revert optimistic update on error
      if (toolId && setSelectedTools) {
        setSelectedTools((prev) => prev.filter((id) => id !== toolId));
      }

      if (setConnectingToolId) {
        setConnectingToolId(null);
      }

      const errorMessage = error?.message || "Failed to connect tool";
      toast.error(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    },
  });

  const connectTool = useCallback(
    async (options?: ConnectToolOptions) => {
      const { onDialogClose } = options || {};
      if (!agentId) {
        toast.error("No agent specified");
        return;
      }

      if (!toolId) {
        toast.error("No tool selected");
        return;
      }

      // Check if already connected
      if (checkAlreadyConnected && checkAlreadyConnected(toolId)) {
        if (onAlreadyConnected) {
          onAlreadyConnected("Tool");
        }
        return;
      }

      try {
        // Get MCP auth URL
        const result = await getMCPAuthUrl();

        if (!result.data?.data?.auth_url) {
          // Revert optimistic update if auth URL fails
          if (toolId && setSelectedTools) {
            setSelectedTools((prev) => prev.filter((id) => id !== toolId));
          }
          if (setConnectingToolId) {
            setConnectingToolId(null);
          }
          toast.error("Failed to get authentication URL");
          if (onError) {
            onError("Failed to get authentication URL");
          }
          return;
        }

        // Open auth URL in a new window/popup
        const authWindow = window.open(
          result.data.data.auth_url,
          "MCP Authentication",
          "width=600,height=700",
        );

        if (!authWindow) {
          toast.error("Please allow popups to complete authentication");
          if (onError) {
            onError("Please allow popups to complete authentication");
          }
          return;
        }

        // Close dialog if handler is provided
        if (onDialogClose) {
          onDialogClose();
        }

        // Optimistically add tool to selectedTools
        if (
          toolId &&
          setSelectedTools &&
          selectedTools &&
          !selectedTools.includes(toolId)
        ) {
          setSelectedTools((prev) => [...prev, toolId]);
        }

        // Set connecting state
        if (setConnectingToolId) {
          setConnectingToolId(toolId);
        }

        // Extract current IDs from config
        const currentToolIds = (currentConfig?.tools || []).map(
          (tool: string | { _id: string }) =>
            typeof tool === "string" ? tool : tool._id,
        );
        const currentChannelIds = (currentConfig?.channels || []).map(
          (channel: string | { _id: string }) =>
            typeof channel === "string" ? channel : channel._id,
        );

        // Update agent with new tool
        const updatePayload: TUpdateAgentPayload = {
          _id: agentId,
          config: {
            channels: currentChannelIds,
            tools: [...currentToolIds, toolId],
          } as TAgentConfig,
        };

        updateAgent(updatePayload);
      } catch (error: unknown) {
        // Revert optimistic update on error
        if (toolId && setSelectedTools) {
          setSelectedTools((prev) => prev.filter((id) => id !== toolId));
        }
        if (setConnectingToolId) {
          setConnectingToolId(null);
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to initiate authentication";
        toast.error(errorMessage);

        if (onError) {
          onError(errorMessage);
        }
      }
    },
    [
      agentId,
      toolId,
      currentConfig,
      getMCPAuthUrl,
      updateAgent,
      onSuccess,
      onError,
      selectedTools,
      setSelectedTools,
      connectingToolId,
      setConnectingToolId,
      invalidateQueries,
      checkAlreadyConnected,
      onAlreadyConnected,
      queryClient,
    ],
  );

  return {
    connectTool,
    isConnecting: isGettingAuthUrl || isUpdatingAgent,
  };
};
