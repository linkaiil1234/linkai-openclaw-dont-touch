"use client";

import { Button } from "@/components/ui/button";
import { cn, getAvatarColors } from "@/lib/utils";
import { SearchBar } from "@/components/shared/search-bar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Add01Icon,
  Refresh01FreeIcons,
  MessageMultiple01FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdSms } from "react-icons/md";
import { FaInstagramSquare } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";
import { useMemo, useState } from "react";
import type { TChatwootConversation } from "@/types/models/chatwoot/conversation";
import {
  AllChannelsDialog,
  ChannelConnectionDialog,
} from "@/components/agent-train/dialogs";
import { useGetAllChannels } from "@/hooks/api/channel";
import { TChannel } from "@/types/models/channel";
import { useGetAllAgents } from "@/hooks/api/agent";
import {
  useCreateTelegramInbox,
  useCreateWebWidgetInbox,
} from "@/hooks/api/chatwoot/inbox";
import { useInitiateWhatsAppSignup } from "@/hooks/api/meta/whatsapp";
import { invalidateQueries } from "@/lib/query-client";
import { toast } from "sonner";
import { useTour } from "@/hooks/custom/use-tour";
import { getInitials } from "@/constants/get-initials";
import { getChannelIconAndColor } from "@/constants/components/all-chat-box-sidebar";

interface ChatBoxItem {
  _id: string;
  name: string;
  thumbnail: string;
  channel?: "whatsapp" | "email" | "sms" | "instagram" | "telegram";
  last_message: {
    message: string;
    createdAt: number;
  };
  contact_last_seen_at: number;
  unread_count: number;
}

interface Tab {
  id: string;
  label: string;
}

type ChatBoxSidebarProps = {
  title: string;
  searchParamKey: string;
  searchPlaceholder: string;
  items: TChatwootConversation[];
  selectedId: string;
  onSelectItem: (id: string) => void;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  tabs?: readonly Tab[];
  onAddClick?: () => void;
  onSyncWithChatwoot?: () => void;
  isLoading?: boolean;
};

