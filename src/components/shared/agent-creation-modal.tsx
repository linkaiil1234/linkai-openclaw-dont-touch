import { useEffect, useRef, useState, startTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AnimatedBeam } from "@/components/shared/animated-beam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MotionModal } from "./motion-modal";
import {
  Cancel01Icon,
  Globe02Icon,
  CheckmarkCircle01Icon,
  SparklesIcon,
  ArrowLeft01Icon,
  ReloadIcon,
  FileAttachmentIcon,
  Delete02Icon,
  Link01Icon,
  TextIcon,
  Upload02Icon,
  Loading02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DottedGlowBackground } from "../animations/dotted-glow-background";
import {
  useCreateAgent,
  useGetAgentById,
  useUpdateAgent,
} from "@/hooks/api/agent";
import { toast } from "sonner";
import { RiGeminiFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllTools } from "@/hooks/api/tool";
import { createComposioMessageHandler } from "@/services/composio-tool-integration";
import {
  useCreateFileAsset,
  useCreateTextAsset,
  useCreateWebsiteAsset,
} from "@/hooks/api/asset";
import { useGetAllFilesByAgentId, useDeleteFileById } from "@/hooks/api/file";
import { useGetAllTextsByAgentId, useDeleteTextById } from "@/hooks/api/text";
import {
  useGetAllWebsitesByAgentId,
  useDeleteWebsiteById,
} from "@/hooks/api/website";
import { UrlInput } from "@/components/shared/url-input";
import { useCompleteWhatsAppSetup } from "@/hooks/api/chatwoot/whatsapp";
import { runEmbeddedSignupPopup } from "@/lib/meta/embedded-signup-popup";
import { useDeleteMCP } from "@/hooks/api/mcp";
import { useConnectMCPTool } from "@/hooks/custom/use-connect-mcp-tool";
import {
  AVAILABLE_CHANNELS,
  CREATION_STEPS,
  getStepDescription,
  getStepTitle,
  ORBIT_POSITIONS,
} from "@/constants/agent-onboarding-modal";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useSendMail } from "@/hooks/custom/use-send-mail";
import { GuestLoginDialog } from "../dialog/guest-login-dialog";
import { ToolConnectionDialog } from "@/components/agent-train/dialogs/tool-connection-dialog";
import { ChannelConnectionDialog } from "@/components/agent-train/dialogs/channel-connection-dialog";
import { DisconnectChannelDialog } from "../agent-train/dialogs/disconnect-channel-dialog";
import { DisconnectToolDialog } from "@/components/dialog/disconnect-tool-dialog";
import { invalidateQueries } from "@/lib/query-client";
import {
  useCreateTelegramInbox,
  useCreateWebWidgetInbox,
} from "@/hooks/api/chatwoot/inbox";

type AgentCreationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(25, "Name must be at most 25 characters"),
  prompt: z
    .string()
    .min(2, "Prompt must be at least 2 characters")
    .max(500, "Prompt must be at most 500 characters"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export const AgentCreationModal = ({
  open,
  onOpenChange,
}: AgentCreationModalProps) => {
  const beamContainerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const orbitRefs = useRef<(HTMLDivElement | null)[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      prompt: "",
      website: "",
    },
  });
  const router = useRouter();
  const watchedName = form.watch("name");
  const watchedPrompt = form.watch("prompt");

  const { session } = useAuth();

  // formStep: 1 = name/prompt, 2 = channels, 3 = tools, 4 = progress, 5 = completion
  const [formStep, setFormStep] = useState(1);
  const [signInModalOpen, setSignInModalOpen] = useState<boolean>(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentActiveStep, setCurrentActiveStep] = useState(0);
  const [shouldRefetchAgent, setShouldRefetchAgent] = useState(false);
  const [hasEmailBeenSent, setHasEmailBeenSent] = useState(false);

  // Channel Dialog States
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [channelDialogStep, setChannelDialogStep] = useState("step-2");
  const [clickedChannel, setClickedChannel] = useState<
    (typeof AVAILABLE_CHANNELS)[0] | null
  >(null);
  const [botToken, setBotToken] = useState("");
  const [isCreatingInbox, setIsCreatingInbox] = useState(false);
  const [channelCreationSuccess, setChannelCreationSuccess] = useState(false);
  const [welcomeTitle, setWelcomeTitle] = useState("");
  const [webWidgetData, setWebWidgetData] = useState<{
    web_widget_script: string;
    website_token: string;
    website_url: string;
  } | null>(null);

  // Mail service hook
  const { sendAgentCreationEmail } = useSendMail();

  // Tool Connection Dialog States
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [clickedTool, setClickedTool] = useState<{
    _id: string;
    name: string;
    icon_url: string;
    color: string;
    type: "channel" | "tool";
  } | null>(null);

  // Disconnect Dialog States
  const [isDisconnectChannelDialogOpen, setIsDisconnectChannelDialogOpen] =
    useState(false);
  const [isDisconnectToolDialogOpen, setIsDisconnectToolDialogOpen] =
    useState(false);
  const [disconnectingTool, setDisconnectingTool] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  // Loading states for connecting channels/tools
  const [connectingChannelId, setConnectingChannelId] = useState<string | null>(
    null,
  );
  const [connectingToolId, setConnectingToolId] = useState<string | null>(null);

  // Track actually connected tools from the agent
  const [connectedTools, setConnectedTools] = useState<string[]>([]);

  // Tool search state
  const [toolSearchQuery, setToolSearchQuery] = useState("");

  // Knowledge/Training Data States (Step 4)
  const [trainingText, setTrainingText] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isConnectingTool, setIsConnectingTool] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store channel configurations for later channel creation
  const [channelConfigs, setChannelConfigs] = useState<
    Record<string, { botToken?: string }>
  >({});

  const { mutate: deleteMCP } = useDeleteMCP();

  const { mutate: createAgent, isPending: isCreatingAgent } = useCreateAgent({
    onSuccess: (response) => {
      const agentId = response.data?._id ?? null;
      setCreatedAgentId(agentId);
      // Go to step 2 (channels) instead of jumping to step 4
      toast.success(response.message);
      if (agentId) {
        // Start refetching agent to track setup progress in background
        setShouldRefetchAgent(true);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: agent, isLoading: isLoadingAgent } = useGetAgentById(
    createdAgentId ?? "",
    {
      refetchInterval: shouldRefetchAgent ? 1000 : false,
      enabled: !!createdAgentId,
    },
  );

  // Fetch all tools
  const { data: toolsResponse } = useGetAllTools();

  const allTools = toolsResponse?.data || [];

  // Deduplicate tools by _id first
  const uniqueTools = Array.from(
    new Map(allTools.map((tool) => [tool._id, tool])).values(),
  );

  // Filter tools based on search query
  const tools = !toolSearchQuery.trim()
    ? uniqueTools
    : uniqueTools.filter((tool) =>
        tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()),
      );

  // Query client for invalidation
  const queryClient = useQueryClient();

  // Update agent mutation
  const { mutate: updateAgent, isPending: isUpdatingAgent } = useUpdateAgent();

  // Connect MCP tool hook
  const { connectTool: connectMCPTool, isConnecting: isConnectingMCPTool } =
    useConnectMCPTool({
      agentId: createdAgentId || "",
      toolId: clickedTool?._id || "",
      currentConfig: agent?.data?.config as any,
      selectedTools,
      setSelectedTools,
      connectingToolId,
      setConnectingToolId,
      invalidateQueries: createdAgentId
        ? [{ queryKey: ["useGetAgentById", createdAgentId] }]
        : undefined,
      checkAlreadyConnected: (toolId: string) => {
        if (!agent?.data?.config) return false;
        const toolIds = (agent.data.config.tools || []).map(
          (tool: string | { _id: string }) =>
            typeof tool === "string" ? tool : tool._id,
        );
        return toolIds.includes(toolId);
      },
      onAlreadyConnected: (toolName: string) => {
        toast.info(`${clickedTool?.name || toolName} is already connected`);
        setIsToolDialogOpen(false);
      },
    });

  // Listen for postMessage from popup window
  useEffect(() => {
    const handleMessage = createComposioMessageHandler({
      agentId: createdAgentId || "",
      queryClient,
      connectingToolId,
      setConnectingToolId,
      selectedTools,
      setSelectedTools,
      setIsToolDialogOpen,
    });

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    createdAgentId,
    queryClient,
    connectingToolId,
    selectedTools,
    setConnectingToolId,
    setSelectedTools,
    setIsToolDialogOpen,
  ]);

  // Sync selectedTools with agent's actual connected tools
  useEffect(() => {
    if (!createdAgentId || !agent?.data?.config?.tools) return;

    const toolsData = agent.data.config.tools || [];
    // Extract IDs - handle both string[] and object[] formats
    const toolIds = toolsData.map((item: string | { _id: string }) =>
      typeof item === "string" ? item : item._id,
    );

    // Update selectedTools to match agent's actual connected tools
    setSelectedTools((prev) => {
      // If they're different, sync with agent's tools
      if (
        prev.length !== toolIds.length ||
        !toolIds.every((id) => prev.includes(id))
      ) {
        return toolIds;
      }

      return prev;
    });
  }, [agent?.data?.config?.tools, createdAgentId]);

  // Update connectedTools when agent data changes
  useEffect(() => {
    if (!agent?.data?.config?.tools) {
      setConnectedTools([]);
      return;
    }

    const toolsData = agent.data.config.tools || [];
    // Extract IDs - handle both string[] and object[] formats
    const toolIds = toolsData.map((item: string | { _id: string }) =>
      typeof item === "string" ? item : item._id,
    );

    setConnectedTools(toolIds);

    // Clear loading state for any tool that just got connected
    if (connectingToolId && toolIds.includes(connectingToolId)) {
      setConnectingToolId(null);
    }
  }, [agent?.data?.config?.tools, connectingToolId]);

  // Knowledge/Training Data Queries (only fetch when agent exists and user is on step 4 or later)
  const shouldFetchAssets = !!createdAgentId && formStep >= 4;

  const { data: filesResponse, refetch: refetchFiles } =
    useGetAllFilesByAgentId(
      { agent_id: createdAgentId as string },
      { enabled: shouldFetchAssets },
    );
  const { data: textsResponse, refetch: refetchTexts } =
    useGetAllTextsByAgentId(
      { agent_id: createdAgentId as string },
      { enabled: shouldFetchAssets },
    );
  const {
    data: websitesResponse,
    refetch: refetchWebsites,
    isLoading: isLoadingWebsites,
  } = useGetAllWebsitesByAgentId(
    { agent_id: createdAgentId as string },
    { enabled: shouldFetchAssets },
  );

  const uploadedFiles = filesResponse?.data || [];
  const uploadedTexts = textsResponse?.data || [];
  const uploadedWebsites = websitesResponse?.data || [];

  // Automatically show website input if websites exist
  useEffect(() => {
    if (uploadedWebsites.length > 0 && !showWebsiteInput) {
      setShowWebsiteInput(true);
    }
  }, [uploadedWebsites.length, showWebsiteInput]);

  // Asset mutations
  const { mutate: createFileAsset, isPending: isUploadingFile } =
    useCreateFileAsset({
      onSuccess: (data) => {
        toast.success(data.message || "File uploaded successfully");
        setUploadProgress(0);
        refetchFiles();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to upload file");
        setUploadProgress(0);
      },
    });

  const { mutate: createTextAsset, isPending: isCreatingText } =
    useCreateTextAsset({
      onSuccess: (data) => {
        toast.success(data.message || "Text added successfully");
        setTrainingText("");
        refetchTexts();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add text");
      },
    });

  const { mutate: createWebsiteAsset, isPending: isCreatingWebsite } =
    useCreateWebsiteAsset({
      onSuccess: (data) => {
        toast.success(data.message || "Website added successfully");
        setWebsiteUrl("");
        setShowWebsiteInput(true); // Keep input open to allow adding multiple websites
        refetchWebsites();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add website");
      },
    });

  const { mutate: deleteFile } = useDeleteFileById({
    onSuccess: (data) => {
      toast.success(data.message || "File deleted successfully");
      refetchFiles();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete file");
    },
  });

  const { mutate: deleteText } = useDeleteTextById({
    onSuccess: (data) => {
      toast.success(data.message || "Text deleted successfully");
      refetchTexts();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete text");
    },
  });

  const { mutate: deleteWebsite } = useDeleteWebsiteById({
    onSuccess: (data) => {
      toast.success(data.message || "Website deleted successfully");
      refetchWebsites();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete website");
    },
  });

  // Channel creation mutations
  const {
    mutate: createWebWidgetInboxMutation,
    isPending: isCreatingWebWidgetInbox,
  } = useCreateWebWidgetInbox({
    onSuccess: (response) => {
      setIsCreatingInbox(false);
      setConnectingChannelId(null);
      setChannelDialogStep("step-3");
      setChannelCreationSuccess(true);
      // Capture web widget data if available
      if (response.data) {
        const responseData = response.data as any;
        if (responseData?.data?.web_widget_script) {
          setWebWidgetData({
            web_widget_script: responseData.data.web_widget_script,
            website_token: responseData.data.website_token || "",
            website_url: responseData.data.website_url || websiteUrl,
          });
        }
      }
      toast.success(response.message || "Channel created successfully!");
      if (clickedChannel?.id) {
        setSelectedChannels((prev) => [...prev, clickedChannel.id]);
      }
    },
    onError: (error) => {
      setIsCreatingInbox(false);
      setConnectingChannelId(null);
      toast.error(error.message || "Failed to create channel");
    },
  });

  const {
    mutate: createTelegramInboxMutation,
    isPending: isCreatingTelegramInbox,
  } = useCreateTelegramInbox({
    onSuccess: (response) => {
      setIsCreatingInbox(false);
      setConnectingChannelId(null);
      setChannelDialogStep("step-3");
      setChannelCreationSuccess(true);
      toast.success(
        response.message || "Telegram channel created successfully!",
      );
      if (clickedChannel?.id) {
        setSelectedChannels((prev) => [...prev, clickedChannel.id]);
      }
    },
    onError: (error) => {
      console.log(error);
      setIsCreatingInbox(false);
      setConnectingChannelId(null);
      toast.error(error.message || "Failed to create Telegram channel");
    },
  });

  const { mutate: completeWhatsAppSetup } = useCompleteWhatsAppSetup({
    onSuccess: (response) => {
      const phoneNumber = response?.data?.phone_number;
      const verifiedName = response?.data?.verified_name;
      toast.success(
        `WhatsApp connected successfully! ${phoneNumber ? `Number: ${phoneNumber}` : ""}`,
      );
      if (createdAgentId) {
        invalidateQueries({ queryKey: ["useGetAgentById", createdAgentId] });
      }
      setIsCreatingInbox(false);
      setConnectingChannelId(null);
      setChannelDialogStep("step-2");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to setup WhatsApp");
      setIsCreatingInbox(false);
      setConnectingChannelId(null);
      setChannelDialogStep("step-2");
    },
  });

  useEffect(() => {
    if (!isLoadingAgent && agent?.data?.setup_step !== undefined) {
      const currentStep = agent.data.setup_step;

      if (currentStep < 5) {
        const completed = Array.from({ length: currentStep }, (_, i) => i);
        startTransition(() => {
          setCompletedSteps(completed);
          setCurrentActiveStep(currentStep);
        });
      } else {
        // Agent setup is complete
        startTransition(() => {
          setShouldRefetchAgent(false);
          setCompletedSteps([0, 1, 2, 3, 4]);
          setCurrentActiveStep(5);
          // Don't automatically navigate to step 5
          // User will see completion when they navigate to step 4
        });
      }
    }
  }, [agent?.data?.setup_step, isLoadingAgent]);

  useEffect(() => {
    if (formStep === 5) {
      startTransition(() => {
        setCompletedSteps([]);
        setCurrentActiveStep(0);
      });
    }
  }, [formStep]);

  // Send email when agent creation is complete (step 5/5)
  useEffect(() => {
    if (
      currentActiveStep >= 5 &&
      !hasEmailBeenSent &&
      createdAgentId &&
      watchedName
    ) {
      setHasEmailBeenSent(true);
      sendAgentCreationEmail({
        agentName: watchedName,
        agentId: createdAgentId,
      });
    }
  }, [
    currentActiveStep,
    hasEmailBeenSent,
    createdAgentId,
    watchedName,
    sendAgentCreationEmail,
  ]);

  const handleNextStep = () => {
    if (formStep === 1) {
      const name = form.getValues("name");
      const prompt = form.getValues("prompt");
      if (!name || name.length < 2) {
        form.setError("name", {
          message: "Name must be at least 2 characters",
        });
        return;
      }
      if (!prompt || prompt.length < 2) {
        form.setError("prompt", {
          message: "Prompt must be at least 2 characters",
        });
        return;
      }
      // Create agent - onSuccess will navigate to step 2
      createAgent(
        {
          name: name,
          description: prompt,
          website: form.getValues("website")?.trim() || undefined,
        },
        {
          onSuccess: (data) => {
            setFormStep(2);
          },
        },
      );
    } else if (formStep === 2) {
      // Move from channels to tools
      setFormStep(3);
    } else if (formStep === 3) {
      // Move from tools to knowledge/training data
      setFormStep(4);
    } else if (formStep === 4) {
      // Move from knowledge to progress view
      setFormStep(5);
    } else if (formStep === 5) {
      // If agent setup is complete, move to completion screen
      if (currentActiveStep >= 5) {
        setFormStep(6);
      }
    }
  };

  const handlePreviousStep = () => {
    if (formStep > 1 && formStep <= 5) {
      setFormStep(formStep - 1);
    }
  };

  const toggleChannel = (channelId: string) => {
    if (session.user?.auth_type === "anonymous") {
      setSignInModalOpen(true);
      return;
    }

    const channel = AVAILABLE_CHANNELS.find((c) => c.id === channelId);
    if (!channel) return;

    // If channel is already selected and agent exists, open disconnect dialog
    if (selectedChannels.includes(channelId) && createdAgentId) {
      setClickedChannel(channel);
      setIsDisconnectChannelDialogOpen(true);
      return;
    }

    // If channel is already selected but no agent exists, just remove it
    if (selectedChannels.includes(channelId)) {
      setSelectedChannels((prev) => prev.filter((c) => c !== channelId));
      // Remove from configs as well
      setChannelConfigs((prev) => {
        const newConfigs = { ...prev };
        delete newConfigs[channelId];
        return newConfigs;
      });
      return;
    }

    // Check if limit reached
    if (selectedChannels.length >= 5) {
      toast.error("You can select up to 5 channels while onboarding.");
      return;
    }

    // Open the inbox configuration dialog
    setClickedChannel(channel);
    setIsChannelDialogOpen(true);
    setChannelDialogStep("step-2");
    setChannelCreationSuccess(false);
    // Pre-fill with existing config if any
    const existingConfig = channelConfigs[channelId];
    setBotToken(existingConfig?.botToken || "");
  };

  // Helper function to extract IDs from config
  const getConfigIds = () => {
    const channelsData = agent?.data?.config?.channels || [];
    const toolsData = agent?.data?.config?.tools || [];

    // Extract IDs - handle both string[] and object[] formats
    const channelIds = channelsData.map((item: string | { _id: string }) =>
      typeof item === "string" ? item : item._id,
    );
    const toolIds = toolsData.map((item: string | { _id: string }) =>
      typeof item === "string" ? item : item._id,
    );

    return { channelIds, toolIds };
  };

  // Handle connecting tool/channel to agent
  const handleConnectToTool = async () => {
    if (!createdAgentId || !clickedTool) return;

    const { channelIds, toolIds } = getConfigIds();

    // Check if already connected (for channels)
    if (
      clickedTool.type === "channel" &&
      channelIds.includes(clickedTool._id)
    ) {
      toast.info(`${clickedTool.name} is already connected`);
      setIsToolDialogOpen(false);
      return;
    }

    // Handle tools - check if it requires MCP authentication
    if (clickedTool.type === "tool") {
      setIsConnectingTool(true);
      const toolData = allTools.find((t) => t._id === clickedTool._id);
      const requiresAuth = toolData?.is_authenticated || toolData?.mcp_url;

      // Set loading state for the tool being connected
      setConnectingToolId(clickedTool._id);
      // Use the common hook for MCP tool connection
      await connectMCPTool({
        onDialogClose: () => {
          setIsToolDialogOpen(false);
          setConnectingToolId(null);
        },
      });
      setIsConnectingTool(false);
      return;
    }

    // For non-MCP channels, handle separately (existing logic)
    // This part remains for channel connections that don't use MCP
  };

  const handleCreateInbox = () => {
    if (clickedChannel?.id === "telegram" && !botToken) {
      toast.error("Please enter your Telegram bot token");
      return;
    }

    const channelId = clickedChannel?.id;
    if (!channelId) return;

    // If agent exists, create channel immediately
    if (createdAgentId) {
      setIsCreatingInbox(true);
      setConnectingChannelId(channelId);
      setChannelDialogStep("step-3");

      if (channelId === "telegram") {
        console.log("Creating Telegram channel", createdAgentId, botToken);
        createTelegramInboxMutation({
          agent_id: createdAgentId,
          bot_token: botToken,
          channel: {
            bot_token: botToken,
          },
        });
      } else if (channelId === "webchat") {
        createWebWidgetInboxMutation({
          name: "Web Widget",
          agent_id: createdAgentId,
          channel: {
            website_url: websiteUrl || "",
            welcome_title: welcomeTitle || "",
            welcome_tagline: "",
            widget_color: "",
          },
        });
      } else if (channelId === "whatsapp") {
        // Launch embedded signup popup
        runEmbeddedSignupPopup({
          onSuccess: (data) => {
            console.log("WhatsApp embedded signup successful:", data);
            // Complete setup by calling backend
            completeWhatsAppSetup({
              code: data.code,
              phone_number_id: data.phone_number_id,
              waba_id: data.waba_id,
              business_id: data.business_id,
              agent_id: createdAgentId,
            });
          },
          onError: (error) => {
            console.error("WhatsApp embedded signup error:", error);
            toast.error(error || "Failed to complete WhatsApp signup");
            setIsCreatingInbox(false);
            setConnectingChannelId(null);
            setChannelDialogStep("step-2");
          },
          onCancel: () => {
            console.log("WhatsApp signup cancelled");
            setIsCreatingInbox(false);
            setConnectingChannelId(null);
            setChannelDialogStep("step-2");
          },
        });
      }
    } else {
      // Agent doesn't exist yet, save config for later
      setChannelConfigs((prev) => ({
        ...prev,
        [channelId]: {
          botToken: botToken,
        },
      }));

      // Add to selected channels
      setSelectedChannels((prev) => [...prev, channelId]);

      // Close dialog and show success message
      toast.success(`${clickedChannel?.name} configured successfully`);
      handleCloseChannelDialog();
    }
  };

  const handleCloseChannelDialog = () => {
    setIsChannelDialogOpen(false);
    setChannelDialogStep("step-2");
    setClickedChannel(null);
    setBotToken("");
    setIsCreatingInbox(false);
    setChannelCreationSuccess(false);
    setWelcomeTitle("");
    setWebWidgetData(null);
    // Only clear connecting state if not actually connecting (user cancelled)
    if (
      !isCreatingInbox &&
      !isCreatingTelegramInbox &&
      !isCreatingWebWidgetInbox &&
      !isConnectingTool
    ) {
      setConnectingChannelId(null);
    }
  };

  // Knowledge/Training Data Handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (session.user?.auth_type === "anonymous") {
      setSignInModalOpen(true);
      return;
    }
    const file = event.target.files?.[0];
    if (file && createdAgentId) {
      createFileAsset({
        file,
        agent_id: createdAgentId,
        onProgress: setUploadProgress,
      });
    }
    // Reset the input so the same file can be selected again
    event.target.value = "";
  };

  const handleAddText = () => {
    if (!trainingText.trim() || !createdAgentId) {
      toast.error("Please enter some text");
      return;
    }
    createTextAsset({
      text: trainingText,
      agent_id: createdAgentId,
    });
  };

  const handleAddWebsite = () => {
    if (!websiteUrl.trim() || !createdAgentId) {
      toast.error("Please enter a valid URL");
      return;
    }
    const fullUrl = websiteUrl.startsWith("http")
      ? websiteUrl
      : `https://${websiteUrl}`;
    createWebsiteAsset({
      urls: [fullUrl],
      agent_id: createdAgentId,
    });
  };

  const handleDeleteFile = (fileId: string) => {
    deleteFile({ file_id: fileId });
  };

  const handleDeleteText = (textId: string) => {
    deleteText({ text_id: textId });
  };

  const handleDeleteWebsite = (websiteId: string) => {
    deleteWebsite({ website_id: websiteId });
  };

  const toggleTool = (
    toolId: string,
    toolData: { _id: string; name: string; icon_url: string } | null,
  ) => {
    if (session.user?.auth_type === "anonymous" && !session.loading) {
      setSignInModalOpen(true);
      return;
    }

    // If agent exists
    if (createdAgentId && toolData) {
      // If already connected, open disconnect dialog
      if (connectedTools.includes(toolId)) {
        setDisconnectingTool({
          _id: toolId,
          name: toolData.name,
        });
        setIsDisconnectToolDialogOpen(true);
        return;
      }

      // If not connected, open connection dialog
      setClickedTool({
        _id: toolData._id,
        name: toolData.name,
        icon_url: toolData.icon_url || "",
        color: "#8B5CF6",
        type: "tool",
      });
      setIsToolDialogOpen(true);
      return;
    }

    // If agent doesn't exist yet, toggle selection
    if (selectedTools.includes(toolId)) {
      setSelectedTools((prev) => prev.filter((t) => t !== toolId));
      return;
    }

    if (selectedTools.length >= 5) {
      toast.error("You can select up to 5 tools");
      return;
    }

    setSelectedTools((prev) => [...prev, toolId]);
  };

  const handleCancelModal = () => {
    setFormStep(1);
    setCreatedAgentId(null);
    setCompletedSteps([]);
    setCurrentActiveStep(0);
    setShouldRefetchAgent(false);
    setSelectedChannels([]);
    setSelectedTools([]);
    setHasEmailBeenSent(false);
    form.reset();
    onOpenChange(false);
  };

  const handleDisconnectItem = (
    itemId: string,
    itemName: string,
    type: "channel" | "tool",
  ) => {
    // if (!agent?._id) return;
    if (!createdAgentId) return;

    const { channelIds, toolIds } = getConfigIds();

    if (type === "tool") {
      deleteMCP({
        agent_id: createdAgentId,
        tool_id: itemId,
      });
    }
    updateAgent(
      {
        _id: createdAgentId,
        config: {
          channels:
            type === "channel"
              ? channelIds.filter((id) => id !== itemId)
              : channelIds,
          tools:
            type === "tool" ? toolIds.filter((id) => id !== itemId) : toolIds,
        },
      },
      {
        onSuccess: () => {
          toast.success(`${itemName} disconnected successfully`);
          invalidateQueries({ queryKey: ["useGetAgentById", createdAgentId] });
          if (type === "tool") {
            setSelectedTools((prev) => prev.filter((t) => t !== itemId));
          } else {
            setSelectedChannels((prev) => prev.filter((c) => c !== itemId));
          }
        },
        onError: (error) => {
          toast.error(error.message || "Failed to disconnect");
        },
      },
    );
  };
  const selectedChannelObjects = useMemo(
    () => AVAILABLE_CHANNELS.filter((c) => selectedChannels.includes(c.id)),
    [selectedChannels],
  );

  const selectedToolObjects = useMemo(
    () => tools.filter((t) => selectedTools.includes(t._id)),
    [selectedTools, tools],
  );

  return (
    <>
      <MotionModal
        open={open}
        onOpenChange={onOpenChange}
        className="w-[75%] max-w-[1200px] h-[700px]"
        contentClassName="p-0"
        closeOnOverlayClick={false}
        hideCloseButton
      >
        <div className="relative grid h-full overflow-hidden rounded-xl border bg-linear-to-br from-background via-muted/40 to-background shadow-xl grid-cols-2">
          <Button
            type="button"
            className="absolute right-3 top-3 z-10 rounded-full size-10 bg-foreground/10 hover:bg-foreground/20 text-foreground transition-all duration-200 hover:scale-110 active:scale-95"
            onClick={() => handleCancelModal()}
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>

          {/* Left Panel - Data Collection Form */}
          <div className="relative h-full bg-background/90 p-8 flex flex-col overflow-hidden">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25">
                AI
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                  LinkAI Studio
                </p>
                <p className="text-sm text-muted-foreground">
                  Craft your AI employee profile
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-1.5 mb-5">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                      formStep > step
                        ? "bg-green-500 text-white"
                        : formStep === step
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {formStep > step ? (
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        className="size-4"
                      />
                    ) : (
                      step
                    )}
                  </div>
                  {index < 3 && (
                    <div
                      className={cn(
                        "w-12 h-0.5 mx-1.5 transition-colors",
                        formStep > step ? "bg-green-500" : "bg-muted",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                {getStepTitle(formStep, watchedName)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {getStepDescription(formStep)}
                <br />
                {session.user?.auth_type === "anonymous" && formStep === 4 && (
                  <span className="text-xs text-red-500 block mt-1">
                    (Please sign in to upload)
                  </span>
                )}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Name & Prompt */}
              {formStep === 1 && (
                <motion.div
                  key="step-1"
                  className="flex flex-col flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Form {...form}>
                    <div className="space-y-4 flex-1">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agent Name</FormLabel>
                            <FormControl>
                              <Input
                                className="h-11 border rounded-lg bg-background/70 text-sm placeholder:text-muted-foreground"
                                placeholder="e.g., Sales Assistant, Support Bot..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-24 resize-none rounded-lg bg-background/70 text-sm placeholder:text-muted-foreground"
                                placeholder="Describe your agent's purpose and behavior..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel>Website</FormLabel>
                              <span className="text-xs text-muted-foreground">
                                (Optional)
                              </span>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <HugeiconsIcon
                                  icon={Globe02Icon}
                                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                />
                                <Input
                                  className="h-11 rounded-lg bg-background/70 pl-10 text-sm placeholder:text-muted-foreground border"
                                  placeholder="https://example.com"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>

                  <div className="mt-auto pt-4">
                    <Button
                      className="w-full h-11 rounded-lg cursor-pointer"
                      size="lg"
                      onClick={handleNextStep}
                      disabled={isCreatingAgent}
                    >
                      {isCreatingAgent ? (
                        <>
                          <HugeiconsIcon
                            icon={Loading02Icon}
                            className="size-4 mr-2 animate-spin"
                          />
                          Creating Agent...
                        </>
                      ) : (
                        "Create Agent"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Channel Selection */}
              {formStep === 2 && (
                <motion.div
                  key="step-2"
                  className="flex flex-col flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-2 gap-3 ">
                    {AVAILABLE_CHANNELS.map((channel) => {
                      const isSelected = selectedChannels.includes(channel.id);
                      return (
                        <button
                          key={channel.id}
                          onClick={() => toggleChannel(channel.id)}
                          className={cn(
                            "p-4 rounded-xl border transition-all text-left",
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer",
                            session.user?.auth_type === "anonymous" &&
                              "opacity-50",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                              )}
                            >
                              {channel.isGradientIcon ? (
                                <channel.icon className="size-6" />
                              ) : (
                                <channel.icon
                                  className={`size-6`}
                                  style={{ color: channel.color }}
                                />
                              )}
                            </div>
                            <span className="text-sm font-medium flex-1">
                              {channel.name}
                            </span>
                            {isSelected && (
                              <HugeiconsIcon
                                icon={CheckmarkCircle01Icon}
                                className="size-5 text-green-500"
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mt-auto pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-11 rounded-lg"
                      onClick={handlePreviousStep}
                    >
                      <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        className="size-4 mr-2"
                      />
                      Back
                    </Button>
                    <Button
                      className="flex-1 h-11 rounded-lg"
                      onClick={handleNextStep}
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Tools Selection */}
              {formStep === 3 && (
                <motion.div
                  key="step-3"
                  className="flex flex-col flex-1 min-h-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Search Input */}
                  <div className="relative mb-4">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Search tools..."
                      value={toolSearchQuery}
                      onChange={(e) => setToolSearchQuery(e.target.value)}
                      className="pl-10 h-11 rounded-lg border"
                    />
                  </div>

                  <div
                    className={cn(
                      "grid grid-cols-2 gap-3 overflow-y-auto min-h-0",
                    )}
                  >
                    {/* Map through fetched tools */}
                    {tools.map((tool) => {
                      const isSelected = selectedTools.includes(tool._id);
                      const isConnected = connectedTools.includes(tool._id);
                      const isConnecting = connectingToolId === tool._id;
                      const showTick = createdAgentId
                        ? isConnected
                        : isSelected;

                      return (
                        <button
                          key={tool._id}
                          onClick={() =>
                            toggleTool(tool._id, {
                              _id: tool._id,
                              name: tool.name,
                              icon_url: tool.icon_url || "",
                            })
                          }
                          disabled={isConnecting}
                          className={cn(
                            "p-4 rounded-xl border transition-all text-left",
                            (isConnecting ||
                              session.user?.auth_type === "anonymous") &&
                              "opacity-50 cursor-not-allowed",
                            showTick && !isConnecting
                              ? "border-primary bg-primary/5 shadow-sm cursor-pointer"
                              : "border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-muted">
                              <Image
                                src={tool.icon_url}
                                alt={tool.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <span className="text-sm font-medium flex-1">
                              {tool.name}
                            </span>
                            {isConnecting ? (
                              <HugeiconsIcon
                                icon={Loading02Icon}
                                className="size-5 text-primary animate-spin"
                              />
                            ) : (
                              showTick && (
                                <Check className="size-5 text-primary" />
                              )
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {/* Show loading or empty state */}
                    {tools.length === 0 && (
                      <div className="col-span-2 flex items-center justify-center py-8 text-muted-foreground text-sm">
                        No tools available
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-auto pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-11 rounded-lg"
                      onClick={handlePreviousStep}
                    >
                      <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        className="size-4 mr-2"
                      />
                      Back
                    </Button>
                    <Button
                      className="flex-1 h-11 rounded-lg"
                      onClick={handleNextStep}
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Knowledge/Training Data */}
              {formStep === 4 && (
                <motion.div
                  key="step-4"
                  className="flex flex-col flex-1 min-h-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
                    {/* File Upload Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Upload Files
                      </Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        disabled={session.user?.auth_type === "anonymous"}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <Button
                        variant="outline"
                        className="w-full h-24 border-dashed hover:bg-primary/5"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingFile || !createdAgentId}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <HugeiconsIcon
                            icon={Upload02Icon}
                            className="size-6 text-muted-foreground"
                          />
                          <span className="text-sm text-muted-foreground">
                            {isUploadingFile
                              ? `Uploading... ${uploadProgress}%`
                              : "Click to upload files"}
                          </span>
                        </div>
                      </Button>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Text Input Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Add Text</Label>
                      <Textarea
                        placeholder="Paste or type any text you want your agent to learn from..."
                        value={trainingText}
                        onChange={(e) => setTrainingText(e.target.value)}
                        className="min-h-24 resize-none"
                        disabled={
                          isCreatingText ||
                          !createdAgentId ||
                          session.user?.auth_type === "anonymous"
                        }
                      />
                      <Button
                        onClick={handleAddText}
                        disabled={
                          isCreatingText ||
                          !trainingText.trim() ||
                          !createdAgentId ||
                          session.user?.auth_type === "anonymous"
                        }
                        className="w-full"
                      >
                        {isCreatingText ? "Adding..." : "Add Text"}
                      </Button>
                    </div>

                    {/* Website URL Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Add Website
                      </Label>
                      {!showWebsiteInput && uploadedWebsites.length === 0 ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowWebsiteInput(true)}
                          disabled={
                            !createdAgentId ||
                            session.user?.auth_type === "anonymous"
                          }
                        >
                          <HugeiconsIcon
                            icon={Link01Icon}
                            className="size-4 mr-2"
                          />
                          Add Website URL
                        </Button>
                      ) : (
                        <>
                          <UrlInput
                            value={websiteUrl}
                            onChange={setWebsiteUrl}
                            onAdd={handleAddWebsite}
                            onClose={() => {
                              if (uploadedWebsites.length === 0) {
                                setShowWebsiteInput(false);
                              }
                              setWebsiteUrl("");
                            }}
                            disabled={
                              isCreatingWebsite ||
                              session.user?.auth_type === "anonymous"
                            }
                            loading={isCreatingWebsite}
                            placeholder="example.com"
                          />
                          {/* List of added websites */}
                          {isLoadingWebsites ? (
                            <div className="space-y-2 mt-3">
                              <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border">
                                <HugeiconsIcon
                                  icon={Loading02Icon}
                                  className="size-4 text-primary shrink-0 animate-spin"
                                />
                                <span className="text-sm text-muted-foreground">
                                  Loading websites...
                                </span>
                              </div>
                            </div>
                          ) : (
                            uploadedWebsites.length > 0 && (
                              <div className="space-y-2 mt-3">
                                {uploadedWebsites.map((website) => (
                                  <div
                                    key={website._id}
                                    className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border"
                                  >
                                    <HugeiconsIcon
                                      icon={Globe02Icon}
                                      className="size-4 text-primary shrink-0"
                                    />
                                    <p className="text-sm font-medium flex-1 truncate">
                                      {(() => {
                                        const urlText =
                                          typeof website.asset === "object"
                                            ? website.urls.length > 0
                                              ? website.urls[0]
                                              : "Website"
                                            : website.urls.length > 0
                                              ? website.urls[0]
                                              : "Website";
                                        return typeof urlText === "string" &&
                                          urlText.length > 30
                                          ? `${urlText.substring(0, 30)}...`
                                          : urlText;
                                      })()}
                                    </p>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="size-7 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() =>
                                        handleDeleteWebsite(website._id)
                                      }
                                    >
                                      <HugeiconsIcon
                                        icon={Delete02Icon}
                                        className="size-3.5"
                                      />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-11 rounded-lg"
                      onClick={handlePreviousStep}
                    >
                      <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        className="size-4 mr-2"
                      />
                      Back
                    </Button>
                    <Button
                      className="flex-1 h-11 rounded-lg"
                      onClick={handleNextStep}
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Progress - Left side shows status, progress shown on right */}
              {formStep === 5 && (
                <motion.div
                  key="step-4"
                  className="flex flex-col flex-1 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    {currentActiveStep >= 5 ? (
                      <>
                        {/* Setup Complete */}
                        <motion.div
                          className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                        >
                          <HugeiconsIcon
                            icon={CheckmarkCircle01Icon}
                            className="size-8 text-green-600 dark:text-green-400"
                          />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Setup Complete!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Your agent is ready to go
                          </p>
                        </div>
                        <div className=" w-1/2 bg-lime-300 flex items-center justify-between  gap-3">
                          <Button
                            variant="outline"
                            className="w-full h-11 rounded-lg"
                            onClick={handlePreviousStep}
                          >
                            Back
                          </Button>
                          <Button
                            className="w-full h-11 rounded-lg"
                            onClick={() => onOpenChange(false)}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Still Setting Up */}
                        <div className="flex items-center justify-center gap-2">
                          {[0, 1, 2].map((index) => (
                            <motion.div
                              key={index}
                              className="w-3 h-3 rounded-full bg-primary"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.2,
                              }}
                            />
                          ))}
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <p className="text-base font-medium text-foreground">
                              Setting up your agent
                            </p>
                            <motion.span
                              className="text-base font-medium text-foreground"
                              animate={{
                                opacity: [0.3, 1, 0.3],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              ...
                            </motion.span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Please wait while we prepare everything
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Show Continue button when setup is complete */}
                  {currentActiveStep >= 5 && (
                    <div className="mt-auto pt-4">
                      <Button
                        className="w-full h-11 rounded-lg"
                        size="lg"
                        onClick={handleNextStep}
                      >
                        Continue
                      </Button>
                    </div>
                  )}
                  <div className=" w-1/2 flex items-center justify-between  gap-3 mt-auto pt-4">
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-lg hover:bg-primary/10 hover:text-primary cursor-pointer"
                      onClick={handlePreviousStep}
                    >
                      Back
                    </Button>
                    <Button
                      className="w-full h-11 rounded-lg cursor-pointer"
                      onClick={() => onOpenChange(false)}
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Completion - Left side is empty, completion shown on right */}
              {formStep === 6 && (
                <motion.div
                  key="step-5"
                  className="flex flex-col flex-1 items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center">
                    <div className="size-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        className="size-8 text-white"
                      />
                    </div>
                    <p className="text-muted-foreground">
                      Agent created successfully!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Visualization */}
          <div className="relative flex min-h-full items-center justify-center bg-linear-from-tl bg-linear-to-br from-blue-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 px-8 py-10 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1: Beam Animation with Name Preview */}
              {formStep === 1 && (
                <motion.div
                  key="beams"
                  className="relative w-full max-w-md flex flex-col items-center justify-center min-h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  {!watchedName && !watchedPrompt && (
                    <div
                      ref={beamContainerRef}
                      className="relative aspect-square w-full overflow-hidden"
                    >
                      {/* Center Gemini AI Hub */}
                      <motion.div
                        ref={chatRef}
                        className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.2,
                        }}
                      >
                        <div className="relative">
                          <motion.div
                            className="absolute inset-0 rounded-full bg-linear-to-br from-blue-500 to-purple-600 opacity-20 blur-2xl"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            className="relative flex size-20 items-center justify-center rounded-full bg-linear-to-br from-slate-900 via-gray-800 to-slate-900 text-white shadow-2xl ring-4 ring-white/90"
                            animate={{
                              boxShadow: [
                                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                "0 25px 50px -12px rgba(79, 70, 229, 0.4)",
                                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                              ],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <motion.div
                              animate={{ rotate: [0, 5, 0, -5, 0] }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <RiGeminiFill className="size-9 drop-shadow-lg" />
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Static Channel Icons in Orbit */}
                      {AVAILABLE_CHANNELS.slice(0, 4).map((channel, index) => {
                        const positions = [
                          {
                            className: "left-4 top-8",
                            translate: "-translate-x-4",
                          },
                          {
                            className: "right-4 top-12",
                            translate: "translate-x-4",
                          },
                          {
                            className: "bottom-16 left-2",
                            translate: "translate-y-4",
                          },
                          {
                            className: "bottom-8 right-6",
                            translate: "translate-y-4",
                          },
                        ];
                        const pos = positions[index];

                        return (
                          <motion.div
                            key={channel.id}
                            ref={(el) => {
                              orbitRefs.current[index] = el;
                            }}
                            className={cn("absolute z-10", pos.className)}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                              delay: 0.4 + index * 0.1,
                            }}
                          >
                            <motion.div
                              className="relative group"
                              animate={{
                                y: [0, -8, 0],
                              }}
                              transition={{
                                duration: 2 + index * 0.3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.2,
                              }}
                            >
                              <motion.div
                                className={cn(
                                  "absolute inset-0 rounded-2xl blur-xl",
                                  channel.glowColor,
                                )}
                                animate={{
                                  opacity: [0.3, 0.6, 0.3],
                                  scale: [1, 1.15, 1],
                                }}
                                transition={{
                                  duration: 2.5 + index * 0.2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                              <div
                                className={cn(
                                  "relative flex size-14 items-center justify-center rounded-2xl text-white shadow-xl ring-2 ring-white/90 bg-linear-to-br",
                                  channel.isGradientIcon
                                    ? "bg-white"
                                    : `${channel.gradientFrom} ${channel.gradientTo}`,
                                  pos.translate,
                                )}
                              >
                                {channel.isGradientIcon ? (
                                  <channel.icon className="size-7" />
                                ) : (
                                  <channel.icon className="size-7" />
                                )}
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}

                      {/* Animated Beams */}
                      {orbitRefs.current.slice(0, 4).map((ref, index) => {
                        if (!ref) return null;
                        const colors = [
                          {
                            path: "#10b981",
                            start: "#34d399",
                            stop: "#059669",
                          },
                          {
                            path: "#0ea5e9",
                            start: "#38bdf8",
                            stop: "#0284c7",
                          },
                          {
                            path: "#3b82f6",
                            start: "#60a5fa",
                            stop: "#1d4ed8",
                          },
                          {
                            path: "#ec4899",
                            start: "#f472b6",
                            stop: "#db2777",
                          },
                        ];
                        return (
                          <AnimatedBeam
                            key={index}
                            containerRef={beamContainerRef}
                            fromRef={{ current: ref }}
                            toRef={chatRef}
                            curvature={35 + index * 5}
                            duration={3 + index * 0.2}
                            delay={0.8 + index * 0.2}
                            pathColor={colors[index].path}
                            gradientStartColor={colors[index].start}
                            gradientStopColor={colors[index].stop}
                            pathWidth={3}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Name Preview Widget */}
                  <AnimatePresence>
                    {(watchedName || watchedPrompt) && (
                      <motion.div
                        className="bg-white/80 h-max max-h-96 z-20 dark:bg-slate-800 rounded-xl p-4 shadow-xl border w-[calc(100%-2rem)] max-w-sm  overflow-y-auto scrollbar-hide"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-slate-900 to-gray-800 flex items-center justify-center">
                            <RiGeminiFill className="size-6 text-white" />
                          </div>
                          <div className="flex flex-col items-center text-center w-full">
                            <p className="text-sm font-semibold text-foreground">
                              {watchedName || "Your Agent"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {watchedPrompt || "No description yet"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <DottedGlowBackground
                    className="pointer-events-none  mask-radial-to-90% mask-radial-at-center"
                    opacity={1}
                    gap={10}
                    radius={1.6}
                    colorLightVar="--color-neutral-500"
                    glowColorLightVar="--color-neutral-600"
                    colorDarkVar="--color-neutral-500"
                    glowColorDarkVar="--color-sky-800"
                    backgroundOpacity={0}
                    speedMin={0.3}
                    speedMax={1.6}
                    speedScale={1}
                  />
                </motion.div>
              )}

              {/* Step 2: Selected Channels Orbit */}
              {formStep === 2 && (
                <motion.div
                  key="channels-orbit"
                  className="relative w-full max-w-md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative w-64 h-64 mx-auto">
                    {/* Center agent icon */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black rounded-2xl flex items-center justify-center z-20 shadow-xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <span className="text-white font-bold text-2xl">L</span>
                    </motion.div>

                    {/* Dashed orbit circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full " />

                    {/* Orbiting container - rotates the entire group */}
                    {selectedChannelObjects.length > 0 && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 25,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {/* Orbiting icons positioned on the circle */}
                        {selectedChannelObjects.map((channel, index) => {
                          const orbitRadius = 90;
                          const angleRad =
                            ((index * 360) / selectedChannelObjects.length) *
                            (Math.PI / 180);
                          const x = Math.cos(angleRad) * orbitRadius;
                          const y = Math.sin(angleRad) * orbitRadius;

                          return (
                            <motion.div
                              key={channel.id}
                              className="absolute w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-gray-100 dark:border-gray-700 z-20"
                              style={{
                                top: "50%",
                                left: "50%",
                                marginTop: -24,
                                marginLeft: -24,
                                x: x,
                                y: y,
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{
                                scale: 1,
                                opacity: 1,
                                rotate: -360,
                              }}
                              transition={{
                                scale: {
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 15,
                                  delay: index * 0.1,
                                },
                                opacity: {
                                  duration: 0.8,
                                  delay: index * 0.1,
                                },
                                rotate: {
                                  duration: 25,
                                  repeat: Infinity,
                                  ease: "linear",
                                },
                              }}
                            >
                              {channel.isGradientIcon ? (
                                <channel.icon className="w-6 h-6" />
                              ) : (
                                <channel.icon
                                  className="w-6 h-6"
                                  style={{
                                    color:
                                      channel.id === "whatsapp"
                                        ? "#25D366"
                                        : channel.id === "telegram"
                                          ? "#0088cc"
                                          : channel.id === "facebook"
                                            ? "#1877F2"
                                            : channel.id === "webchat"
                                              ? "#8B5CF6"
                                              : undefined,
                                  }}
                                />
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* Empty state hint */}
                    {selectedChannels.length === 0 && (
                      <motion.p
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-md text-muted-foreground text-center w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Select channels to see them orbit around your agent
                      </motion.p>
                    )}
                  </div>

                  <DottedGlowBackground
                    className="pointer-events-none mask-radial-to-90% mask-radial-at-center z-0"
                    opacity={0.8}
                    gap={10}
                    radius={1.6}
                    colorLightVar="--color-neutral-400"
                    glowColorLightVar="--color-neutral-500"
                    colorDarkVar="--color-neutral-500"
                    glowColorDarkVar="--color-primary"
                    backgroundOpacity={0}
                    speedMin={0.3}
                    speedMax={1.6}
                    speedScale={1}
                  />
                </motion.div>
              )}

              {/* Step 3: Selected Tools Orbit */}
              {formStep === 3 && (
                <motion.div
                  key="tools-orbit"
                  className="relative w-full max-w-md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative aspect-square w-full">
                    {/* Center Hub */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <div className="relative">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-linear-to-br from-orange-400/30 to-amber-600/30 blur-2xl"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <div className="relative flex size-14 items-center justify-center rounded-full bg-linear-to-br from-slate-900 to-gray-800 text-white shadow-2xl ring-4 ring-white/90">
                          <HugeiconsIcon
                            icon={SparklesIcon}
                            className="size-8"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Selected Tools in Orbit */}
                    {selectedToolObjects.map((tool, index) => {
                      const position = ORBIT_POSITIONS[index];
                      return (
                        <motion.div
                          key={tool._id}
                          className="absolute left-1/2 top-1/2 z-10"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            x: position.x - 28,
                            y: position.y - 28,
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: position.delay,
                          }}
                        >
                          <motion.div
                            animate={{
                              y: [0, -6, 0],
                            }}
                            transition={{
                              duration: 2 + index * 0.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 rounded-2xl blur-xl bg-purple-400/30"
                              animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            <div className="relative flex size-12 items-center justify-center rounded-xl shadow-xl ring-2 ring-white/90  overflow-hidden">
                              <Image
                                src={tool.icon_url}
                                alt={tool.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-contain p-2 bg-black/10 rounded-xl"
                              />
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}

                    {/* Empty state hint */}
                    {selectedTools.length === 0 && (
                      <motion.p
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Select tools to enhance your agent&apos;s capabilities
                      </motion.p>
                    )}
                  </div>

                  <DottedGlowBackground
                    className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
                    opacity={0.8}
                    gap={10}
                    radius={1.6}
                    colorLightVar="--color-neutral-400"
                    glowColorLightVar="--color-neutral-500"
                    colorDarkVar="--color-neutral-500"
                    glowColorDarkVar="--color-orange-700"
                    backgroundOpacity={0}
                    speedMin={0.3}
                    speedMax={1.6}
                    speedScale={1}
                  />
                </motion.div>
              )}

              {/* Step 4: Knowledge Data Visualization */}
              {formStep === 4 && (
                <motion.div
                  key="knowledge-viz"
                  className="relative w-full max-w-md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative space-y-3 h-[500px] flex flex-col items-center justify-center overflow-y-auto pr-2 z-30">
                    {/* Files Section */}
                    {uploadedFiles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Files ({uploadedFiles.length})
                        </p>
                        {uploadedFiles.map((file, index) => (
                          <motion.div
                            key={file._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 w-80 bg-white dark:bg-slate-800 rounded-lg border shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                              <HugeiconsIcon
                                icon={FileAttachmentIcon}
                                className="size-5 text-blue-600 dark:text-blue-400"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {typeof file.asset === "object"
                                  ? file.asset.name || "File"
                                  : "File"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {typeof file.asset === "object" &&
                                file.asset.size_bytes
                                  ? `${(file.asset.size_bytes / 1024).toFixed(
                                      1,
                                    )} KB`
                                  : "Unknown size"}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0 size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteFile(file._id)}
                            >
                              <HugeiconsIcon
                                icon={Delete02Icon}
                                className="size-4"
                              />
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Texts Section */}
                    {uploadedTexts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Texts ({uploadedTexts.length})
                        </p>
                        {uploadedTexts.map((text, index) => (
                          <motion.div
                            key={text._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className=" w-80 flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                              <HugeiconsIcon
                                icon={TextIcon}
                                className="size-5 text-blue-600 dark:text-blue-400"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-2">
                                {text.content?.substring(0, 30)}
                                {text.content &&
                                  text.content.length > 30 &&
                                  "..."}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {text.content?.length || 0} characters
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0 size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteText(text._id)}
                            >
                              <HugeiconsIcon
                                icon={Delete02Icon}
                                className="size-4"
                              />
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Websites Section */}
                    {uploadedWebsites.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Websites ({uploadedWebsites.length})
                        </p>
                        {uploadedWebsites.map((website, index) => (
                          <motion.div
                            key={website._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className=" w-80  flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                              <HugeiconsIcon
                                icon={Globe02Icon}
                                className="size-5 text-blue-600 dark:text-blue-400"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {(() => {
                                  const urlText =
                                    typeof website.asset === "object"
                                      ? website.urls.length > 0
                                        ? website.urls[0]
                                        : "Website"
                                      : website.urls.length > 0
                                        ? website.urls[0]
                                        : "Website";
                                  return typeof urlText === "string" &&
                                    urlText.length > 30
                                    ? `${urlText.substring(0, 30)}...`
                                    : urlText;
                                })()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {typeof website.asset === "object"
                                  ? website.asset.processing_status ||
                                    "Processing"
                                  : "Website"}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0 size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteWebsite(website._id)}
                            >
                              <HugeiconsIcon
                                icon={Delete02Icon}
                                className="size-4"
                              />
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Empty State */}
                    {uploadedFiles.length === 0 &&
                      uploadedTexts.length === 0 &&
                      uploadedWebsites.length === 0 && (
                        <motion.div
                          className="flex flex-col items-center justify-center py-12 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                            <HugeiconsIcon
                              icon={FileAttachmentIcon}
                              className="size-8 text-muted-foreground"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            No training data added yet
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload files, add text, or connect websites
                          </p>
                        </motion.div>
                      )}
                  </div>

                  <DottedGlowBackground
                    className="absolute inset-0 pointer-events-none mask-radial-to-90% mask-radial-at-center h-[500px] z-0"
                    opacity={0.8}
                    gap={10}
                    radius={1.6}
                    colorLightVar="--color-neutral-400"
                    glowColorLightVar="--color-neutral-500"
                    colorDarkVar="--color-neutral-500"
                    glowColorDarkVar="--color-blue-700"
                    backgroundOpacity={0}
                    speedMin={0.3}
                    speedMax={1.6}
                    speedScale={1}
                  />
                </motion.div>
              )}

              {/* Step 5: Progress Animation */}
              {formStep === 5 && (
                <motion.div
                  key="progress"
                  className="w-full max-w-xl mx-auto flex relative justify-end flex-col h-full overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  {CREATION_STEPS.map((step, index) => {
                    const isCompleted = completedSteps.includes(index);
                    const distance = Math.abs(index - currentActiveStep);
                    const opacity = Math.max(1 - distance * 0.3, 0);

                    return (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4 mb-8"
                        initial={{ opacity: 0, y: -(currentActiveStep * 65) }}
                        animate={{
                          opacity: opacity,
                          y: -(currentActiveStep * 60),
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="shrink-0">
                          <AnimatePresence mode="wait">
                            {isCompleted ? (
                              <motion.div
                                key="check"
                                className="flex size-6 items-center justify-center rounded-full bg-green-500"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                              >
                                <HugeiconsIcon
                                  icon={CheckmarkCircle01Icon}
                                  className="size-3.5 text-white"
                                  strokeWidth={3}
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="loader"
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: -180 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                              >
                                <HugeiconsIcon
                                  icon={ReloadIcon}
                                  className="size-6 text-blue-500 animate-spin"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {step.title}
                        </h3>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Step 6: Completion */}
              {formStep === 6 && (
                <motion.div
                  key="completion"
                  className="w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                >
                  <motion.div
                    className="mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2,
                    }}
                  >
                    <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-600 shadow-2xl shadow-green-500/50">
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        className="size-10 text-white"
                        strokeWidth={3}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      Agent Created Successfully!
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                      Your AI agent &quot;{watchedName}&quot; is now ready to
                      assist customers and handle conversations across all
                      connected platforms.
                    </p>
                  </motion.div>

                  {/* Agent Summary Card */}
                  <motion.div
                    className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border mb-6 w-full max-w-xs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-slate-900 to-gray-800 flex items-center justify-center">
                        <RiGeminiFill className="size-6 text-white" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {watchedName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {watchedPrompt}
                        </p>
                      </div>
                    </div>
                    {(selectedChannels.length > 0 ||
                      selectedTools.length > 0) && (
                      <div className="mt-3 pt-3 border-t flex flex-wrap gap-2">
                        {selectedChannelObjects.slice(0, 3).map((channel) => (
                          <div
                            key={channel.id}
                            className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center bg-linear-to-br",
                              channel.isGradientIcon
                                ? "bg-white border"
                                : `${channel.gradientFrom} ${channel.gradientTo}`,
                            )}
                          >
                            {channel.isGradientIcon ? (
                              <channel.icon className="size-4" />
                            ) : (
                              <channel.icon className="size-3.5 text-white" />
                            )}
                          </div>
                        ))}
                        {selectedToolObjects.slice(0, 2).map((tool) => (
                          <div
                            key={tool._id}
                            className="w-6 h-6 rounded-md flex items-center justify-center bg-linear-to-br from-purple-400 to-purple-600"
                          >
                            <HugeiconsIcon
                              icon={SparklesIcon}
                              className="size-3.5 text-white"
                            />
                          </div>
                        ))}
                        {selectedChannels.length + selectedTools.length > 5 && (
                          <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            +
                            {selectedChannels.length + selectedTools.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <Button
                      className="h-11 px-6 rounded-lg"
                      size="lg"
                      onClick={() => {
                        handleCancelModal();
                      }}
                    >
                      <HugeiconsIcon
                        icon={SparklesIcon}
                        className="size-4 mr-2"
                      />
                      View Agent
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 px-6 rounded-lg"
                      size="lg"
                      onClick={() => handleCancelModal()}
                    >
                      Close
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </MotionModal>

      {/* Channel Connection Dialog */}
      {clickedChannel &&
        (() => {
          const IconComponent = clickedChannel.icon;
          const iconElement = IconComponent ? (
            <IconComponent className="size-6" />
          ) : undefined;
          return (
            <ChannelConnectionDialog
              open={isChannelDialogOpen}
              onOpenChange={setIsChannelDialogOpen}
              clickedTool={{
                _id: clickedChannel.id,
                name: clickedChannel.name,
                icon: iconElement,
                color: clickedChannel.color,
              }}
              channelDialogStep={channelDialogStep}
              setChannelDialogStep={setChannelDialogStep}
              selectedChannelType={
                clickedChannel?.id === "telegram"
                  ? "telegram"
                  : clickedChannel?.id === "webchat"
                    ? "web-widget"
                    : clickedChannel?.id === "whatsapp"
                      ? "whatsapp"
                      : null
              }
              botToken={botToken}
              setBotToken={setBotToken}
              isCreatingInbox={isCreatingInbox || isConnectingTool}
              agent={
                createdAgentId && agent?.data
                  ? {
                      _id: createdAgentId,
                      name: agent.data.name,
                      avatar: agent.data.avatar,
                    }
                  : null
              }
              agentEmail={session.user?.email || ""}
              onCreateInbox={handleCreateInbox}
              onClose={handleCloseChannelDialog}
              websiteUrl={websiteUrl}
              setWebsiteUrl={setWebsiteUrl}
              welcomeTitle={welcomeTitle}
              setWelcomeTitle={setWelcomeTitle}
              webWidgetData={webWidgetData}
            />
          );
        })()}

      {/* Disconnect Channel Dialog */}
      {clickedChannel && (
        <DisconnectChannelDialog
          open={isDisconnectChannelDialogOpen}
          onOpenChange={setIsDisconnectChannelDialogOpen}
          channel={{
            _id: clickedChannel.id,
            name: clickedChannel.name,
            color: clickedChannel.color,
          }}
          onConfirmDisconnect={() => {
            handleDisconnectItem(
              clickedChannel.id,
              clickedChannel.name,
              "channel",
            );
            setIsDisconnectChannelDialogOpen(false);
          }}
          onCancel={() => setIsDisconnectChannelDialogOpen(false)}
        />
      )}

      {/* Disconnect Tool Dialog */}
      {disconnectingTool && (
        <DisconnectToolDialog
          open={isDisconnectToolDialogOpen}
          onOpenChange={setIsDisconnectToolDialogOpen}
          tool={disconnectingTool}
          onConfirmDisconnect={(toolId, toolName) => {
            handleDisconnectItem(toolId, toolName, "tool");
            setIsDisconnectToolDialogOpen(false);
            setDisconnectingTool(null);
          }}
        />
      )}

      {/* Tool Connection Dialog */}
      <ToolConnectionDialog
        open={isToolDialogOpen}
        onOpenChange={(open) => {
          setIsToolDialogOpen(open);
          // If dialog is closed, clear connectingToolId
          // The sync useEffect will ensure selectedTools matches agent's actual tools
          if (!open) {
            setConnectingToolId(null);
          }
        }}
        tool={
          clickedTool
            ? {
                _id: clickedTool._id,
                name: clickedTool.name,
                icon_url: clickedTool.icon_url,
                color: clickedTool.color,
                category: allTools.find((t) => t._id === clickedTool._id)
                  ?.category,
              }
            : null
        }
        agentId={createdAgentId || ""}
        agentName={agent?.data?.name}
        onConnect={handleConnectToTool}
        onConnectLoading={isConnectingTool}
      />

      <GuestLoginDialog
        open={signInModalOpen}
        onOpenChange={setSignInModalOpen}
      />
    </>
  );
};
