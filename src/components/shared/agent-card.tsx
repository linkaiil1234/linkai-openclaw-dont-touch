"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  GraduationCap,
  Trash2,
  BrainCircuit,
  Loader2,
  XCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TAgent, TAgentWithPartialConfig } from "@/types/models/agent";
import { type TDeleteAgentPayload } from "@/hooks/api/agent";
import type { TChannel } from "@/types/models/channel";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTelegram } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { MdSms } from "react-icons/md";
import { SiGmail } from "react-icons/si";
import {
  InstagramIconGradient,
  INSTAGRAM_ICON_GRADIENT_STYLES,
} from "@/constants/channel-icons";
import Image from "next/image";
import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading02Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { GuestLoginDialog } from "../dialog/guest-login-dialog";
interface AgentCardProps {
  setup_step: number;
  agent: TAgent | TAgentWithPartialConfig;
  index: number;
  stats: {
    conversations: number;
    total: number;
    renewDays: number;
    cost: number;
    progressColor: string;
    extraUsage: boolean;
  };
  onDelete: (payload: TDeleteAgentPayload) => void;
  onStatusChange: (agentId: string, currentStatus: string) => void;
  variants?: unknown;
}

export const AgentCard = ({
  setup_step,
  agent,
  stats,
  onDelete,
  onStatusChange,
  variants,
}: AgentCardProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { session } = useAuth();
  const [signInModalOpen, setSignInModalOpen] = useState<boolean>(false);
  // Status configuration based on setup_step
  const getStatusConfig = (setup_step: number) => {
    // Step 5 = Active (green)
    if (setup_step === 5) {
      return {
        color: "green",
        bgClass: "bg-green-50 dark:bg-green-500/10",
        dotClass: "bg-green-500",
        textClass: "text-green-700 dark:text-green-500",
        label: "Active",
      };
    }

    // Steps 1-4 = Onboarding (yellow)
    if (setup_step >= 1 && setup_step < 5) {
      return {
        color: "yellow",
        bgClass: "bg-yellow-50 dark:bg-yellow-500/10",
        dotClass: "bg-yellow-500",
        textClass: "text-yellow-700 dark:text-yellow-500",
        label: "Onboarding",
      };
    }

    // Step 0 = Not Started (gray)
    return {
      color: "gray",
      bgClass: "bg-gray-50 dark:bg-gray-500/10",
      dotClass: "bg-gray-500",
      textClass: "text-gray-700 dark:text-gray-500",
      label: "Not Started",
    };
  };

  const statusConfig = getStatusConfig(setup_step);

  // Check if agent is fully set up (only setup_step === 5 is active)
  const isFullySetup = setup_step === 5;

  const getChannelIconAndColor = (channel: Pick<TChannel, "_id" | "name">) => {
    const channelName = channel.name?.toLowerCase();

    if (channelName === "whatsapp") {
      return {
        icon: <IoLogoWhatsapp size={16} style={{ color: "#25D366" }} />,
        color: "#25D366",
        name: "WhatsApp",
      };
    }
    if (channelName === "telegram") {
      return {
        icon: <FaTelegram size={16} style={{ color: "#26A5E4" }} />,
        color: "#26A5E4",
        name: "Telegram",
      };
    }
    if (channelName === "facebook") {
      return {
        icon: <FaFacebookSquare size={16} style={{ color: "#1877F2" }} />,
        color: "#1877F2",
        name: "Facebook",
      };
    }
    if (channelName === "instagram") {
      return {
        icon: <InstagramIconGradient size={16} />,
        color: "#ffffff",
        name: "Instagram",
      };
    }
    if (channelName === "email") {
      return {
        icon: <Image src={GmailIcon} alt="Gmail" width={16} height={16} />,
        color: "#EA4335",
        name: "Email",
      };
    }
    if (channelName === "sms") {
      return {
        icon: <MdSms size={16} style={{ color: "#8B5CF6" }} />,
        color: "#8B5CF6",
        name: "SMS",
      };
    }
    // Default fallback
    return {
      icon: <BrainCircuit size={16} className="text-gray-400 " />,
      color: "#gray",
      name: channel.name || "Unknown",
    };
  };

  // Get connected channels from agent config
  // Channels can be either IDs (TAgent) or objects with _id and name (TAgentWithPartialConfig)
  const connectedChannels = agent.config?.channels || [];

  // Helper to check if a channel has name property (is populated)
  const isChannelPopulated = (
    channel: string | Pick<TChannel, "_id" | "name">,
  ): channel is Pick<TChannel, "_id" | "name"> => {
    return typeof channel === "object" && "name" in channel;
  };

  // Get connected channel names (normalized to lowercase)
  const connectedChannelNames = new Set(
    connectedChannels
      .filter(isChannelPopulated)
      .map((ch) => ch.name?.toLowerCase())
      .filter(Boolean),
  );

  const handleStatusChange = async () => {
    setIsUpdatingStatus(true);
    try {
      await Promise.resolve(onStatusChange(agent._id, agent.status));
      // Wait a bit for the query to refetch
      setTimeout(() => {
        setIsUpdatingStatus(false);
      }, 1000);
    } catch (error) {
      setIsUpdatingStatus(false);
    }
  };

  // All available channels
  const allChannels = [
    { name: "whatsapp", displayName: "WhatsApp" },
    { name: "telegram", displayName: "Telegram" },
    { name: "instagram", displayName: "Instagram" },
    { name: "email", displayName: "Email" },
    { name: "sms", displayName: "SMS" },
    { name: "facebook", displayName: "Facebook" },
  ];

  // Check if a channel is connected
  const isChannelConnected = (channelName: string) => {
    return connectedChannelNames.has(channelName.toLowerCase());
  };

  // Get channel styling based on connection status
  const getChannelStyle = (channelName: string, isConnected: boolean) => {
    if (!isConnected) {
      return {
        containerClass:
          "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50",
        iconClass: "text-gray-400 dark:text-gray-500",
      };
    }

    const channelLower = channelName.toLowerCase();
    switch (channelLower) {
      case "whatsapp":
        return {
          containerClass:
            "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-sm",
          iconClass: "text-green-600 dark:text-green-400",
        };
      case "telegram":
        return {
          containerClass:
            "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-800/20 border-blue-200 dark:border-blue-700 shadow-sm",
          iconClass: "text-blue-600 dark:text-blue-400",
        };
      case "instagram":
        return {
          containerClass:
            "bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-orange-900/30 border-pink-200 dark:border-pink-700 shadow-sm",
          iconClass:
            "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500",
        };
      case "email":
        return {
          containerClass:
            "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-800/20 border-red-200 dark:border-red-700 shadow-sm",
          iconClass: "text-red-600 dark:text-red-400",
        };
      case "sms":
        return {
          containerClass:
            "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-800/20 border-purple-200 dark:border-purple-700 shadow-sm",
          iconClass: "text-purple-600 dark:text-purple-400",
        };
      case "facebook":
        return {
          containerClass:
            "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-sm",
          iconClass: "text-blue-600 dark:text-blue-400",
        };
      default:
        return {
          containerClass:
            "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
          iconClass: "text-gray-400 dark:text-gray-500",
        };
    }
  };

  const handleAgentClick = () => {
    if (session.user?.auth_type === "anonymous") {
      setSignInModalOpen(true);
      return;
    }
    if (isDeleting) return;
    router.push(`/agents/train/${agent._id}`);
  };

  return (
    <>
      <motion.div variants={variants as Variants}>
        <CardContainer className="w-full h-full rounded-3xl">
          <CardBody className="w-full h-auto">
            <CardItem translateZ="50" className="w-full h-full rounded-3xl">
              <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleAgentClick}
                className={cn(
                  "group relative w-full rounded-3xl border border-gray-200/60 shadow-sm transition-all duration-500 ease-in-out overflow-hidden flex-1 gap-0 py-0",
                  !isDeleting
                    ? "cursor-pointer hover:shadow-xl"
                    : "cursor-default opacity-75",
                  isDeleting && "opacity-60",
                )}
              >
                {/* Top Section - Gradient with Chat Interface */}
                <div className="relative h-[260px] bg-linear-to-tr from-blue-500 via-blue-300 to-indigo-400 rounded-t-3xl overflow-hidden ">
                  {/* Chat Interface Mockup with Scrolling Animation */}
                  <div className="absolute inset-0 flex items-end justify-end px-20">
                    <CardItem translateZ="80" className="w-full">
                      <div className="relative w-full bg-white rounded-t-2xl shadow-xl p-4 transform transition-all duration-500 group-hover:scale-[1.02]">
                        {/* Agent Name in Chat */}
                        <div className="mb-6 relative z-40">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {agent.name}
                          </h3>
                        </div>

                        {/* Scrolling Chat Messages */}
                        <motion.div
                          className="space-y-3 overflow-hidden min-h-[80px] relative z-10"
                          animate={
                            isHovered
                              ? {
                                  y: [0, -30, 0],
                                }
                              : { y: 0 }
                          }
                          transition={{
                            duration: 3,
                            repeat: isHovered ? Infinity : 0,
                            ease: "easeInOut",
                          }}
                        >
                          {/* Message bubbles */}
                          <div className="flex gap-2">
                            <div className="w-32 h-6 bg-gray-200 rounded-full" />
                          </div>
                          <div className="flex justify-end">
                            <div className="w-40 h-6 bg-blue-500 rounded-full" />
                          </div>
                          <div className="flex gap-2">
                            <div className="w-28 h-6 bg-gray-200 rounded-full" />
                          </div>
                          <div className="flex justify-end">
                            <div className="w-36 h-6 bg-blue-500 rounded-full" />
                          </div>
                        </motion.div>
                      </div>
                    </CardItem>
                  </div>
                </div>

                {/* Bottom Section - White Background with Details */}
                <CardItem translateZ="60" className="w-full ">
                  <div className="relative w-full  p-6 rounded-b-3xl">
                    <div className=" w-full flex items-start justify-between gap-4">
                      {/* Left Side - Agent Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-2 mb-2">
                          <div className="flex items-center justify-start gap-4">
                            <h3 className="text-xl font-bold text-gray-900 truncate">
                              {agent.name}
                            </h3>
                            {agent.status === "active" &&
                              agent.setup_step === 5 && (
                                <div
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${statusConfig.bgClass}`}
                                >
                                  <span
                                    className={`size-1.5 rounded-xl ${
                                      statusConfig.dotClass
                                    } ${setup_step === 1 ? "animate-pulse" : ""}`}
                                  />
                                  <span
                                    className={`text-xs font-medium ${statusConfig.textClass}`}
                                  >
                                    {setup_step >= 1 && setup_step < 5
                                      ? `Step ${setup_step}/5`
                                      : statusConfig.label}
                                  </span>
                                </div>
                              )}
                            {agent.status === "inactive" &&
                              agent.setup_step === 5 && (
                                <div
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-50`}
                                >
                                  <span
                                    className={`size-1.5 rounded-xl bg-red-600`}
                                  />
                                  <span
                                    className={`text-xs font-medium text-red-600`}
                                  >
                                    Inactive
                                  </span>
                                </div>
                              )}

                            {agent.status === "archived" &&
                              agent.setup_step === 5 && (
                                <div
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-50`}
                                >
                                  <span
                                    className={`size-1.5 rounded-xl bg-gray-600`}
                                  />
                                  <span
                                    className={`text-xs font-medium text-gray-600`}
                                  >
                                    Archived
                                  </span>
                                </div>
                              )}
                            {setup_step >= 1 && setup_step < 5 && (
                              <>
                                <HugeiconsIcon
                                  icon={Loading02Icon}
                                  className="size-6 p-1 text-yellow-600 dark:text-yellow-400 rounded-sm bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/50 transition-all duration-200 ease-in-out animate-spin"
                                />
                                <span
                                  className={`text-xs font-medium ${statusConfig.textClass}`}
                                >
                                  {setup_step >= 1 && setup_step < 5
                                    ? `Step ${setup_step}/5`
                                    : statusConfig.label}
                                </span>
                              </>
                            )}
                            {setup_step === 0 && (
                              <HugeiconsIcon
                                icon={Loading02Icon}
                                className="size-6 p-1 text-gray-600 dark:text-gray-400 rounded-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-950/30 dark:hover:bg-gray-950/50 transition-all duration-200 ease-in-out animate-spin"
                              />
                            )}
                          </div>

                          {/* Progress Bar for Onboarding */}
                          {setup_step >= 1 && setup_step < 5 && (
                            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-linear-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out"
                                style={{ width: `${(setup_step / 5) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <TooltipProvider>
                          <div className="flex items-center gap-2 mt-1">
                            {allChannels.map((channel) => {
                              const isConnected = isChannelConnected(
                                channel.name,
                              );
                              const channelStyle = getChannelStyle(
                                channel.name,
                                isConnected,
                              );
                              const channelIcon = getChannelIconAndColor({
                                _id: channel.name,
                                name: channel.name,
                              });

                              // Get icon with proper styling
                              const getIconElement = () => {
                                if (isConnected) {
                                  return channelIcon.icon;
                                }
                                // For non-connected channels, wrap icon in a div with gray styling
                                const channelName = channel.name.toLowerCase();
                                if (channelName === "whatsapp") {
                                  return (
                                    <IoLogoWhatsapp
                                      size={16}
                                      className="text-gray-400 dark:text-gray-500"
                                    />
                                  );
                                }
                                if (channelName === "telegram") {
                                  return (
                                    <FaTelegram
                                      size={16}
                                      className="text-gray-400 dark:text-gray-500"
                                    />
                                  );
                                }
                                if (channelName === "facebook") {
                                  return (
                                    <FaFacebookSquare
                                      size={16}
                                      className="text-gray-400 dark:text-gray-500"
                                    />
                                  );
                                }
                                if (channelName === "instagram") {
                                  return (
                                    <span
                                      className="inline-block size-4 bg-gray-400 dark:bg-gray-500"
                                      style={INSTAGRAM_ICON_GRADIENT_STYLES}
                                    />
                                  );
                                }
                                if (channelName === "email") {
                                  return (
                                    <SiGmail
                                      size={16}
                                      className="text-gray-400 dark:text-gray-500"
                                    />
                                  );
                                }
                                if (channelName === "sms") {
                                  return (
                                    <MdSms
                                      size={16}
                                      className="text-gray-400 dark:text-gray-500"
                                    />
                                  );
                                }
                                return (
                                  <BrainCircuit
                                    size={16}
                                    className="text-gray-400 dark:text-gray-500"
                                  />
                                );
                              };

                              return (
                                <Tooltip key={channel.name}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "flex items-center justify-center size-7 rounded-lg transition-all cursor-pointer border shadow-sm hover:shadow",
                                        channelStyle.containerClass,
                                      )}
                                    >
                                      {getIconElement()}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="bottom"
                                    className="text-xs"
                                  >
                                    <p>
                                      {channel.displayName}{" "}
                                      {isConnected
                                        ? "✓ Connected"
                                        : "✗ Not Connected"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </TooltipProvider>
                      </div>

                      {/* Right Side - Three-dot Menu */}
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all duration-200 rounded-xl shadow-sm shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 z-50"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <DropdownMenuItem
                            onSelect={handleStatusChange}
                            disabled={
                              isUpdatingStatus || agent.setup_step !== 5
                            }
                            className={cn(
                              "cursor-pointer transition-all text-sm py-2.5",
                              agent.status === "active"
                                ? "text-green-600 hover:text-green-600 focus:text-green-600 hover:bg-green-50 focus:bg-green-50"
                                : "text-red-600 hover:text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50",
                              isUpdatingStatus &&
                                "opacity-50 cursor-not-allowed",
                            )}
                          >
                            {isUpdatingStatus ? (
                              <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                            ) : (
                              <>
                                {agent.status === "active" ? (
                                  <CheckCircleIcon className="h-4 w-4 mr-3 text-green-600" />
                                ) : (
                                  <XCircleIcon className="h-4 w-4 mr-3 text-red-600" />
                                )}
                              </>
                            )}

                            {agent.status}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              router.push(`/agents/train/${agent._id}`);
                            }}
                            className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 transition-all text-sm py-2.5"
                          >
                            <GraduationCap className="h-4 w-4 mr-3" />
                            Train
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={isDeleting}
                            onSelect={async (e) => {
                              e.preventDefault();
                              if (isDeleting) return;

                              setIsDeleting(true);
                              try {
                                await Promise.resolve(
                                  onDelete({ _id: agent._id }),
                                );
                              } finally {
                                // Keep loading state - parent component will handle removal
                                // setIsDeleting(false);
                              }
                            }}
                            className={cn(
                              "cursor-pointer hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 transition-all text-sm py-2.5",
                              isDeleting && "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardItem>

                {/* Loading Overlay - Delete */}
                {isDeleting && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Deleting agent...
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading Overlay - Status Update */}
                {isUpdatingStatus && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Updating status...
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.div>

      <GuestLoginDialog
        open={signInModalOpen}
        onOpenChange={setSignInModalOpen}
      />
    </>
  );
};
