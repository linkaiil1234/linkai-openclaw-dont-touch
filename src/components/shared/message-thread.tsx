"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { MessageSquare, Loader2, Bot, X, Download, Play } from "lucide-react";
import { cn, getAvatarColors } from "@/lib/utils";
import { Streamdown } from "streamdown";
import type { TMessage } from "@/types/models/chatwoot/message";
import Image from "next/image";
import WhatsAppBg from "@/assets/images/whatsapp_chat_background.png";
import TelegramBg from "@/assets/images/telegram-background.png";
import LinkAILogo from "@/assets/images/linkai_favicon.jpeg";
import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdSms } from "react-icons/md";
import { FaInstagramSquare } from "react-icons/fa";
import {
  Search01FreeIcons,
  InformationCircleFreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChatInput,
  type ConversationFormValues,
} from "@/components/shared/chat-input";
import ReactAudioPlayer from "react-audio-player";
import { getInitials } from "@/constants/get-initials";
import {
  getBackgroundStyle,
  getBubbleRadius,
  getChannelIconStyle,
  getHeaderStyle,
  getIncomingMessageStyle,
  getOutgoingMessageStyle,
} from "@/constants/components/message-thread";

type MessageThreadProps = {
  conversationId: string | null;
  isAgentTraining?: boolean;
  messages: TMessage[] | undefined;
  isLoadingMessages: boolean;
  selectedChannel:
    | "whatsapp"
    | "email"
    | "sms"
    | "instagram"
    | "telegram"
    | null;
  contactInfo?: {
    name: string;
    email?: string | null;
    thumbnail?: string;
  };
  onMenuClick?: () => void;
  onSubmit?: (values: ConversationFormValues) => void;
  isAgentActive?: boolean;
  onToggleAgent?: (isActive: boolean) => void;
  onOpenAssetDialog?: () => void;
};

