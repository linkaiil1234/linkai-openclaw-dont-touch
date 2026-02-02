"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useOpenClose } from "@/hooks/custom/use-open-close";
import {
  useGetAllConversations,
  useMarkConversationAsRead,
} from "@/hooks/api/chatwoot/conversations";
import { useQueryParams } from "@/hooks/custom/use-query-params";
import { useGetAllConversationMessages } from "@/hooks/api/chatwoot/messages";
import {
  useSendMessage,
  useToggleAgent,
} from "@/hooks/api/chatwoot/send-message";
import { useGetConversationByChatwootId } from "@/hooks/api/conversation";
import { ChatBoxSidebar } from "@/components/shared/all-chat-box-sidebar";
import { MessageThread } from "@/components/shared/message-thread";
import { DetailsSidebar } from "@/components/shared/details-sidebar";
import { FileIcon, ImageIcon, Link2 } from "lucide-react";
import type { ConversationFormValues } from "@/components/shared/chat-input";
import { useInbox } from "@/providers/inbox-provider";
import { useAuth } from "@/providers/auth-provider";
import { env } from "@/constants/env";
import { invalidateQueries } from "@/lib/query-client";
import { ProductTour } from "@/components/tour/product-tour";
import { useTour } from "@/hooks/custom/use-tour";
import { tourConfigs } from "@/constants/tour-configs";
import { useGetAllToolsWithAgent } from "@/hooks/api/tool";

const clientTabs = [
  { id: "all", label: "All" },
  { id: "archive", label: "Archive" },
  { id: "unread", label: "Unread" },
] as const;