export function ChatBoxSidebar({
  title,
  searchParamKey,
  searchPlaceholder,
  items: conversations,
  selectedId,
  onSelectItem,
  activeTab,
  onTabChange,
  tabs,
  onAddClick,
  isLoading = false,
  onSyncWithChatwoot,
}: ChatBoxSidebarProps) {
  // State for channels dialog
  const [showAllChannelsDialog, setShowAllChannelsDialog] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const { isTourOpen, completeTour, skipTour } = useTour({
    isAuthenticated: true,
    tourKey: "inbox",
  });
  // State for channel connection dialog
  const [showChannelConnectionDialog, setShowChannelConnectionDialog] =
    useState(false);
  const [clickedTool, setClickedTool] = useState<{
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color: string;
  } | null>(null);
  const [channelDialogStep, setChannelDialogStep] = useState("step-1");
  const [selectedChannelType, setSelectedChannelType] = useState<
    "web-widget" | "telegram" | "whatsapp" | null
  >(null);
  const [botToken, setBotToken] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [welcomeTitle, setWelcomeTitle] = useState("");
  const [isCreatingInbox, setIsCreatingInbox] = useState(false);

  const { data: agentsResponse, isLoading: isLoadingAgents } =
    useGetAllAgents();
  const allAgents = (agentsResponse?.data || []).map((agent) => ({
    _id: agent._id,
    name: agent.name,
    avatar: agent.avatar,
  }));

  // Get selected agent
  const selectedAgent =
    allAgents.find((agent) => agent._id === selectedAgentId) || null;

  // Fetch channels from API
  const { data: channelsResponse } = useGetAllChannels();
  const socialMediaChannels = channelsResponse?.data || [];

  // Handle add button click
  const handleAddClick = () => {
    setShowAllChannelsDialog(true);
    onAddClick?.();
  };

  // Handle tool/channel click in dialog
  const handleToolClick = (tool: {
    _id: string;
    name: string;
    icon?: React.ReactNode;
    color: string;
    isConnected?: boolean;
    description: string;
    bgGradient: string;
  }) => {
    // Determine channel type based on clicked channel name
    const channelName = tool.name?.toLowerCase();
    if (channelName === "telegram") {
      setSelectedChannelType("telegram");
    } else if (channelName === "whatsapp") {
      setSelectedChannelType("whatsapp");
    } else {
      setSelectedChannelType("web-widget");
    }

    setClickedTool({
      _id: tool._id,
      name: tool.name,
      icon: tool.icon,
      color: tool.color,
    });

    // Close channels dialog and open connection dialog
    setShowAllChannelsDialog(false);
    setChannelDialogStep("step-2");
    setBotToken("");
    setShowChannelConnectionDialog(true);
  };

  // Handle channel connection dialog close
  const handleChannelDialogClose = () => {
    setChannelDialogStep("step-1");
    setSelectedChannelType(null);
    setBotToken("");
    setWebsiteUrl("");
    setWelcomeTitle("");
    setIsCreatingInbox(false);
    setShowChannelConnectionDialog(false);
    setClickedTool(null);
  };

  // Mutations for creating inboxes
  const { mutate: createWebWidgetInbox } = useCreateWebWidgetInbox({
    onSuccess: () => {
      toast.success("Web widget inbox created successfully!");
      invalidateQueries({ queryKey: ["useGetAgentById", selectedAgentId] });
      setIsCreatingInbox(false);
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
      invalidateQueries({ queryKey: ["useGetAgentById", selectedAgentId] });
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
  const { mutate: initiateWhatsAppSignup, isPending: isInitiatingWhatsApp } =
    useInitiateWhatsAppSignup({
      onSuccess: (data) => {
        // Redirect to WhatsApp OAuth URL
        console.log("WhatsApp signup response:", data);
        const signupUrl = data.data?.signup_url;
        if (signupUrl) {
          console.log("Opening WhatsApp in new tab:", signupUrl);
          window.open(signupUrl, "_blank");
          // Keep loading state since connection is in progress in new tab
        } else {
          console.error("No signup_url found in response:", data);
          toast.error("Failed to get WhatsApp signup URL");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to initiate WhatsApp connection");
        setIsCreatingInbox(false);
      },
    });

  // Handle create inbox (placeholder - implement based on your needs)
  const handleCreateInbox = async () => {
    // Validate agent is selected first
    if (!selectedAgentId) {
      toast.error("Please select an agent first");
      return;
    }

    // Validate telegram bot token if needed
    if (selectedChannelType === "telegram" && !botToken) {
      toast.error("Please enter your Telegram bot token");
      return;
    }

    // Now proceed with creation
    setIsCreatingInbox(true);
    setChannelDialogStep("step-3");

    try {
      if (selectedChannelType === "web-widget") {
        createWebWidgetInbox({
          agent_id: selectedAgentId,
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
          agent_id: selectedAgentId,
          channel: {
            bot_token: botToken,
          },
        });
      } else if (selectedChannelType === "whatsapp") {
        initiateWhatsAppSignup({
          agent_id: selectedAgentId,
        });
      }
    } catch (error) {
      console.error("Failed to create inbox:", error);
      setIsCreatingInbox(false);
    }
  };

  // Transform conversations to ChatBoxItem format
  const items = useMemo<ChatBoxItem[]>(() => {
    if (!conversations || conversations.length === 0) return [];

    return conversations.map((conversation) => {
      // Determine channel from meta
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

      // Get last message from messages array
      const lastMessage =
        conversation.messages && conversation.messages.length > 0
          ? conversation.messages[conversation.messages.length - 1]
          : null;

      return {
        _id: conversation.id.toString(),
        name: conversation.meta.sender.name || "Unknown",
        thumbnail: conversation.meta.sender.thumbnail || "",
        channel,
        last_message: {
          message: lastMessage?.content || "No messages yet",
          createdAt: lastMessage?.created_at || conversation.created_at,
        },
        contact_last_seen_at: conversation.contact_last_seen_at,
        unread_count: conversation.unread_count || 0,
      };
    });
  }, [conversations]);

  return (
    <section className="chat-boxes-sidebar min-w-96 max-w-1/4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden h-[calc(100vh-2rem)]">
      {/* Header Section */}
      <div className="flex flex-col gap-5 p-6 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="refresh-conversations-button size-11 hover:bg-gray-200  text-gray-400 hover:text-gray-600 rounded-full transition-all ease-in duration-200 cursor-pointer active:scale-75 "
              onClick={onSyncWithChatwoot}
            >
              <HugeiconsIcon icon={Refresh01FreeIcons} className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              // rounded="full"
              className="add-new-channel-button size-11 bg-[#1A89FF] hover:bg-[#0D5FCC] text-white rounded-full transition-colors duration-200 cursor-pointer"
              onClick={handleAddClick}
            >
              <HugeiconsIcon icon={Add01Icon} className="size-5" />
            </Button>
          </div>
        </div>
        <div className="inbox-search-bar-wrapper">
          <SearchBar
            searchParamKey={searchParamKey}
            className="h-12 rounded-full border-gray-200/50 dark:border-gray-700/50"
            placeholder={searchPlaceholder}
          />
        </div>
      </div>

      <Separator className="shrink-0" />

      {/* Chat List */}
      <ScrollArea
        className={cn(
          "flex-1 min-h-0 py-3",
          tabs &&
            tabs.length > 0 &&
            "border-t border-gray-200/50 dark:border-gray-700/50",
        )}
      >
        {isLoading ? (
          <div className="flex flex-col gap-2 px-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50"
              >
                <Skeleton className="size-[52px] rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6 py-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
              <div className="relative bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border border-primary/20">
                <HugeiconsIcon
                  icon={MessageMultiple01FreeIcons}
                  className="size-10 text-primary"
                />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              No Conversations Yet
            </h3>
            {/* <div className="max-w-md space-y-2">
              <p className="text-base text-muted-foreground leading-relaxed">
                Here you will see your business conversations from all your
                connected channels.
              </p>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Once customers start messaging your Agent through WhatsApp,
                Instagram, or Telegram, their conversations will appear here for
                you to manage and respond to.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon icon={InformationCircleIcon} className="size-4" />
              <span>Connect channels to start receiving messages</span>
            </div> */}
          </div>
        ) : (
          <div className="conversation-list flex flex-col gap-2 px-3 ">
            {items.map((item) => (
              <li
                key={item._id}
                className={cn(
                  "conversation-item group relative flex items-center gap-3 p-3.5 justify-between rounded-2xl cursor-pointer transition-colors duration-200",
                  item._id === selectedId
                    ? "bg-[#1A89FF] text-white"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 border border-gray-200/50 dark:border-gray-700/50",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectItem(item._id);
                }}
              >
                <div className="flex gap-3 flex-1 min-w-0">
                  {/* thumbnail */}
                  <div className="relative shrink-0">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail || ""}
                        alt={item.name}
                        width={52}
                        height={52}
                        className="size-[52px] rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={cn(
                          "size-[52px] rounded-full flex items-center justify-center text-base font-semibold",
                          getAvatarColors(item.name).bg,
                          getAvatarColors(item.name).text,
                        )}
                      >
                        {getInitials(item.name).slice(0, 2)}
                      </div>
                    )}
                    {/* Channel Icon Badge */}
                    {item.channel && (
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 size-5 rounded-full border-2 flex items-center justify-center",
                          item._id === selectedId
                            ? "border-[#1A89FF]"
                            : "border-white dark:border-gray-900",
                          item.channel === "whatsapp" && "bg-[#25D366]",
                          item.channel === "instagram" &&
                            "bg-linear-to-br from-[#833AB4] to-[#F77737]",
                          item.channel === "email" && "bg-gray-100",
                          item.channel === "sms" && "bg-gray-700",
                          item.channel === "telegram" && "bg-[#0088CC]",
                        )}
                      >
                        {item.channel === "whatsapp" && (
                          <IoLogoWhatsapp className="size-3 text-white" />
                        )}
                        {item.channel === "instagram" && (
                          <FaInstagramSquare className="size-3 bg-linear-to-br from-[#833AB4] to-[#F77737] text-white rounded-xl" />
                        )}
                        {item.channel === "email" && (
                          <Image
                            src={GmailIcon}
                            alt="Gmail"
                            width={10}
                            height={10}
                            className="size-2.5 object-contain "
                          />
                        )}
                        {item.channel === "sms" && (
                          <MdSms className="size-3 text-white" />
                        )}
                        {item.channel === "telegram" && (
                          <svg
                            className="size-3 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.87 8.81c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center min-w-0 flex-1 gap-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-sm font-bold truncate",
                          item._id === selectedId
                            ? "text-white"
                            : "text-foreground",
                        )}
                      >
                        {item.name}
                      </p>
                      {/* Green dot indicator for unread messages */}
                      {item.unread_count > 0 && (
                        <span className="size-2 rounded-full bg-green-500 shrink-0" />
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-xs line-clamp-1 leading-relaxed",
                        item._id === selectedId
                          ? "text-white/90"
                          : "text-muted-foreground",
                      )}
                    >
                      {item?.last_message?.message}
                    </p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p
                    className={cn(
                      "text-[10px] font-semibold",
                      item._id === selectedId
                        ? "text-white/90"
                        : "text-muted-foreground",
                    )}
                  >
                    {format(new Date(item.contact_last_seen_at), "HH:mm")}
                  </p>
                </div>
              </li>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* All Channels Dialog */}
      <AllChannelsDialog
        open={showAllChannelsDialog}
        agents={allAgents}
        source="inbox"
        onOpenChange={setShowAllChannelsDialog}
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
              isConnected: false, // You can add logic to check if channel is connected
            };
          })}
        onToolClick={handleToolClick}
      />

      <ChannelConnectionDialog
        source="inbox"
        agents={allAgents}
        open={showChannelConnectionDialog}
        onOpenChange={setShowChannelConnectionDialog}
        clickedTool={clickedTool}
        channelDialogStep={channelDialogStep}
        setChannelDialogStep={setChannelDialogStep}
        selectedChannelType={selectedChannelType}
        botToken={botToken}
        setBotToken={setBotToken}
        isCreatingInbox={isCreatingInbox}
        agent={selectedAgent}
        agentEmail={
          selectedAgent
            ? `${selectedAgent.name?.toLowerCase().replace(/\s+/g, "")}@linkaiil.ai`
            : ""
        }
        onCreateInbox={handleCreateInbox}
        onClose={handleChannelDialogClose}
        showAgentSelector={true}
        selectedAgentId={selectedAgentId}
        onAgentSelect={setSelectedAgentId}
        isLoadingAgents={isLoadingAgents}
        websiteUrl={websiteUrl}
        setWebsiteUrl={setWebsiteUrl}
        welcomeTitle={welcomeTitle}
        setWelcomeTitle={setWelcomeTitle}
      />
      {/* <ProductTour
        isOpen={isTourOpen}
        onComplete={completeTour}
        onSkip={skipTour}
        steps={tourConfigs.inbox.steps}
      /> */}
    </section>
  );
}
