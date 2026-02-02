"use client";

import { useState, useRef, useEffect } from "react";
import {
  Smartphone,
  Monitor,
  Send,
  Search,
  MoreVertical,
  Smile,
  Mic,
  AlertCircleIcon,
} from "lucide-react";
import whatsappBg from "@/assets/images/whatsapp_chat_background.png";
import whatsappDarkBg from "@/assets/images/whatsapp_chat_background_dark.jpg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";
import LinkAILogo from "@/assets/images/linkai_favicon.jpeg";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  read?: boolean;
}

interface DeviceFrameProps {
  agentSetupStep: number;
  messages: Message[];
  agentName?: string;
  agentStatus?: string;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export default function DeviceFrame({
  agentSetupStep,
  messages,
  agentName,
  agentStatus,
  onSendMessage,
  isLoading = false,
}: DeviceFrameProps) {
  const [deviceType, setDeviceType] = useState<"phone" | "desktop">("phone");

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
        <button
          onClick={() => setDeviceType("phone")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            deviceType === "phone"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Mobile
        </button>
        <button
          onClick={() => setDeviceType("desktop")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            deviceType === "desktop"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Monitor className="w-4 h-4" />
          Web
        </button>
      </div>

      <div className="transition-all duration-500 ease-out">
        {deviceType === "phone" ? (
          <PhoneFrame
            agentSetupStep={agentSetupStep}
            messages={messages}
            agentName={agentName}
            agentStatus={agentStatus}
            currentTime={currentTime}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
          />
        ) : (
          <DesktopFrame
            agentSetupStep={agentSetupStep}
            messages={messages}
            agentName={agentName}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

function PhoneFrame({
  agentSetupStep,
  messages,
  agentName,
  agentStatus,
  currentTime,
  onSendMessage,
  isLoading,
}: {
  agentSetupStep: number;
  messages: Message[];
  agentName: string;
  agentStatus: string;
  currentTime: string;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}) {
  const [input, setInput] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (agentSetupStep < 5) return;
    if (input.trim() && onSendMessage) {
      onSendMessage(input.trim());
      setInput("");
      setEmojiPickerOpen(false);
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const cursorPosition = inputRef.current?.selectionStart || input.length;
    const newInput =
      input.slice(0, cursorPosition) + emoji + input.slice(cursorPosition);
    setInput(newInput);
    // Focus back on input and set cursor position after emoji
    setTimeout(() => {
      inputRef.current?.focus();
      const newPosition = cursorPosition + emoji.length;
      inputRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const displayMessages =
    messages.length === 0
      ? [
          {
            id: "greeting",
            role: "agent" as const,
            content: `Hi there! How can I help you today?`,
            timestamp: new Date(),
          },
        ]
      : messages;

  return (
    <div className="relative animate-in fade-in zoom-in-95 duration-500">
      <div className="relative w-[380px] h-[700px] bg-linear-to-b from-slate-700 via-slate-800 to-slate-900 rounded-[55px] p-3 shadow-2xl shadow-slate-900/50">
        {/* Side buttons */}
        <div className="absolute left-[-2px] top-[100px] w-[3px] h-[30px] bg-slate-600 rounded-l-sm" />
        <div className="absolute left-[-2px] top-[150px] w-[3px] h-[60px] bg-slate-600 rounded-l-sm" />
        <div className="absolute left-[-2px] top-[220px] w-[3px] h-[60px] bg-slate-600 rounded-l-sm" />
        <div className="absolute right-[-2px] top-[150px] w-[3px] h-[90px] bg-slate-600 rounded-r-sm" />

        <div className="relative w-full h-full bg-slate-900 rounded-[45px] overflow-hidden">
          <div className="relative w-full h-full bg-white rounded-[42px] overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800 mr-8" />
            </div>

            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-[#075E54] z-10 flex items-end justify-between px-8 pb-1">
              <span className="text-[11px] font-semibold text-white">
                {currentTime}
              </span>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2 17h2v4H2v-4zm4-5h2v9H6v-9zm4-4h2v13h-2V8zm4-4h2v17h-2V4zm4 8h2v9h-2v-9z" />
                </svg>
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                </svg>
                <svg
                  className="w-6 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect
                    x="2"
                    y="7"
                    width="18"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                  <rect
                    x="4"
                    y="9"
                    width="12"
                    height="6"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="20"
                    y="10"
                    width="2"
                    height="4"
                    rx="0.5"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* WhatsApp Chat Interface */}
            <div className="h-full flex flex-col pt-14">
              {/* WhatsApp Header */}
              <div className="flex items-center gap-3 px-3 py-3 bg-[#075E54]">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
                  <Image
                    src={LinkAILogo}
                    alt="Agent Avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-full p-px"
                  />
                </div>
                <div className="flex flex-col w-40  ">
                  <h3 className="text-white text-[15px]  font-medium">
                    {agentName}
                  </h3>
                  <p
                    className={cn(
                      " ml-1 w-max text-green-200 text-[10px] font-semibold border",
                      agentStatus === "active"
                        ? " border-green-400 text-green-400 bg-green-400/10 px-1 rounded-md"
                        : "border-red-400 text-red-400 bg-red-400/10 px-1 rounded-md",
                    )}
                  >
                    {agentStatus === "active" ? "Active" : "Inactive"}
                  </p>
                </div>
                <button className="text-white p-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button className="text-white p-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </button>
                <button className="text-white p-1">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div
                className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
                style={{
                  backgroundColor: "#ECE5DD",
                  backgroundImage: `url(${whatsappBg.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {agentSetupStep < 5 ? (
                  <div className="flex justify-center mb-2 animate-in fade-in duration-300">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 shadow-sm w-full">
                      <p className=" text-xs text-amber-800 text-center flex items-center gap-2 justify-center">
                        <AlertCircleIcon className="w-4 h-4" />
                        <span className="text-center tracking-tight">
                          Agent is onboarding. You can't chat while it's being
                          set up.
                        </span>
                      </p>
                    </div>
                  </div>
                ) : null}
                {displayMessages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300 `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-lg shadow-sm relative ${
                        message.role === "user"
                          ? "bg-[#DCF8C6] rounded-tr-none"
                          : "bg-white rounded-tl-none"
                      }`}
                    >
                      <div
                        className={`absolute top-0 w-2.5 h-2.5 ${
                          message.role === "user"
                            ? "right-[-6px] bg-[#DCF8C6]"
                            : "left-[-6px] bg-white"
                        }`}
                        style={{
                          clipPath:
                            message.role === "user"
                              ? "polygon(0 0, 100% 0, 0 100%)"
                              : "polygon(100% 0, 0 0, 100% 100%)",
                        }}
                      />
                      <p className="text-[14px] text-slate-800 leading-relaxed">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1.5">
                        <span className="text-[10px] text-slate-500">
                          {message.timestamp.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        {message.role === "user" && (
                          <div className="flex items-center gap-1">
                            {message.read ? (
                              <svg
                                className="w-4 h-4 text-blue-500"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start animate-in fade-in duration-300">
                    <div className="bg-white px-4 py-3 rounded-lg rounded-tl-none shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp Input */}

              <div
                className={cn(
                  "flex items-center gap-2 px-2 py-2.5 bg-[#F0F0F0]",
                  agentSetupStep < 5 && "opacity-50 pointer-events-none",
                )}
              >
                <Popover
                  open={emojiPickerOpen}
                  onOpenChange={setEmojiPickerOpen}
                >
                  <PopoverTrigger asChild>
                    <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
                      <Smile className="w-5 h-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-0" align="start">
                    <EmojiPicker
                      height={400}
                      width={300}
                      onEmojiClick={(emojiData) => {
                        handleEmojiSelect(emojiData.emoji);
                        setEmojiPickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex-1 bg-white rounded-2xl px-4 py-2.5 flex items-end gap-2 shadow-sm">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Message"
                    disabled={agentSetupStep < 5}
                    rows={1}
                    className="flex-1 text-[14px] text-slate-800 placeholder-slate-400 bg-transparent outline-none disabled:cursor-not-allowed resize-none overflow-y-auto max-h-24 "
                    style={{ minHeight: "20px" }}
                  />
                </div>
                {input.trim() ? (
                  <button
                    onClick={handleSend}
                    disabled={isLoading || agentSetupStep < 5}
                    className="w-11 h-11 rounded-full bg-[#00A884] flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                ) : (
                  <button
                    disabled={agentSetupStep < 5}
                    className="w-11 h-11 rounded-full bg-[#00A884] flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mic className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>

              {/* Home Indicator */}
              <div className="flex justify-center py-2 bg-white">
                <div className="w-32 h-1 bg-slate-900 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopFrame({
  agentSetupStep,
  messages,
  agentName,
  onSendMessage,
  isLoading,
}: {
  agentSetupStep: number;
  messages: Message[];
  agentName: string;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}) {
  const [input, setInput] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (agentSetupStep < 5) return;
    if (input.trim() && onSendMessage) {
      onSendMessage(input.trim());
      setInput("");
      setEmojiPickerOpen(false);
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const cursorPosition = inputRef.current?.selectionStart || input.length;
    const newInput =
      input.slice(0, cursorPosition) + emoji + input.slice(cursorPosition);
    setInput(newInput);
    // Focus back on input and set cursor position after emoji
    setTimeout(() => {
      inputRef.current?.focus();
      const newPosition = cursorPosition + emoji.length;
      inputRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const displayMessages =
    messages.length === 0
      ? [
          {
            id: "greeting",
            role: "agent" as const,
            content: `Hi there! How can I help you today?`,
            timestamp: new Date(),
          },
        ]
      : messages;

  const chatList = [
    {
      name: agentName,
      lastMessage: "Hi there! How can I help...",
      time: "now",
      unread: 0,
      active: true,
    },
    {
      name: "Support Team",
      lastMessage: "Your ticket has been resolved",
      time: "10:32",
      unread: 2,
      active: false,
    },
    {
      name: "John Doe",
      lastMessage: "See you tomorrow!",
      time: "Yesterday",
      unread: 0,
      active: false,
    },
  ];

  return (
    <div className="relative animate-in fade-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="w-[1000px] h-[600px] bg-linear-to-b from-slate-600 via-slate-700 to-slate-800 rounded-xl p-2 shadow-2xl shadow-slate-900/50">
          {/* Webcam */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-800 rounded-b-xl flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          </div>

          {/* Screen Content - WhatsApp Web */}
          <div className="w-full h-full bg-[#111B21] rounded-lg overflow-hidden flex">
            <div className="w-[220px] bg-[#111B21] border-r border-[#222D34] flex flex-col shrink-0">
              {/* Sidebar Header */}
              <div className="h-14 px-3 flex items-center justify-between bg-[#202C33]">
                <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-slate-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-[#AEBAC1] hover:text-white transition-colors rounded-full hover:bg-[#374248]">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 20.664a9.163 9.163 0 0 1-6.521-2.702.977.977 0 0 1 1.381-1.381 7.269 7.269 0 0 0 10.024.244.977.977 0 0 1 1.313 1.445A9.192 9.192 0 0 1 12 20.664zm7.965-6.112a.977.977 0 0 1-.944-1.229 7.26 7.26 0 0 0-4.8-8.804.977.977 0 0 1 .594-1.86 9.212 9.212 0 0 1 6.092 11.169.976.976 0 0 1-.942.724zm-16.025-.39a.977.977 0 0 1-.953-.769 9.21 9.21 0 0 1 6.626-10.86.975.975 0 1 1 .52 1.882A7.262 7.262 0 0 0 4.56 13.206a.977.977 0 0 1-.955.769l.335.187z" />
                    </svg>
                  </button>
                  <button className="p-2 text-[#AEBAC1] hover:text-white transition-colors rounded-full hover:bg-[#374248]">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z" />
                    </svg>
                  </button>
                  <button className="p-2 text-[#AEBAC1] hover:text-white transition-colors rounded-full hover:bg-[#374248]">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-2 py-2 bg-[#111B21]">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3 text-[#8696A0]" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-[#202C33] text-[#AEBAC1] text-[13px] placeholder-[#8696A0] py-1.5 pl-9 pr-3 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-2 pb-1.5 flex gap-1.5">
                <button className="px-3 py-1 bg-[#00A884] text-white text-[11px] font-medium rounded-full">
                  All
                </button>
                <button className="px-3 py-1 bg-[#202C33] text-[#8696A0] text-[11px] rounded-full hover:bg-[#2A3942]">
                  Unread
                </button>
                <button className="px-3 py-1 bg-[#202C33] text-[#8696A0] text-[11px] rounded-full hover:bg-[#2A3942]">
                  Groups
                </button>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {chatList.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2.5 px-2.5 py-2.5 cursor-pointer transition-colors ${
                      chat.active ? "bg-[#2A3942]" : "hover:bg-[#202C33]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-slate-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#E9EDEF] font-normal truncate">
                          {chat.name}
                        </span>
                        <span
                          className={`text-[11px] ${chat.unread > 0 ? "text-[#00A884]" : "text-[#8696A0]"}`}
                        >
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] text-[#8696A0] truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="min-w-[18px] h-[18px] bg-[#00A884] text-white text-[11px] font-medium rounded-full flex items-center justify-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="h-14 px-4 flex items-center justify-between bg-[#202C33] border-b border-[#222D34]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
                    <Image
                      src={LinkAILogo}
                      alt="Agent Avatar"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover rounded-full p-px"
                    />
                  </div>
                  <div>
                    <h3 className="text-[15px] text-[#E9EDEF] font-normal">
                      {agentName}
                    </h3>
                    <p className="text-[12px] text-[#8696A0]">online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2.5 text-[#AEBAC1] hover:text-white transition-colors rounded-full hover:bg-[#374248]">
                    <Search className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 text-[#AEBAC1] hover:text-white transition-colors rounded-full hover:bg-[#374248]">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto px-16 py-4"
                style={{
                  backgroundColor: "#0B141A",
                  backgroundImage: `url(${whatsappDarkBg.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.9,
                }}
              >
                {/* Encryption notice */}
                <div className="flex justify-center mb-4">
                  <div className="bg-[#1D282F] px-3 py-1.5 rounded-lg">
                    <p className="text-[11px] text-[#8696A0] text-center flex items-center gap-1.5">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.8 1.1 2.8 2.5V11c.6.3 1.2 1 1.2 1.8V16c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-3.2c0-.8.5-1.5 1.2-1.8V9.5C9.2 8.1 10.6 7 12 7zm0 1.2c-.8 0-1.5.7-1.5 1.5v1.5h3V9.7c0-.8-.7-1.5-1.5-1.5z" />
                      </svg>
                      Messages are end-to-end encrypted
                    </p>
                  </div>
                </div>

                {agentSetupStep < 5 ? (
                  <div className="flex justify-center mb-4 animate-in fade-in duration-300">
                    <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg px-4 py-2.5 shadow-sm w-full">
                      <p className="text-[12px] text-amber-200 text-center flex items-center gap-2 justify-center">
                        <svg
                          className="w-4 h-4 shrink-0"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <span>
                          Agent is onboarding. You can't chat while it's being
                          set up.
                        </span>
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2">
                  {displayMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div
                        className={`max-w-[65%] px-3 py-2 rounded-lg shadow-md relative ${
                          message.role === "user"
                            ? "bg-[#005C4B] rounded-tr-none"
                            : "bg-[#202C33] rounded-tl-none"
                        }`}
                      >
                        <div
                          className={`absolute top-0 w-2 h-2 ${
                            message.role === "user"
                              ? "right-[-6px] bg-[#005C4B]"
                              : "left-[-6px] bg-[#202C33]"
                          }`}
                          style={{
                            clipPath:
                              message.role === "user"
                                ? "polygon(0 0, 100% 0, 0 100%)"
                                : "polygon(100% 0, 0 0, 100% 100%)",
                          }}
                        />
                        <p className="text-[14px] text-[#E9EDEF] leading-relaxed">
                          {message.content}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] text-[#8696A0]">
                            {message.timestamp.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                          {message.role === "user" && (
                            <div className="flex items-center gap-1">
                              {message.read ? (
                                <svg
                                  className="w-4 h-4 text-blue-500"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                                </svg>
                              ) : (
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                                </svg>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                      <div className="bg-[#202C33] px-4 py-3 rounded-lg rounded-tl-none shadow-md">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-[#8696A0] rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2 h-2 bg-[#8696A0] rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 bg-[#8696A0] rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div
                className={cn(
                  "min-h-16 max-h-max px-4 py-2 flex items-center gap-3 bg-[#202C33]",
                  agentSetupStep < 5 && "opacity-50 pointer-events-none",
                )}
              >
                <Popover
                  open={emojiPickerOpen}
                  onOpenChange={setEmojiPickerOpen}
                >
                  <PopoverTrigger asChild>
                    <button className="p-2.5 text-[#8696A0] hover:text-[#AEBAC1] transition-colors cursor-pointer">
                      <Smile className="w-6 h-6" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto  p-0 border-0"
                    align="start"
                  >
                    <EmojiPicker
                      height={420}
                      onEmojiClick={(emojiData) => {
                        handleEmojiSelect(emojiData.emoji);
                        setEmojiPickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message"
                    disabled={agentSetupStep < 5}
                    rows={1}
                    className="w-full bg-[#2A3942] text-[#E9EDEF] text-[14px] placeholder-[#8696A0] py-2.5 px-4 rounded-lg outline-none disabled:cursor-not-allowed resize-none max-h-32 overflow-y-auto scrollbar-hide "
                    style={{ minHeight: "40px" }}
                  />
                </div>
                {input.trim() ? (
                  <button
                    onClick={handleSend}
                    disabled={isLoading || agentSetupStep < 5}
                    className="p-2.5 text-[#8696A0] hover:text-[#AEBAC1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                ) : (
                  <button
                    disabled={agentSetupStep < 5}
                    className="p-2.5 text-[#8696A0] hover:text-[#AEBAC1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stand */}
        <div className="flex justify-center">
          <div className="w-48 h-4 bg-gradient-to-b from-slate-600 to-slate-700 rounded-b-lg" />
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-2 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-xl" />
        </div>
      </div>
    </div>
  );
}
