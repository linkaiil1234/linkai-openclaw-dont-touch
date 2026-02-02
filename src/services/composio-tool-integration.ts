import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { queryClient as globalQueryClient } from "@/lib/query-client";

export interface ComposioAuthSuccessHandler {
  onSuccess: () => void;
  onError?: (error?: string) => void;
}

export interface ComposioMessageHandlerConfig {
  agentId: string;
  queryClient?: QueryClient; // Optional, will use global queryClient if not provided
  onSuccess?: () => void;
  onError?: (error?: string) => void;
  // Optional: for agent-creation-modal specific logic
  connectingToolId?: string | null;
  setConnectingToolId?: (id: string | null) => void;
  selectedTools?: string[];
  setSelectedTools?: (updater: (prev: string[]) => string[]) => void;
  setIsToolDialogOpen?: (open: boolean) => void;
  // Optional: for all-tools-dialog specific logic
  onDialogClose?: (open: boolean) => void;
}

export const createComposioMessageHandler = (
  config: ComposioMessageHandlerConfig,
) => {
  return (event: MessageEvent) => {
    // Verify origin for security
    if (event.origin !== window.location.origin) {
      return;
    }

    if (!config.agentId) return;

    // Use provided queryClient or fall back to global one
    const queryClient = config.queryClient || globalQueryClient;

    if (event.data.type === "composio-auth-success") {
      toast.success("Integration connected successfully!");

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["useGetAgentById", config.agentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["useGetMCPAuthUrl"],
      });

      // Close the dialog if handler is provided (for agent-creation-modal)
      if (config.setIsToolDialogOpen) {
        config.setIsToolDialogOpen(false);
      }

      // Close the dialog if handler is provided (for all-tools-dialog)
      if (config.onDialogClose) {
        config.onDialogClose(false);
      }

      // Handle connectingToolId logic (for agent-creation-modal)
      if (config.connectingToolId !== undefined) {
        const toolIdToRevert = config.connectingToolId;
        if (config.setConnectingToolId) {
          config.setConnectingToolId(null);
        }

        // Add tool to selectedTools when connection succeeds
        if (
          toolIdToRevert &&
          config.selectedTools &&
          config.setSelectedTools &&
          !config.selectedTools.includes(toolIdToRevert)
        ) {
          config.setSelectedTools((prev) => [...prev, toolIdToRevert]);
        }
      }

      // Call custom success handler if provided
      if (config.onSuccess) {
        config.onSuccess();
      }
    } else if (event.data.type === "composio-auth-error") {
      toast.error(
        event.data.error || "Failed to connect integration. Please try again.",
      );

      // Handle connectingToolId logic (for agent-creation-modal)
      if (config.connectingToolId !== undefined) {
        const toolIdToRevert = config.connectingToolId;
        if (config.setConnectingToolId) {
          config.setConnectingToolId(null);
        }

        // Revert optimistic update on error
        if (toolIdToRevert && config.selectedTools && config.setSelectedTools) {
          config.setSelectedTools((prev) =>
            prev.filter((id) => id !== toolIdToRevert),
          );
        }
      }

      // Call custom error handler if provided
      if (config.onError) {
        config.onError(event.data.error);
      }
    }
  };
};
