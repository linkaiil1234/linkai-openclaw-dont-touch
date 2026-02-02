"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { env } from "@/constants/env";
import { FaFacebookSquare, FaTelegram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdSms } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";
import { InstagramIconGradient } from "@/constants/channel-icons";
import Image from "next/image";
import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";
import { MessageSecure01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useGetAgentById, useUpdateAgent } from "@/hooks/api/agent";
import { useGetAllChannels } from "@/hooks/api/channel";
import { useGetAllAgentEditConversations } from "@/hooks/api/agent-edit-conversation";
import {
  useCreateTelegramInbox,
  useCreateWebWidgetInbox,
  useGetInboxByAgent,
} from "@/hooks/api/chatwoot/inbox";
import { useCompleteWhatsAppSetup } from "@/hooks/api/chatwoot/whatsapp";
import { runEmbeddedSignupPopup } from "@/lib/meta/embedded-signup-popup";
import { invalidateQueries } from "@/lib/query-client";
import { TChannel } from "@/types/models/channel";
import { TInboxMessage } from "@/types/models/inbox-message";
import { useGetPlaygroundConversation } from "@/hooks/api/conversation";
import { useQueryParams } from "@/hooks/custom/use-query-params";
import { useAuth } from "@/providers/auth-provider";
import { DetailsSidebar } from "@/components/shared/details-sidebar";
import { Database01Icon } from "@hugeicons/core-free-icons";
import { useTour } from "@/hooks/custom/use-tour";
import { ProductTour } from "@/components/tour/product-tour";
import { tourConfigs } from "@/constants/tour-configs";
import { useGetAllTools } from "@/hooks/api/tool";
import EditSettingsPanel from "../components/edit-settings-panel";
import ChatPanel from "../components/chat-panel";
import {
  ChannelConnectionDialog,
  AllChannelsDialog,
  DisconnectChannelDialog,
  ChannelMetadataDialog,
} from "@/components/agent-train";
import { FileIcon, ImageIcon, Link2 } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { TAgentPopulated } from "@/types/models/agent";
import { useAgentEditSSE } from "@/hooks/custom/use-agent-edit-sse";

