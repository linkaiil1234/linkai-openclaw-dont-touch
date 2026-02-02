"use client";

import { useState, useRef, useEffect } from "react";
import { Monitor, MessageCircle, InfoIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChatInput,
  type ConversationFormValues,
} from "@/components/shared/chat-input";
import { cn } from "@/lib/utils";
import { Edit01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import DeviceFrame from "./device-frame";
import { Button } from "@/components/ui/button";
import LinkAIFavicon from "@/assets/images/linkai_favicon.jpeg";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TAgentStatus } from "@/types/common";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  agentName: string;
  agentDescription: string;
  setUpSteps: number;
  agentStatus: TAgentStatus;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onOpenDetailsSidebar?: () => void;
}

export default function ChatPanel({
  messages,
  agentName,
  agentDescription,
  setUpSteps,
  agentStatus,
  onSendMessage,
  isLoading,
  onOpenDetailsSidebar,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<"preview" | "chat">("preview");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleChatSubmit = (values: ConversationFormValues) => {
    if (values.message.trim()) {
      onSendMessage(values.message);
    }
  };

  // Transform messages to match train page format
  const transformedMessages = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    message: msg.content,
    sender: msg.role === "user" ? "user" : "agent",
    message_type: msg.role === "user" ? 0 : 1,
    created_at: msg.timestamp.getTime() / 1000,
    createdAt: msg.timestamp.toISOString(),
  }));

  return (
    <div
      // className="chat-playground-section"
      className="chat-playground-section flex-1 flex flex-col h-full bg-slate-50/50 border border-slate-200 rounded-2xl mx-2 "
    >
      <div className="px-5 py-3.5 bg-white rounded-t-2xl border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={LinkAIFavicon}
            alt="LinkAI Favicon"
            width={120}
            height={120}
            className="size-10 object-cover rounded-lg"
          />
          <div>
            <h1 className="font-semibold text-[15px] text-slate-800 line-clamp-1">
              {agentName}
            </h1>
            <div className="flex items-center gap-2">
              {agentStatus === "active" && (
                <Badge
                  variant="outline"
                  className="text-[8px] text-green-500 border-green-500 bg-green-500/10"
                >
                  Active
                </Badge>
              )}
              {agentStatus === "inactive" && (
                <Badge
                  variant="outline"
                  className="text-[8px] text-red-500 border-red-500 bg-red-500/10"
                >
                  Inactive
                </Badge>
              )}
              {agentStatus === "archived" && (
                <Badge
                  variant="outline"
                  className="text-[8px] text-gray-500 border-gray-500 bg-gray-500/10"
                >
                  Archived
                </Badge>
              )}
              <p className="text-[11px] max-w-32 text-slate-400 line-clamp-1">
                {agentDescription}
              </p>
            </div>
          </div>
        </div>
        <div>
          <span className=" text-2xl tracking-tight font-semibold text-slate-600">
            Talk to your agent
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="cursor-pointer hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
            onClick={onOpenDetailsSidebar}
          >
            <InfoIcon className="w-4 h-4" />
          </Button>
          <div className="preview-chat-toggle flex items-center gap-2 ">
            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-200 ${
                  viewMode === "preview"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={() => setViewMode("chat")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-200 ${
                  viewMode === "chat"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {viewMode === "preview" ? (
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            <DeviceFrame
              agentSetupStep={setUpSteps}
              messages={messages}
              agentName={agentName}
              agentStatus={agentStatus}
              onSendMessage={onSendMessage}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <section className="flex-1 flex flex-col backdrop-blur-sm shadow-lg border border-border/50 overflow-hidden relative">
            {setUpSteps < 5 && (
              <div className="absolute inset-0 bg-white backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="text-center px-6 py-8">
                  <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-slate-200/50 rounded-full blur-xl"></div>
                    <div className="relative bg-slate-100 rounded-2xl p-6 border border-slate-200">
                      <HugeiconsIcon
                        icon={InformationCircleIcon}
                        className="size-10 text-slate-500"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Agent is not active yet
                  </h3>
                  <p className="text-sm text-slate-600">
                    Please wait while we complete the setup process
                  </p>
                </div>
              </div>
            )}
            <div className="flex-1 overflow-hidden p-4">
              <ScrollArea className="h-full">
                {!Array.isArray(transformedMessages) ||
                transformedMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[800px] text-center px-6 py-12">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                      <div className="relative bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border border-primary/20">
                        <HugeiconsIcon
                          icon={Edit01Icon}
                          className="size-10 text-primary"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-3">
                      Talk to Your Agent
                    </h3>
                    <div className="max-w-md space-y-2">
                      <p className="text-base text-muted-foreground leading-relaxed text-center">
                        This is your agent training playground. Start
                        conversations here to help your agent learn and improve
                        its responses.
                      </p>
                      {/* <p className="text-sm text-muted-foreground/80 leading-relaxed">
                        Send messages, ask questions, and provide feedback to
                        train your agent more effectively.
                      </p> */}
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                      <HugeiconsIcon
                        icon={InformationCircleIcon}
                        className="size-4"
                      />
                      <span>
                        Start by sending a message below to begin training
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transformedMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.message_type === 0 || msg.sender === "user"
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                            msg.message_type === 0 || msg.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground",
                          )}
                        >
                          <p className="text-sm">
                            {msg.content || msg.message}
                          </p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(
                              msg.created_at * 1000 || msg.createdAt,
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[70%] rounded-2xl px-4 py-2 shadow-sm bg-muted text-foreground">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
            </div>
            <div className="">
              <ChatInput
                isAgentTraining={true}
                onSubmit={handleChatSubmit}
                placeholder="Type your message..."
                disabled={setUpSteps < 5}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