const InboxPage = () => {
  const { open, isOpen, onOpenChange } = useOpenClose();
  const { session } = useAuth();

  // Check if user is authenticated (not anonymous)
  const isAuthenticated =
    session.user?.auth_type !== "anonymous" && !session.loading;

  // Tour functionality - only for authenticated users
  // Use user-specific keys so each user gets their own tour state
  const { isTourOpen, completeTour, skipTour } = useTour({
    isAuthenticated,
    userId: session.user?._id,
    tourKey: "inbox",
  });

  const { params: queryParams } = useQueryParams();

  // Use global inbox context
  const {
    selectedConversationId,
    setSelectedConversationId,
    contactIdToOpen,
    setContactIdToOpen,
  } = useInbox();

  const handleSyncWithChatwoot = () => {
    invalidateQueries({
      queryKey: ["useGetAllConversations"],
    });
    toast.success("Conversations synced with Chatwoot");
  };

  console.log("selectedConversationId", selectedConversationId);

  const [selectedChannel, setSelectedChannel] = React.useState<
    "whatsapp" | "email" | "sms" | "instagram" | "telegram" | null
  >(null);

  const [isDetailsSidebarOpen, setIsDetailsSidebarOpen] = React.useState(false);

  // Socket.IO ref for real-time updates
  const socketRef = useRef<Socket | null>(null);

  const { data: conversations, isLoading: isLoadingConversations } =
    useGetAllConversations(queryParams);

  // Mark conversation as read mutation
  const { mutate: markAsRead } = useMarkConversationAsRead({
    onSuccess: () => {
      console.log("✅ Conversation marked as read");
      // Refresh conversations to update unread count
      invalidateQueries({ queryKey: ["useGetAllConversations"] });
    },
    onError: (error) => {
      console.error("❌ Failed to mark conversation as read:", error);
    },
  });

  // Send message mutation
  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage({
    onSuccess: () => {
      invalidateQueries({
        queryKey: ["useGetAllConversationMessages", selectedConversationId],
      });
      invalidateQueries({
        queryKey: ["useGetConversationByChatwootId", selectedConversationId],
      });
      invalidateQueries({ queryKey: ["useGetAllConversations"] });
    },
    onError: (error) => {
      console.error("❌ Failed to send message:", error);
    },
  });

  // Toggle agent mutation
  const { mutate: toggleAgent } = useToggleAgent({
    onSuccess: (data: any, variables) => {
      console.log("✅ Agent toggled successfully");
      toast.success(
        `Agent ${variables.is_agent_active ? "enabled" : "disabled"}`,
      );
      invalidateQueries({
        queryKey: ["useGetConversationByChatwootId", selectedConversationId],
      });
      invalidateQueries({ queryKey: ["useGetAllConversations"] });
    },
    onError: (error) => {
      console.error("❌ Failed to toggle agent:", error);
      toast.error("Failed to toggle agent");
    },
  });

  // Filter out conversations where sender email matches session email
  const filteredConversations = useMemo(() => {
    if (!conversations?.data?.payload) return conversations;

    const sessionEmail = session.user?.email?.toLowerCase();
    if (!sessionEmail) return conversations;

    const filtered = conversations.data.payload.filter((conversation) => {
      const senderEmail = conversation.meta.sender.email?.toLowerCase();
      return senderEmail !== sessionEmail;
    });

    return {
      ...conversations,
      data: {
        ...conversations.data,
        payload: filtered,
      },
    };
  }, [conversations, session.user?.email]);

  const { data: messages, isLoading: isLoadingMessages } =
    useGetAllConversationMessages(selectedConversationId || "", {
      enabled: !!selectedConversationId,
    });

  // Fetch MongoDB conversation to get agent status
  const { data: mongoConversation } = useGetConversationByChatwootId(
    selectedConversationId || "",
    {
      enabled: !!selectedConversationId,
    },
  );

  // Get channel from selected conversation
  const getChannelFromConversation = (id: string) => {
    const conversation = filteredConversations?.data?.payload?.find(
      (conv) => conv.id.toString() === id,
    );

    if (!conversation) return null;

    const channelMap: Record<
      string,
      "whatsapp" | "email" | "sms" | "instagram" | "telegram"
    > = {
      "Channel::TwilioSms": "sms",
      "Channel::Whatsapp": "whatsapp",
      "Channel::Email": "email",
      "Channel::Telegram": "telegram",
      "Channel::Instagram": "instagram",
      "Channel::WebWidget": "email", // Treat web widget as email/general
      sms: "sms",
      whatsapp: "whatsapp",
      email: "email",
      telegram: "telegram",
      instagram: "instagram",
    };

    return channelMap[conversation.meta.channel] || "email";
  };

  // Socket.IO connection for real-time updates
  useEffect(() => {
    // Extract base URL by removing /api/v1 path
    const baseUrl = env.apiUrl.replace(/\/api\/v1\/?$/, "");

    console.log("🔌 Connecting to Socket.IO server at:", baseUrl);

    const socket = io(baseUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      console.log("📡 Socket transport:", socket.io.engine.transport.name);

      // Test if we can receive events by emitting a test event
      socket.emit("test_connection", { message: "Frontend connected" });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    // Test event - just to verify socket connection works
    socket.on("test_event", (data: any) => {
      console.log("🧪 Test event received:", data);
    });

    // Listen for message_created events
    socket.on("chatwoot:message_created", (data: any) => {
      console.log("📨 New message received:", data);

      // Invalidate conversations to update message preview and timestamps
      invalidateQueries({ queryKey: ["useGetAllConversations"] });

      // If the message is for the currently selected conversation, refresh messages
      if (selectedConversationId === data.conversation_id?.toString()) {
        invalidateQueries({
          queryKey: ["useGetAllConversationMessages", selectedConversationId],
        });
      }
    });

    // Listen for message_updated events
    socket.on("chatwoot:message_updated", (data: any) => {
      console.log("📝 Message updated:", data);

      // Refresh messages if it's for the selected conversation
      if (selectedConversationId === data.conversation_id?.toString()) {
        invalidateQueries({
          queryKey: ["useGetAllConversationMessages", selectedConversationId],
        });
      }
    });

    // Listen for conversation_created events
    socket.on("chatwoot:conversation_created", (data: any) => {
      console.log("💬 New conversation created:", data);

      // Refresh conversations list
      invalidateQueries({ queryKey: ["useGetAllConversations"] });
    });

    // Listen for conversation_updated events
    socket.on("chatwoot:conversation_updated", (data: any) => {
      console.log("🔄 Conversation updated:", data);

      // Refresh conversations list
      invalidateQueries({ queryKey: ["useGetAllConversations"] });
    });

    // Listen for conversation_status_changed events
    socket.on("chatwoot:conversation_status_changed", (data: any) => {
      console.log("🔄 Conversation status changed:", data);

      // Refresh conversations list
      invalidateQueries({ queryKey: ["useGetAllConversations"] });
    });

    // Listen for general inbox updates
    socket.on("chatwoot:inbox_update", (data: any) => {
      console.log("📬 Inbox update received:", data.type);

      // This is a catch-all that ensures we always refresh when something changes
      invalidateQueries({ queryKey: ["useGetAllConversations"] });

      // If there's a selected conversation, refresh its messages too
      if (selectedConversationId) {
        invalidateQueries({
          queryKey: ["useGetAllConversationMessages", selectedConversationId],
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        console.log("🔌 Disconnecting socket...");
        socket.disconnect();
      }
    };
  }, [selectedConversationId]);

  // Find conversation by contact ID when navigating from customers page
  React.useEffect(() => {
    if (
      contactIdToOpen &&
      filteredConversations?.data?.payload &&
      !isLoadingConversations
    ) {
      console.log("Looking for conversation with contact ID:", contactIdToOpen);
      console.log(
        "Available conversations:",
        filteredConversations.data.payload.map((c) => ({
          id: c.id,
          contactId: c.meta.sender.id,
          name: c.meta.sender.name,
        })),
      );

      // Find conversation where meta.sender.id matches the contact ID
      const conversation = filteredConversations.data.payload.find(
        (conv) => conv.meta.sender.id.toString() === contactIdToOpen,
      );

      console.log("Found conversation:", conversation);

      if (conversation) {
        const conversationId = conversation.id.toString();
        console.log("Setting conversation ID:", conversationId);
        setSelectedConversationId(conversationId);
        // Clear the contact ID to open
        setContactIdToOpen(null);

        // Set the channel
        const channelMap: Record<
          string,
          "whatsapp" | "email" | "sms" | "instagram" | "telegram"
        > = {
          "Channel::TwilioSms": "sms",
          "Channel::Whatsapp": "whatsapp",
          "Channel::Email": "email",
          "Channel::Telegram": "telegram",
          "Channel::Instagram": "instagram",
          "Channel::WebWidget": "email", // Treat web widget as email/general
          sms: "sms",
          whatsapp: "whatsapp",
          email: "email",
          telegram: "telegram",
          instagram: "instagram",
        };

        const channel = channelMap[conversation.meta.channel] || "email";
        setSelectedChannel(channel);
      } else {
        console.log("Conversation not found for contact ID:", contactIdToOpen);
        // If conversation not found, clear the contact ID to prevent infinite loop
        setContactIdToOpen(null);
      }
    }
  }, [
    contactIdToOpen,
    filteredConversations?.data?.payload,
    isLoadingConversations,
    setSelectedConversationId,
    setContactIdToOpen,
  ]);

  // Sync channel when conversation ID changes from provider
  React.useEffect(() => {
    if (selectedConversationId && filteredConversations?.data?.payload) {
      const conversation = filteredConversations.data.payload.find(
        (conv) => conv.id.toString() === selectedConversationId,
      );

      if (conversation) {
        const channelMap: Record<
          string,
          "whatsapp" | "email" | "sms" | "instagram" | "telegram"
        > = {
          "Channel::TwilioSms": "sms",
          "Channel::Whatsapp": "whatsapp",
          "Channel::Email": "email",
          "Channel::Telegram": "telegram",
          "Channel::Instagram": "instagram",
          "Channel::WebWidget": "email", // Treat web widget as email/general
          sms: "sms",
          whatsapp: "whatsapp",
          email: "email",
          telegram: "telegram",
          instagram: "instagram",
        };

        const channel = channelMap[conversation.meta.channel] || "email";
        setSelectedChannel(channel);
      }
    }
  }, [selectedConversationId, filteredConversations?.data?.payload]);

  const handleConversationClick = (id: string) => {
    // Update state instead of URL params
    setSelectedConversationId(id);

    // Get and set the channel
    const channel = getChannelFromConversation(id);
    setSelectedChannel(channel);

    // Mark conversation as read
    markAsRead({ conversation_id: id });

    // Log to console
    console.log("Selected Channel:", channel);
    console.log("Conversation ID:", id);
  };

  const handleMessageSubmit = (values: ConversationFormValues) => {
    if (!selectedConversationId || !values.message.trim()) return;

    console.log("Sending message:", values.message);
    console.log("Conversation ID:", selectedConversationId);

    // Send the message
    sendMessage({
      conversation_id: parseInt(selectedConversationId),
      content: values.message,
    });
  };

  // Handler for toggling agent
  const handleToggleAgent = (isActive: boolean) => {
    if (!selectedConversationId || !mongoConversation?.data?._id) return;

    toggleAgent({
      conversation_id: mongoConversation.data._id,
      is_agent_active: isActive,
    });
  };

  // Get agent status from MongoDB conversation
  const getAgentActiveStatus = () => {
    if (!mongoConversation?.data) {
      return false; // Default to false while loading
    }

    return mongoConversation.data.is_agent_active ?? false;
  };

  return (
    <div className="flex gap-2 overflow-y-hidden">
      {/* Conversations List using ChatBoxSidebar component */}
      <ChatBoxSidebar
        title="Chat boxes"
        searchParamKey="client"
        searchPlaceholder="Search for a client"
        items={filteredConversations?.data?.payload || []}
        selectedId={selectedConversationId || ""}
        onSelectItem={handleConversationClick}
        activeTab="all"
        onTabChange={() => {}}
        tabs={clientTabs}
        onAddClick={open}
        isLoading={isLoadingConversations}
        onSyncWithChatwoot={() => {}}
      />

      {/* Message Thread */}
      <MessageThread
        conversationId={selectedConversationId}
        messages={messages?.data?.payload}
        isLoadingMessages={isLoadingMessages}
        selectedChannel={selectedChannel}
        contactInfo={
          messages?.data?.meta?.contact
            ? {
                name: messages.data.meta.contact.name,
                email: messages.data.meta.contact.email ?? undefined,
                thumbnail: messages.data.meta.contact.thumbnail,
              }
            : undefined
        }
        onMenuClick={() => setIsDetailsSidebarOpen((prev) => !prev)}
        onSubmit={handleMessageSubmit}
        isAgentActive={getAgentActiveStatus()}
        onToggleAgent={handleToggleAgent}
      />

      {/* Details Sidebar */}
      {isDetailsSidebarOpen && messages?.data?.meta?.contact && (
        <DetailsSidebar
          avatar={messages.data.meta.contact.thumbnail || ""}
          name={messages.data.meta.contact.name || ""}
          email={messages.data.meta.contact.email || undefined}
          channel={selectedChannel || "email"}
          detailFields={[
            {
              label: "Phone Number",
              value: messages.data.meta.contact.phone_number || "Not provided",
            },
            {
              label: "Username",
              value: `@${(messages.data.meta.contact.name || "")
                .toLowerCase()
                .replace(/\s+/g, "")}`,
            },
          ]}
          filesTitle="Media Files"
          files={[]}
          tabs={[
            {
              value: "files",
              label: "Files",
              icon: <FileIcon size={14} className="mr-1.5" />,
            },
            {
              value: "media",
              label: "Media",
              icon: <ImageIcon size={14} className="mr-1.5" />,
            },
            {
              value: "links",
              label: "Links",
              icon: <Link2 size={14} className="mr-1.5" />,
            },
          ]}
          emptyTabMessages={{
            media: "No media shared yet.",
            links: "No links shared yet.",
          }}
          isOpen={isDetailsSidebarOpen}
          onClose={() => setIsDetailsSidebarOpen(false)}
        />
      )}

      {/* <NewCustomerDialog open={isOpen} onOpenChange={onOpenChange} /> */}

      {/* Product Tour */}
      <ProductTour
        isOpen={isTourOpen}
        onComplete={completeTour}
        onSkip={skipTour}
        steps={tourConfigs.inbox.steps}
      />
    </div>
  );
};

export default InboxPage;