const TrainAgentPage = () => {
  const params = useParams<{ _id: string }>();
  const { mutate: updateAgent } = useUpdateAgent();
  const { session } = useAuth();

  // Fetch agent data
  const {
    data: agentResponse,
    isLoading: agentLoading,
    error: agentError,
  } = useGetAgentById(params._id, {
    enabled: !!params._id,
    refetchInterval: (query) => {
      const agentData = query.state.data?.data as TAgentPopulated | undefined;
      return agentData?.setup_step < 5 ? 3000 : false;
    },
  });

  const agent = agentResponse?.data;

  // Derive agentEmail from agent name
  const agentUsername = agent?.name?.toLowerCase().replace(/\s+/g, "") || "";
  const agentEmail = agentUsername ? `${agentUsername}@linkaiil.ai` : "";

  // Fetch channels from API
  const {
    data: channelsResponse,
    isLoading: channelsLoading,
    error: channelsError,
  } = useGetAllChannels();

  // Map channels from API response
  const socialMediaChannels = channelsResponse?.data || [];

  // Fetch tools from API
  const {
    data: toolsResponse,
    isLoading: toolsLoading,
    error: toolsError,
  } = useGetAllTools();

  // Default UI properties for tools not in the mapping
  const defaultToolUI = {
    icon: <HugeiconsIcon icon={Database01Icon} size={20} />,
    color: "#6366F1",
    description: "External tool integration",
    bgGradient: "from-[#6366F1]/20 to-[#6366F1]/5",
  };

  // Transform API tools data to include UI properties
  const tools =
    toolsResponse?.data?.map((tool) => ({
      ...tool,
      ...defaultToolUI,
    })) || [];

  // Helper function to extract IDs from config (handles both populated and unpopulated data)
  const getConfigIds = () => {
    const channelsData = agent?.config?.channels || [];
    const toolsData = agent?.config?.tools || [];

    // Extract IDs - handle both string[] and object[] formats
    const channelIds = channelsData.map((item: string | { _id: string }) =>
      typeof item === "string" ? item : item._id,
    );

    const toolIds = toolsData.map((item: string | { _id: string }) =>
      typeof item === "string" ? item : item._id,
    );

    return { channelIds, toolIds };
  };

  // Check if page is fully loaded
  const isPageLoaded =
    !agentLoading && !channelsLoading && !toolsLoading && !!agent;

  // Check if user is authenticated (not anonymous)
  const isAuthenticated =
    session.user?.auth_type !== "anonymous" && !session.loading;

  // Initialize tour - only auto-start after page is loaded
  // Use user-specific keys for authenticated users so each user gets their own tour state
  const { isTourOpen, completeTour, skipTour, startTour, resetTour } = useTour({
    isAuthenticated,
    userId: session.user?._id,
    tourKey: "agentTrain",
    autoStart: false, // We'll manually start it after loading
    delay: 1000,
  });

  // Function to check if tour should start
  const checkAndStartTour = useCallback(() => {
    // Use the same user-specific key logic as useTour hook
    const finalTourKey =
      isAuthenticated && session.user?._id
        ? `${session.user._id}_agentTrain`
        : "agentTrain";
    const storageKey = `linkaiil_tour_completed_${finalTourKey}`;
    const tourCompleted = localStorage.getItem(storageKey);

    // Only start if tour hasn't been completed and page is loaded
    if (!tourCompleted && isPageLoaded) {
      // Get all tour targets from the tour config
      const tourSteps = tourConfigs.agentTrain?.steps || [];

      // Check if the first step's element exists (this ensures the tour can start)
      // The ProductTour component will handle finding other elements and tab switching as it progresses
      const firstStepTarget = tourSteps[0]?.target;
      if (firstStepTarget) {
        const firstElement = document.querySelector(firstStepTarget);
        if (firstElement) {
          startTour();
          return true;
        }
      }
    }
    return false;
  }, [isPageLoaded, startTour, isAuthenticated, session.user]);

  // Listen for tour resets (when user clicks "Repeat Tutorials")
  useEffect(() => {
    // Use the same user-specific key logic as useTour hook
    const finalTourKey =
      isAuthenticated && session.user?._id
        ? `${session.user._id}_agentTrain`
        : "agentTrain";
    const storageKey = `linkaiil_tour_completed_${finalTourKey}`;
    let lastTourState = localStorage.getItem(storageKey);

    // Listen for storage events (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue === null && isPageLoaded) {
        // Tour was reset, restart it
        resetTour();
        setTimeout(() => {
          checkAndStartTour();
        }, 500);
      }
    };

    // Poll for localStorage changes (for same-window resets)
    const checkTourReset = () => {
      const currentTourState = localStorage.getItem(storageKey);
      // If tour completion was removed (reset), restart the tour
      if (
        lastTourState === "true" &&
        currentTourState === null &&
        isPageLoaded
      ) {
        resetTour();
        setTimeout(() => {
          checkAndStartTour();
        }, 500);
      }
      lastTourState = currentTourState;
    };

    window.addEventListener("storage", handleStorageChange);
    // Check periodically for same-window resets
    const interval = setInterval(checkTourReset, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [
    isPageLoaded,
    resetTour,
    checkAndStartTour,
    isAuthenticated,
    session.user,
  ]);

  // Start tour after page is loaded and elements are rendered
  useEffect(() => {
    if (isPageLoaded) {
      // Check if all tour target elements exist before starting
      const checkElementsAndStartTour = () => {
        if (!checkAndStartTour()) {
          // Retry after a short delay if elements aren't ready or tour is completed
          setTimeout(checkElementsAndStartTour, 500);
        }
      };

      // Initial delay to ensure DOM elements are rendered
      const timer = setTimeout(checkElementsAndStartTour, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPageLoaded, checkAndStartTour]);

  const getChannelIconAndColor = (channel: TChannel) => {
    const channelName = channel.name?.toLowerCase();

    if (channelName === "whatsapp") {
      return {
        icon: <IoLogoWhatsapp size={24} />,
        color: "#25D366",
      };
    }
    if (channelName === "telegram") {
      return {
        icon: <FaTelegram size={24} />,
        color: "#0088cc",
      };
    }
    if (channelName === "facebook") {
      return {
        icon: <FaFacebookSquare size={24} />,
        color: "#1877F2",
      };
    }
    if (channelName === "instagram") {
      return {
        icon: <InstagramIconGradient size={24} />,
        color: "#ffffff",
      };
    }
    if (channelName === "email") {
      return {
        icon: (
          <Image
            src={GmailIcon}
            alt="Gmail"
            width={24}
            height={24}
            className="object-contain"
          />
        ),
        color: "#EA4335",
      };
    }
    if (channelName === "sms") {
      return {
        icon: <MdSms size={24} />,
        color: "#8B5CF6",
      };
    }
    if (channelName === "web") {
      return {
        icon: <CiGlobe size={24} />,
        color: "#6B46C1",
      };
    }

    // Default fallback
    return {
      icon: <HugeiconsIcon icon={MessageSecure01Icon} size={24} />,
      color: "#6366F1",
    };
  };

  // Helper function to check if channel is connected
  const isChannelConnected = (channelId: string) => {
    const { channelIds } = getConfigIds();
    return channelIds.includes(channelId);
  };

  // State for channel dialogs
  const [showAllToolsDialog, setShowAllToolsDialog] = useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [channelDialogStep, setChannelDialogStep] = useState("step-1");
  const [selectedChannelType, setSelectedChannelType] = useState<
    "web-widget" | "telegram" | "whatsapp" | null
  >(null);
  const [botToken, setBotToken] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [welcomeTitle, setWelcomeTitle] = useState("");
  const [isCreatingInbox, setIsCreatingInbox] = useState(false);
  const [webWidgetData, setWebWidgetData] = useState<{
    web_widget_script: string;
    website_token: string;
    website_url: string;
  } | null>(null);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [channelToDisconnect, setChannelToDisconnect] = useState<{
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color: string;
  } | null>(null);
  const [clickedTool, setClickedTool] = useState<{
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color: string;
    type: "channel" | "tool";
  } | null>(null);

  // Channel metadata dialog state
  const [isMetadataDialogOpen, setIsMetadataDialogOpen] = useState(false);
  const [selectedChannelForMetadata, setSelectedChannelForMetadata] = useState<{
    _id: string;
    name: string;
    icon?: React.ReactNode;
    color: string;
    type: "telegram" | "whatsapp" | "webwidget" | null;
  } | null>(null);

  // Fetch inbox data for the agent
  const { data: inboxResponse } = useGetInboxByAgent(agent?._id || "", {
    enabled: !!agent?._id && isMetadataDialogOpen,
  });

  // Mutations for creating inboxes
  const { mutate: createWebWidgetInbox } = useCreateWebWidgetInbox({
    onSuccess: (response) => {
      toast.success("Web widget inbox created successfully!");
      invalidateQueries({ queryKey: ["useGetAgentById", agent?._id] });
      setIsCreatingInbox(false);
      // Store web widget data from response
      if (response?.data) {
        setWebWidgetData({
          web_widget_script: response.data.web_widget_script,
          website_token: response.data.website_token,
          website_url: response.data.website_url,
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create inbox");
      setIsCreatingInbox(false);
      setChannelDialogStep("step-2");
    },
  });

  const { mutate: createTelegramInbox } = useCreateTelegramInbox({
    onSuccess: () => {
      toast.success("Telegram inbox created successfully!");
      invalidateQueries({ queryKey: ["useGetAgentById", agent?._id] });
      setIsCreatingInbox(false);
    },
    onError: (error) => {
      console.log("error status code:", error.status_code);
      if (error.status_code === 422) {
        toast.error(
          "This Bot Token is already in use, please use a different one",
        );
        return;
      }
      toast.error(error.message || "Failed to create inbox");
      setIsCreatingInbox(false);
      setChannelDialogStep("step-2");
    },
  });

  const { mutate: completeWhatsAppSetup } = useCompleteWhatsAppSetup({
    onSuccess: (response) => {
      const phoneNumber = response?.data?.phone_number;
      const verifiedName = response?.data?.verified_name;
      toast.success(
        `WhatsApp connected successfully! ${phoneNumber ? `Number: ${phoneNumber}` : ""}`,
      );
      invalidateQueries({ queryKey: ["useGetAgentById", params._id] });
      setIsCreatingInbox(false);
      setChannelDialogStep("step-2");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to setup WhatsApp");
      setIsCreatingInbox(false);
      setChannelDialogStep("step-2");
    },
  });

  // Channel connection dialog handlers
  const handleOpenChannelDialog = (channel: {
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color: string;
  }) => {
    // Determine channel type based on clicked channel name
    const channelName = channel.name?.toLowerCase();
    if (channelName === "telegram") {
      setSelectedChannelType("telegram");
    } else if (channelName === "whatsapp") {
      setSelectedChannelType("whatsapp");
    } else if (channelName === "web") {
      setSelectedChannelType("web-widget");
    } else {
      setSelectedChannelType("web-widget");
    }
    setClickedTool({ ...channel, type: "channel" });
    // Go directly to step 2 since channel is already selected
    setChannelDialogStep("step-2");
    setBotToken("");
    setIsChannelDialogOpen(true);
  };

  const handleCreateInbox = async () => {
    if (selectedChannelType === "telegram" && !botToken) return;

    setIsCreatingInbox(true);
    setChannelDialogStep("step-3");

    try {
      if (selectedChannelType === "web-widget") {
        createWebWidgetInbox({
          agent_id: params._id,
          name: websiteUrl || "Web Widget",
          channel: {
            website_url: websiteUrl,
            welcome_title: welcomeTitle,
            welcome_tagline: "",
            widget_color: "",
          },
        });
      } else if (selectedChannelType === "telegram") {
        createTelegramInbox({
          bot_token: botToken,
          agent_id: params._id,
          channel: {
            bot_token: botToken,
          },
        });
      } else if (selectedChannelType === "whatsapp") {
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
              agent_id: params._id,
            });
          },
          onError: (error) => {
            console.error("WhatsApp embedded signup error:", error);
            toast.error(error || "Failed to complete WhatsApp signup");
            setIsCreatingInbox(false);
            setChannelDialogStep("step-2");
          },
          onCancel: () => {
            console.log("WhatsApp signup cancelled");
            setIsCreatingInbox(false);
            setChannelDialogStep("step-2");
          },
        });
      }
    } catch (error) {
      console.error("Failed to create inbox:", error);
      setIsCreatingInbox(false);
    }
  };

  const handleCloseChannelDialog = () => {
    setChannelDialogStep("step-1");
    setSelectedChannelType(null);
    setBotToken("");
    setWebsiteUrl("");
    setWelcomeTitle("");
    setWebWidgetData(null);
    setIsCreatingInbox(false);
    setIsChannelDialogOpen(false);
  };

  // Disconnect confirmation handlers
  const handleOpenDisconnectDialog = (channel: {
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color: string;
  }) => {
    setChannelToDisconnect(channel);
    setIsDisconnectDialogOpen(true);
  };

  // Channel metadata dialog handler
  const handleOpenMetadataDialog = (channel: {
    _id: string;
    name: string;
    icon?: React.ReactNode;
    color: string;
  }) => {
    // Determine channel type based on channel name
    const channelName = channel.name?.toLowerCase();
    let channelType: "telegram" | "whatsapp" | "webwidget" | null = null;

    if (channelName === "telegram") {
      channelType = "telegram";
    } else if (channelName === "whatsapp") {
      channelType = "whatsapp";
    } else if (channelName === "web") {
      channelType = "webwidget";
    }

    setSelectedChannelForMetadata({
      ...channel,
      type: channelType,
    });
    setIsMetadataDialogOpen(true);
  };

  const handleDisconnectTool = (
    itemId: string,
    itemName: string,
    type: "channel" | "tool",
  ) => {
    if (!agent?._id) return;

    const { channelIds, toolIds } = getConfigIds();

    updateAgent(
      {
        _id: agent._id,
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
          invalidateQueries({ queryKey: ["useGetAgentById", agent._id] });
        },
        onError: (error) => {
          toast.error(error.message || "Failed to disconnect");
        },
      },
    );
  };

  const handleConfirmDisconnect = () => {
    if (channelToDisconnect) {
      handleDisconnectTool(
        channelToDisconnect._id,
        channelToDisconnect.name,
        "channel",
      );
      setIsDisconnectDialogOpen(false);
      setChannelToDisconnect(null);
    }
  };

  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      role: "user" | "agent";
      content: string;
      timestamp: Date;
      read?: boolean;
    }>
  >([]);
  const [editMessages, setEditMessages] = useState<
    Array<{
      id: string;
      role: "user" | "agent";
      content: string;
      timestamp: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isDetailsSidebarOpen, setIsDetailsSidebarOpen] = useState(false);

  // Fetch conversation history - only after agent is loaded
  const {
    data: conversationsResponse,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useGetAllAgentEditConversations(
    { agent_id: params._id },
    { enabled: !!params._id && !!agent },
  );

  const conversations = conversationsResponse?.data || [];

  // Load conversation history into editMessages
  useEffect(() => {
    if (conversations.length > 0) {
      const messages = conversations.map((conv) => ({
        id: conv._id,
        role: conv.role,
        content: conv.content,
        timestamp: conv.createdAt || new Date().toISOString(),
      }));
      queueMicrotask(() => {
        setEditMessages(messages);
      });
    }
  }, [conversations]);

  // AI Edit SSE Hook
  const {
    sendMessage: sendEditMessage,
    isLoading: isSSELoading,
    error: sseError,
    streamingContent,
  } = useAgentEditSSE({
    onComplete: (fullContent) => {
      const agentMessage = {
        id: Math.random().toString(),
        role: "agent" as const,
        content: fullContent,
        timestamp: new Date().toISOString(),
      };
      setEditMessages((prev) => [...prev, agentMessage]);
      setIsEditLoading(false);
      // Refetch conversations to update the history
      refetchConversations();
    },
    onError: (error) => {
      toast.error(error || "Failed to get AI response");
      setIsEditLoading(false);
    },
  });

  // Socket.IO and real-time messaging state
  const [localMessages, setLocalMessages] = useState<TInboxMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { params: qParams, updateParam } = useQueryParams();

  // Get playground conversation
  const { data: playgroundConversationResponse } = useGetPlaygroundConversation(
    { agent_id: params._id },
    { enabled: !!params._id },
  );

  const playgroundConversation = playgroundConversationResponse?.data;

  // Set conversation_id in query params when playground conversation is loaded
  useEffect(() => {
    if (
      playgroundConversation?.chatwoot?.conversation_id &&
      !qParams.conversation_id
    ) {
      updateParam(
        "conversation_id",
        String(playgroundConversation.chatwoot.conversation_id),
        "replace",
      );
    }
  }, [playgroundConversation, qParams.conversation_id, updateParam]);

  // Socket.io connection - establish when page loads
  useEffect(() => {
    if (!params._id) return;

    // Extract base URL by removing /api/v1 path
    const baseUrl = env.apiUrl.replace(/\/api\/v1\/?$/, "");

    console.log("Connecting to socket server at:", baseUrl);

    const socket = io(baseUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join_agent_room", params._id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Listen for messages_fetched event
    socket.on(
      "messages_fetched",
      (data: { conversation_id: string; messages: any }) => {
        console.log("Messages fetched:", data);
        const messages = Array.isArray(data.messages)
          ? data.messages
          : data.messages?.payload || [];
        setLocalMessages(messages);

        // Convert to chatMessages format for UI compatibility
        const formattedMessages = messages.map((msg: any) => ({
          id: msg._id || msg.id?.toString() || Math.random().toString(),
          role:
            msg.message_type === 0 || msg.sender === "user" ? "user" : "agent",
          content: msg.content || msg.message || "",
          timestamp: new Date(msg.created_at || msg.createdAt || Date.now()),
          read: true,
        }));
        setChatMessages(formattedMessages);
      },
    );

    // Listen for fetch_messages_error event
    socket.on("fetch_messages_error", (data: { error: string }) => {
      console.error("Error fetching messages:", data.error);
      // toast.error("Failed to fetch messages");
    });

    // Listen for message_sent event
    socket.on(
      "message_sent",
      (data: { conversation_id: number; message: any }) => {
        console.log("Message sent:", data);
        setIsSendingMessage(false);
        setIsLoading(false);

        // Refetch messages to get the updated conversation
        const userChatwoot = (session.user as any)?.chatwoot;
        if (
          userChatwoot?.account_id &&
          userChatwoot?.access_token &&
          qParams.conversation_id
        ) {
          socket.emit("fetch_messages", {
            conversation_id: qParams.conversation_id,
            account_id: userChatwoot.account_id,
            access_token: userChatwoot.access_token,
          });
        }
      },
    );

    // Listen for send_message_error event
    socket.on("send_message_error", (data: { error: string }) => {
      console.error("Error sending message:", data.error);
      // toast.error("Failed to send message");
      setIsSendingMessage(false);
      setIsLoading(false);
    });

    // Listen for chatwoot:message_created events (real-time message updates)
    socket.on("chatwoot:message_created", (data: any) => {
      console.log(
        "📨 New message received via chatwoot:message_created:",
        data,
      );

      if (qParams.conversation_id === data.conversation_id?.toString()) {
        const userChatwoot = (session.user as any)?.chatwoot;
        if (userChatwoot?.account_id && userChatwoot?.access_token) {
          socket.emit("fetch_messages", {
            conversation_id: qParams.conversation_id,
            account_id: userChatwoot.account_id,
            access_token: userChatwoot.access_token,
          });
        }
      }
    });

    // Listen for general chatwoot:inbox_update events
    socket.on("chatwoot:inbox_update", (data: any) => {
      console.log("📬 Inbox update received via chatwoot:inbox_update:", data);

      if (data.type === "message_created" && data.conversation_id) {
        const conversationId =
          data.conversation?.id?.toString() || data.conversation_id?.toString();

        if (qParams.conversation_id === conversationId) {
          const userChatwoot = (session.user as any)?.chatwoot;
          if (userChatwoot?.account_id && userChatwoot?.access_token) {
            console.log(
              "🔄 Refetching messages for conversation:",
              conversationId,
            );
            socket.emit("fetch_messages", {
              conversation_id: qParams.conversation_id,
              account_id: userChatwoot.account_id,
              access_token: userChatwoot.access_token,
            });
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.emit("leave_agent_room", params._id);
        socket.disconnect();
      }
    };
  }, [params._id, session, qParams.conversation_id]);

  // Fetch messages when conversation_id is available in qParams
  useEffect(() => {
    if (!qParams.conversation_id || !socketRef.current || !session?.user)
      return;

    const userChatwoot = (session.user as any)?.chatwoot;
    if (!userChatwoot?.account_id || !userChatwoot?.access_token) {
      console.error("User chatwoot credentials not found");
      return;
    }

    console.log("Fetching messages for conversation:", qParams.conversation_id);

    socketRef.current.emit("fetch_messages", {
      conversation_id: qParams.conversation_id,
      account_id: userChatwoot.account_id,
      access_token: userChatwoot.access_token,
    });
  }, [qParams.conversation_id, session]);

  const handleSendChatMessage = async (message: string) => {
    if (!qParams.conversation_id || !socketRef.current || !session?.user) {
      return;
    }

    if (isSendingMessage) {
      return;
    }

    const userChatwoot = (session.user as any)?.chatwoot;
    if (!userChatwoot?.account_id || !userChatwoot?.access_token) {
      toast.error("User chatwoot credentials not found");
      return;
    }

    if (!message || !message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsSendingMessage(true);
    setIsLoading(true);

    // Add user message to UI immediately for optimistic update
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      role: "user" as const,
      content: message,
      timestamp: new Date(),
      read: true,
    };
    setChatMessages((prev) => [...prev, userMessage]);

    // Send message via socket
    console.log("Sending message via socket:", message);
    socketRef.current.emit("send_message", {
      conversation_id: Number(qParams.conversation_id),
      message: message,
      account_id: userChatwoot.account_id,
      access_token: userChatwoot.access_token,
    });
  };

  const handleSendEditMessage = async (message: string) => {
    if (!message.trim() || !agent?._id) return;

    const userMessage = {
      id: Math.random().toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date().toISOString(),
    };
    setEditMessages((prev) => [...prev, userMessage]);
    setIsEditLoading(true);

    try {
      await sendEditMessage(agent._id, message);
    } catch (error) {
      console.error("Failed to send edit message:", error);
      setIsEditLoading(false);
    }
  };

  const generateShareUrl = () => {
    const params = new URLSearchParams({
      messages: JSON.stringify(
        chatMessages.map((m) => ({ role: m.role, content: m.content })),
      ),
    });
    setShareUrl(`${window.location.origin}?${params.toString()}`);
  };

  if (agentLoading) {
    return (
      <main className="size-full flex items-center justify-center">
        <Loading
          size="lg"
          message={
            agentLoading
              ? "Loading agent..."
              : channelsLoading
                ? "Loading channels..."
                : "Loading tools..."
          }
        />
      </main>
    );
  }

  if (agentError || !agent) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-red-500">
            Failed to load agent
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full bg-slate-50"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <EditSettingsPanel
        editMessages={editMessages}
        onSendEditMessage={handleSendEditMessage}
        isEditLoading={isEditLoading}
        streamingContent={streamingContent}
        shareUrl={shareUrl}
        onGenerateShare={generateShareUrl}
        socialMediaChannels={socialMediaChannels}
        tools={tools}
        isChannelConnected={isChannelConnected}
        getChannelIconAndColor={getChannelIconAndColor}
        onChannelClick={(channel) => {
          const isConnected = isChannelConnected(channel._id);
          if (isConnected) {
            handleOpenMetadataDialog({
              _id: channel._id,
              name: channel.name || "Channel",
              icon: getChannelIconAndColor(channel).icon,
              color: getChannelIconAndColor(channel).color,
            });
          } else {
            handleOpenChannelDialog({
              _id: channel._id,
              name: channel.name || "Channel",
              icon: getChannelIconAndColor(channel).icon,
              color: getChannelIconAndColor(channel).color,
            });
          }
        }}
        onShowAllTools={() => setShowAllToolsDialog(true)}
        agentId={agent?._id || ""}
        agentName={agent?.name}
        agentConfig={
          agent?.config
            ? {
                channels: agent.config.channels.map((channel) =>
                  typeof channel === "string" ? channel : channel._id,
                ),
                tools: agent.config.tools.map((tool) =>
                  typeof tool === "string" ? tool : tool._id,
                ),
              }
            : undefined
        }
        agentBehavior={agent?.behavior}
        onConfigUpdate={() => {
          invalidateQueries({ queryKey: ["useGetAgentById", agent?._id] });
        }}
      />
      <ChatPanel
        agentName={agent?.name || "LinkAI"}
        agentDescription={agent?.description || "No description"}
        agentStatus={agent?.status}
        setUpSteps={agent?.setup_step || 0}
        messages={chatMessages}
        onSendMessage={handleSendChatMessage}
        isLoading={isLoading}
        onOpenDetailsSidebar={() => setIsDetailsSidebarOpen(true)}
      />

      {/* Channel Connection Dialog with Stepper */}
      <ChannelConnectionDialog
        open={isChannelDialogOpen}
        onOpenChange={setIsChannelDialogOpen}
        clickedTool={clickedTool}
        channelDialogStep={channelDialogStep}
        setChannelDialogStep={setChannelDialogStep}
        selectedChannelType={selectedChannelType}
        botToken={botToken}
        setBotToken={setBotToken}
        isCreatingInbox={isCreatingInbox}
        agent={
          agent
            ? { _id: agent._id, name: agent.name, avatar: agent.avatar }
            : null
        }
        agentEmail={agentEmail}
        onCreateInbox={handleCreateInbox}
        onClose={handleCloseChannelDialog}
        websiteUrl={websiteUrl}
        setWebsiteUrl={setWebsiteUrl}
        welcomeTitle={welcomeTitle}
        setWelcomeTitle={setWelcomeTitle}
        webWidgetData={webWidgetData}
      />
      {/* Disconnect Confirmation Dialog */}
      <DisconnectChannelDialog
        open={isDisconnectDialogOpen}
        onOpenChange={setIsDisconnectDialogOpen}
        channel={channelToDisconnect}
        onConfirmDisconnect={handleConfirmDisconnect}
        onCancel={() => {
          setIsDisconnectDialogOpen(false);
          setChannelToDisconnect(null);
        }}
      />
      {/* Channel Metadata Dialog */}
      <ChannelMetadataDialog
        open={isMetadataDialogOpen}
        onOpenChange={setIsMetadataDialogOpen}
        channelName={selectedChannelForMetadata?.name || "Channel"}
        channelIcon={selectedChannelForMetadata?.icon}
        inboxes={inboxResponse?.data}
        channelType={selectedChannelForMetadata?.type || null}
        onDisconnect={() => {
          if (selectedChannelForMetadata) {
            handleOpenDisconnectDialog({
              _id: selectedChannelForMetadata._id,
              name: selectedChannelForMetadata.name,
              icon: selectedChannelForMetadata.icon,
              color: selectedChannelForMetadata.color,
            });
          }
        }}
      />
      {/* Show More Channels Dialog */}
      <AllChannelsDialog
        open={showAllToolsDialog}
        onOpenChange={setShowAllToolsDialog}
        tools={socialMediaChannels
          .filter((channel) => channel.name?.toLowerCase() !== "playground")
          .map((channel) => {
            const { icon, color } = getChannelIconAndColor(channel);
            const channelWithUI = channel as TChannel & {
              description?: string;
              bgGradient?: string;
            };
            return {
              ...channel,
              name: channel.name || "Channel",
              icon: icon,
              color: color,
              description: channelWithUI.description || "Communication channel",
              bgGradient: `from-[${color}]/20 to-[${color}]/5`,
              isConnected: isChannelConnected(channel._id),
            };
          })}
        onToolClick={(tool) => {
          // If connected, show metadata dialog; otherwise, open connection dialog
          if (tool.isConnected) {
            handleOpenMetadataDialog({
              _id: tool._id,
              name: tool.name || "Channel",
              icon: tool.icon,
              color: tool.color,
            });
          } else {
            handleOpenChannelDialog({
              _id: tool._id,
              name: tool.name || "Channel",
              icon: tool.icon,
              color: tool.color,
            });
          }
        }}
      />

      {/* Details Sidebar */}
      {isDetailsSidebarOpen && agent && (
        <DetailsSidebar
          avatar={agent.avatar || ""}
          name={agent.name || ""}
          email={agentEmail || undefined}
          channel="email"
          detailFields={[
            {
              label: "Description",
              value: agent.description || "No description",
            },
            {
              label: "Status",
              value: agent.status || "Unknown",
            },
            {
              label: "Language",
              value: agent.language || "Not set",
            },
            {
              label: "Tone",
              value: agent.tone || "Not set",
            },
          ]}
          filesTitle="Knowledge Base"
          tabs={[
            {
              value: "files",
              label: "Files",
              icon: <FileIcon size={14} className="mr-1.5" />,
            },
            {
              value: "texts",
              label: "Texts",
              icon: <ImageIcon size={14} className="mr-1.5" />,
            },
            {
              value: "websites",
              label: "Websites",
              icon: <Link2 size={14} className="mr-1.5" />,
            },
          ]}
          agentId={agent._id}
          isOpen={isDetailsSidebarOpen}
          onClose={() => setIsDetailsSidebarOpen(false)}
        />
      )}
      <ProductTour
        isOpen={isTourOpen}
        onComplete={completeTour}
        onSkip={skipTour}
        steps={tourConfigs.agentTrain.steps}
      />
    </div>
  );
};

export default TrainAgentPage;