export function MessageThread({
  conversationId,
  isAgentTraining = false,
  messages,
  isLoadingMessages,
  selectedChannel,
  contactInfo,
  onMenuClick,
  onSubmit,
  isAgentActive = false,
  onToggleAgent,
  onOpenAssetDialog,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channel = selectedChannel;
  const [fullScreenMedia, setFullScreenMedia] = useState<{
    url: string;
    type: "image" | "video";
  } | null>(null);

  console.log("channel ===>>", channel);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isLoadingMessages && messages && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [messages, isLoadingMessages]);

  // Get channel icon
  const getChannelIcon = () => {
    switch (channel) {
      case "whatsapp":
        return <IoLogoWhatsapp className="w-2 h-2" />;
      case "email":
        return (
          <Image
            src={GmailIcon}
            alt="Gmail"
            width={8}
            height={8}
            className="w-2 h-2"
          />
        );
      case "sms":
        return <MdSms className="w-2 h-2" />;
      case "instagram":
        return <FaInstagramSquare className="w-2 h-2" />;
      case "telegram":
        return (
          <svg
            className="w-2 h-2"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.87 8.81c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
        );
      default:
        return (
          <Image
            src={GmailIcon}
            alt="Gmail"
            width={8}
            height={8}
            className="w-2 h-2"
          />
        );
    }
  };

  return (
    <section
      className={cn(
        "message-list-section flex-1 rounded-xl shadow-xl flex flex-col h-[calc(100vh-2rem)] relative overflow-hidden",
        getBackgroundStyle(channel),
      )}
    >
      {/* WhatsApp Background Image */}
      {channel === "whatsapp" && (
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={WhatsAppBg}
            alt="WhatsApp Background"
            fill
            className="object-cover opacity-30 dark:opacity-20"
            priority
          />
        </div>
      )}

      {/* Telegram Background Image */}
      {channel === "telegram" && (
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={TelegramBg}
            alt="Telegram Background"
            fill
            className="object-cover opacity-40 dark:opacity-30"
            priority
          />
        </div>
      )}

      {!conversationId ? (
        <div className="flex flex-col items-center justify-center h-full relative z-10 px-4">
          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto text-center space-y-6">
            {/* Icon */}
            <div className="p-5 bg-muted/30 rounded-2xl border border-border/50">
              <MessageSquare className="w-12 h-12 text-muted-foreground/60" />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                No Conversation Selected
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Choose a conversation from the sidebar to view and manage
                messages
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid gap-3 w-full max-w-md mt-6">
              {/* Card 1 */}
              <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                <div className="p-1.5 bg-muted rounded-md mt-0.5">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-medium text-foreground mb-0.5">
                    Unified Inbox
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All conversations from WhatsApp, Instagram, Telegram, SMS,
                    and Email in one place
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                <div className="p-1.5 bg-muted rounded-md mt-0.5">
                  <Bot className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-medium text-foreground mb-0.5">
                    AI-Powered Responses
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your AI agent automatically responds to customer inquiries
                    across all channels
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Messages Header */}
          {contactInfo &&
            (isLoadingMessages || (messages && messages.length > 0)) && (
              <div
                className={cn(
                  "sticky top-0 z-20 shadow-sm px-6 py-4 rounded-t-xl transition-all duration-300",
                  getHeaderStyle(channel),
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Contact Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={cn(
                        "relative size-11 rounded-full overflow-visible shrink-0 shadow-md transition-all duration-300 hover:scale-105",
                        channel === "email"
                          ? "ring-2 ring-gray-300/30 hover:ring-gray-300/50"
                          : "ring-2 ring-blue-500/20 hover:ring-blue-500/40",
                      )}
                    >
                      <div className="relative size-11 rounded-full overflow-hidden">
                        {contactInfo.thumbnail ? (
                          <Image
                            src={contactInfo.thumbnail || ""}
                            alt={contactInfo.name}
                            width={44}
                            height={44}
                            className="size-11 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={cn(
                              "size-11 rounded-full flex items-center justify-center text-base font-semibold",
                              getAvatarColors(contactInfo.name).bg,
                              getAvatarColors(contactInfo.name).text,
                            )}
                          >
                            {getInitials(contactInfo.name).slice(0, 2)}
                          </div>
                        )}
                      </div>
                      {/* Channel Icon Badge */}
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full border-2 shadow-sm p-[3px]",
                          getChannelIconStyle(channel),
                        )}
                      >
                        {getChannelIcon()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          "text-base font-semibold truncate transition-colors duration-200",
                          channel === "whatsapp" || channel === "telegram"
                            ? "text-white"
                            : "text-gray-900 dark:text-white",
                        )}
                      >
                        {contactInfo.name}
                      </h3>
                      {contactInfo.email && (
                        <p
                          className={cn(
                            "text-xs truncate flex items-center gap-1.5",
                            channel === "whatsapp" || channel === "telegram"
                              ? "text-gray-200"
                              : "text-gray-500",
                          )}
                        >
                          <span className="size-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
                          {contactInfo.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Agent Toggle */}
                  {onToggleAgent && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                      <Bot
                        className={cn(
                          "size-4 transition-colors",
                          isAgentActive ? "text-green-400" : "text-gray-400",
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium",
                          channel === "whatsapp" || channel === "telegram"
                            ? "text-white"
                            : "text-gray-700 dark:text-gray-300",
                        )}
                      >
                        Agent
                      </span>
                      <Switch
                        checked={isAgentActive}
                        onCheckedChange={onToggleAgent}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  )}

                  {/* Right: Action Icons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "size-9 rounded-full transition-all duration-200 hover:scale-105 active:scale-95",
                        channel === "whatsapp" || channel === "telegram"
                          ? "hover:bg-white/10 text-white"
                          : "hover:bg-gray-100/80 hover:shadow-sm text-gray-600",
                      )}
                      aria-label="More options"
                      onClick={onMenuClick}
                    >
                      <HugeiconsIcon
                        icon={InformationCircleFreeIcons}
                        className="size-4"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            )}

          {/* Messages List */}
          <div className="flex-1 overflow-hidden relative z-10">
            {isLoadingMessages && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4 animate-in fade-in-0 duration-300">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Loading messages...
                  </p>
                </div>
              </div>
            )}

            <ScrollArea className="h-full flex flex-col gap-4 mx-auto w-full px-4">
              <div className="flex flex-col gap-2 py-4">
                {/* Default Banner - Show when no messages */}
                {isLoadingMessages && (
                  <div className="flex flex-col items-center justify-center h-[400px] gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg ring-4 ring-primary/10">
                      <Image
                        src={LinkAILogo}
                        alt="LinkAI Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center max-w-md">
                      <h3 className="text-2xl font-semibold text-foreground">
                        Welcome to LinkAI
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Start a conversation and experience intelligent
                        automation. Your messages will appear here.
                      </p>
                    </div>
                  </div>
                )}

                {messages?.map((message) => {
                  const isIncoming = message.message_type === 0;
                  const isOutgoing = message.message_type === 1;

                  // Check if message has media attachments
                  const hasMediaAttachments =
                    message.attachments &&
                    message.attachments.some(
                      (att) =>
                        att.file_type === "image" ||
                        att.file_type === "video" ||
                        att.file_type === "audio",
                    );

                  return (
                    <div
                      key={message.id}
                      className="flex flex-col gap-2 w-full mx-auto"
                    >
                      <div
                        className={cn(
                          "flex flex-col gap-1 px-10 ",
                          isIncoming ? "items-start" : "items-end",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-2/5 flex flex-col transition-all duration-200 overflow-hidden ",
                            // Conditional padding and background for media
                            hasMediaAttachments && !message.content
                              ? "bg-transparent p-0"
                              : hasMediaAttachments && message.content
                                ? "p-0"
                                : "px-4 py-3",
                            // Hover effects
                            channel === "email" && isIncoming
                              ? "hover:shadow-md"
                              : channel === "email"
                                ? "hover:shadow-sm"
                                : "hover:scale-none",
                            getBubbleRadius(channel, isIncoming),
                            // Background color
                            isIncoming && getOutgoingMessageStyle(channel),
                            isOutgoing && getIncomingMessageStyle(channel),
                          )}
                        >
                          {/* Attachments (Image, Video, Audio) */}
                          {message.attachments &&
                            message.attachments.length > 0 && (
                              <div className="flex flex-col">
                                {message.attachments.map((attachment) => {
                                  // Image attachments
                                  if (attachment.file_type === "image") {
                                    return (
                                      <div
                                        key={attachment.id}
                                        className={cn(
                                          "relative overflow-hidden cursor-pointer group",
                                          message.content
                                            ? ""
                                            : channel === "whatsapp" ||
                                                channel === "telegram"
                                              ? "rounded-lg"
                                              : channel === "instagram"
                                                ? "rounded-xl"
                                                : "rounded-md",
                                        )}
                                        onClick={() => {
                                          setFullScreenMedia({
                                            url: attachment.data_url,
                                            type: "image",
                                          });
                                        }}
                                      >
                                        <img
                                          src={attachment.data_url}
                                          alt="attachment"
                                          className=" h-full min-w-[300px] w-auto object-contain group-hover:opacity-95 transition-opacity"
                                          loading="lazy"
                                        />
                                      </div>
                                    );
                                  }

                                  // Video attachments
                                  if (attachment.file_type === "video") {
                                    return (
                                      <div
                                        key={attachment.id}
                                        className={cn(
                                          "relative overflow-hidden cursor-pointer group ",
                                          message.content
                                            ? ""
                                            : channel === "whatsapp" ||
                                                channel === "telegram"
                                              ? "rounded-sm"
                                              : channel === "instagram"
                                                ? "rounded-xl"
                                                : "rounded-md",
                                        )}
                                        onClick={() => {
                                          setFullScreenMedia({
                                            url: attachment.data_url,
                                            type: "video",
                                          });
                                        }}
                                      >
                                        <video
                                          src={attachment.data_url}
                                          className="h-full min-w-[300px] max-h-[400px] w-auto object-contain"
                                          preload="metadata"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                          <div className="bg-white/90 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-gray-900 fill-gray-900" />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }

                                  // Audio attachments
                                  if (attachment.file_type === "audio") {
                                    return (
                                      <div
                                        key={attachment.id}
                                        className={cn(
                                          "audio-player-wrapper rounded-lg overflow-hidden p-2 w-72",
                                          channel === "whatsapp"
                                            ? isIncoming
                                              ? "bg-white dark:bg-[#1F2C33]"
                                              : "bg-[#D9FDD3] dark:bg-[#005C4B]"
                                            : channel === "telegram"
                                              ? isIncoming
                                                ? "bg-white dark:bg-[#2B2B2B]"
                                                : "bg-[#E7F3FF] dark:bg-[#3390EC]"
                                              : channel === "instagram"
                                                ? "bg-gray-100 dark:bg-gray-900"
                                                : channel === "sms"
                                                  ? isIncoming
                                                    ? "bg-gray-100 dark:bg-gray-800"
                                                    : "bg-[#007AFF] dark:bg-[#0A84FF]"
                                                  : isIncoming
                                                    ? "bg-[#F1F3F4] dark:bg-[#2D2E30]"
                                                    : "bg-[#E8F0FE] dark:bg-[#1A73E8]",
                                        )}
                                      >
                                        <ReactAudioPlayer
                                          src={attachment.data_url}
                                          controls
                                          className="w-full max-w-[280px]"
                                          style={{
                                            width: "100%",
                                            maxWidth: "280px",
                                          }}
                                        />
                                      </div>
                                    );
                                  }

                                  return null;
                                })}
                              </div>
                            )}

                          {/* Message text */}
                          {message.content && (
                            <div
                              className={cn(hasMediaAttachments && "px-4 py-3")}
                            >
                              <Streamdown
                                components={{
                                  ul: ({ children }) => (
                                    <ul className="ml-4">{children}</ul>
                                  ),
                                }}
                                className={cn(
                                  "leading-relaxed whitespace-pre-line",
                                  channel === "email"
                                    ? "text-[14px] font-normal"
                                    : "text-[15px]",
                                )}
                              >
                                {message.content}
                              </Streamdown>
                            </div>
                          )}

                          {/* WhatsApp/Telegram-specific time and checkmark inside bubble */}
                          {(channel === "whatsapp" ||
                            channel === "telegram") && (
                            <div className="flex items-center justify-end gap-1 relative">
                              <span
                                className={cn(
                                  "text-[11px]",
                                  isIncoming
                                    ? "text-gray-500"
                                    : "text-gray-600 dark:text-gray-300",
                                )}
                              >
                                {isOutgoing ? (
                                  format(
                                    new Date(message.created_at * 1000),
                                    "hh:mm a",
                                  )
                                ) : (
                                  <span
                                    className={cn(
                                      "text-gray-500",
                                      message.attachments?.some(
                                        (att) => att.file_type === "image",
                                      ) && "pr-4",
                                      message.attachments?.some(
                                        (att) => att.file_type === "video",
                                      ) &&
                                        "absolute bottom-2 right-4 text-white",
                                    )}
                                  >
                                    {format(
                                      new Date(message.created_at * 1000),
                                      "hh:mm a",
                                    )}
                                  </span>
                                )}
                              </span>

                              {isOutgoing && (
                                <svg
                                  viewBox="0 0 16 15"
                                  width="16"
                                  height="15"
                                  className="inline-block text-blue-500 dark:text-blue-400"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                  />
                                </svg>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Time outside and below the bubble (for non-WhatsApp/Telegram) */}
                        {channel !== "whatsapp" && channel !== "telegram" && (
                          <div
                            className={cn(
                              "text-[11px] px-2 font-normal transition-opacity duration-200",
                              channel === "email"
                                ? "text-gray-500 dark:text-gray-400"
                                : channel === "instagram"
                                  ? "text-gray-400"
                                  : channel === "sms"
                                    ? "text-gray-600 dark:text-gray-400"
                                    : "text-gray-500",
                            )}
                          >
                            {format(
                              new Date(message.created_at * 1000),
                              channel === "email" ? "MMM d, h:mm a" : "hh:mm a",
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Invisible element at the bottom to scroll to */}
                <div ref={messagesEndRef} className="h-0" />
              </div>
            </ScrollArea>
          </div>

          {/* Message Input */}
          {onSubmit &&
            !isLoadingMessages &&
            messages &&
            messages.length > 0 && (
              <ChatInput
                isAgentTraining={isAgentTraining}
                onSubmit={onSubmit}
                placeholder="Type your message..."
                channel={channel || "email"}
                disabled={isLoadingMessages}
                onOpenAssetDialog={onOpenAssetDialog}
              />
            )}
        </>
      )}

      {/* Full Screen Media Viewer */}
      {fullScreenMedia && (
        <div
          className="fixed inset-0 z-9999 bg-black/85 flex items-center justify-center"
          onClick={() => setFullScreenMedia(null)}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-linear-to-b from-black/50 to-transparent z-10">
            <div className="flex items-center gap-3">
              {contactInfo && (
                <>
                  {contactInfo.thumbnail ? (
                    <Image
                      src={contactInfo.thumbnail}
                      alt={contactInfo.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "size-10 rounded-full flex items-center justify-center text-sm font-semibold",
                        getAvatarColors(contactInfo.name).bg,
                        getAvatarColors(contactInfo.name).text,
                      )}
                    >
                      {getInitials(contactInfo.name).slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-medium">
                      {contactInfo.name}
                    </h3>
                    {contactInfo.email && (
                      <p className="text-gray-300 text-xs">
                        {contactInfo.email}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement("a");
                  link.href = fullScreenMedia.url;
                  link.download =
                    fullScreenMedia.type === "video" ? "video" : "image";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setFullScreenMedia(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Media Content */}
          {fullScreenMedia.type === "image" ? (
            <img
              src={fullScreenMedia.url}
              alt="Full screen"
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={fullScreenMedia.url}
              controls
              autoPlay
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </section>
  );
}
