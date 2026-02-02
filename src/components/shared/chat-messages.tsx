// "use client";

// import PdfPng from "@/assets/images/pdf.png";
// import WhatsAppBg from "@/assets/images/whatsapp_chat_background.png";
// import TelegramBg from "@/assets/images/telegram-background.png";
// import LinkAILogo from "@/assets/images/linkai_favicon.jpeg";
// import { cn } from "@/lib/utils";
// import { TInboxMessage } from "@/types/models/inbox-message";
// import { Button } from "@/components/ui/button";
// import {
//   Link01FreeIcons,
//   Search01FreeIcons,
//   InformationCircleFreeIcons,
// } from "@hugeicons/core-free-icons";
// import { HugeiconsIcon } from "@hugeicons/react";
// import { FaInstagramSquare } from "react-icons/fa";
// import { IoLogoWhatsapp } from "react-icons/io";
// import { MdSms } from "react-icons/md";
// import { Loader2 } from "lucide-react";
// import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";

// import Image from "next/image";
// import { format, isToday, isYesterday } from "date-fns";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useEffect, useRef } from "react";

// const isImageAttachment = (attachment: string) =>
//   /\.(png|jpe?g|gif|webp|avif)$/i.test(attachment);

// const isPdfAttachment = (attachment: string) =>
//   attachment.toLowerCase().endsWith(".pdf");

// // Format timestamp like WhatsApp: today shows time, yesterday shows "yesterday time", older shows date
// export const formatWhatsAppTimestamp = (date: Date): string => {
//   if (isToday(date)) {
//     // Today: show time in AM/PM format
//     return format(date, "h:mm a");
//   } else if (isYesterday(date)) {
//     // Yesterday: show "yesterday" with time
//     return `yesterday ${format(date, "h:mm a")}`;
//   } else {
//     // Before yesterday: show date
//     return format(date, "MM/dd/yyyy");
//   }
// };

// // Format "last seen" like WhatsApp
// export const formatWhatsAppLastSeen = (date: Date): string => {
//   const now = new Date();
//   const diffInMinutes = Math.floor(
//     (now.getTime() - date.getTime()) / (1000 * 60)
//   );

//   // Online if last seen within 1 minute
//   if (diffInMinutes < 1) {
//     return "online";
//   }

//   if (isToday(date)) {
//     // Today: "last seen today at [time]"
//     return `last seen today at ${format(date, "h:mm a")}`;
//   } else if (isYesterday(date)) {
//     // Yesterday: "last seen yesterday at [time]"
//     return `last seen yesterday at ${format(date, "h:mm a")}`;
//   } else {
//     // Before yesterday: "last seen [date] at [time]"
//     return `last seen ${format(date, "MM/dd/yyyy")} at ${format(
//       date,
//       "h:mm a"
//     )}`;
//   }
// };

// type MessageListProps = {
//   type?: "agent" | "customer";
//   messages?: TInboxMessage[];
//   isStreaming?: boolean;
//   formatDate?: (date: Date) => string;
//   formatTime?: (date: Date) => string;
//   // Agent header props
//   agentImage?: string;
//   agentName?: string;
//   agentDescription?: string;
//   onSearchClick?: () => void;
//   onMenuClick?: () => void;
//   // Channel for styling
//   channel?: "whatsapp" | "email" | "sms" | "instagram" | "telegram";
//   isLoading?: boolean;
// };

// const TypingIndicator = ({
//   channel = "email",
// }: {
//   channel?: "whatsapp" | "email" | "sms" | "instagram" | "telegram";
// }) => {
//   const getBubbleStyle = () => {
//     switch (channel) {
//       case "whatsapp":
//         return "bg-white dark:bg-[#1F2C33] rounded-lg rounded-tl-sm shadow-sm border-none";
//       case "instagram":
//         return "bg-gray-100 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800";
//       case "sms":
//         return "bg-gray-200/10 dark:bg-gray-800 rounded-[18px] shadow-sm";
//       case "telegram":
//         return "bg-white dark:bg-[#212121] rounded-lg shadow-sm border-none";
//       case "email":
//       default:
//         return "bg-white dark:bg-[#2D2E30] rounded-lg rounded-tl-sm shadow-sm border border-gray-200 dark:border-gray-700";
//     }
//   };

//   return (
//     <div className="flex items-start gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
//       <div className={cn("px-5 py-3.5 flex gap-1", getBubbleStyle())}>
//         <div className="flex gap-1.5">
//           <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
//           <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
//           <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MessageList = ({
//   type,
//   messages: propMessages = [],
//   isStreaming = false,
//   agentImage,
//   agentName,
//   agentDescription,
//   onSearchClick,
//   onMenuClick,
//   channel = "email",
//   isLoading: propIsLoading = false,
// }: MessageListProps) => {
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Use prop messages directly
//   const messages = propMessages;
//   const isLoading = propIsLoading;
//   const error = null;
//   const refetch = () => {};

//   // Scroll to bottom when messages change, loading completes, or streaming updates
//   useEffect(() => {
//     if (!isLoading && messages.length > 0) {
//       // Small delay to ensure DOM is updated
//       const timeoutId = setTimeout(() => {
//         if (messagesEndRef.current) {
//           messagesEndRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "end",
//           });
//         }
//       }, 50);

//       return () => clearTimeout(timeoutId);
//     }
//   }, [messages.length, isLoading, isStreaming]);

//   // Channel-specific background styles
//   const getBackgroundStyle = () => {
//     switch (channel) {
//       case "whatsapp":
//         return "bg-[#ECE5DD] dark:bg-[#0B141A]";
//       case "instagram":
//         return "bg-white dark:bg-black";
//       case "sms":
//         return "bg-gray-100 dark:bg-[#1E293B]";
//       case "telegram":
//         return "bg-[#E5EBF1] dark:bg-[#212121]";
//       case "email":
//       default:
//         return "bg-[#F5F7FA] dark:bg-[#1E293B]";
//     }
//   };

//   // Channel-specific header styles
//   const getHeaderStyle = () => {
//     switch (channel) {
//       case "whatsapp":
//         return "bg-[#008069] dark:bg-[#1F2C33] border-none";
//       case "instagram":
//         return "bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800";
//       case "sms":
//         return "bg-gray-100/95 dark:bg-[#1E293B]/95 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/30";
//       case "telegram":
//         return "bg-[#517DA2] dark:bg-[#2B2B2B] border-none";
//       case "email":
//       default:
//         return "bg-white dark:bg-[#202124] border-b border-gray-200 dark:border-gray-700";
//     }
//   };

//   // Get channel icon
//   const getChannelIcon = () => {
//     switch (channel) {
//       case "whatsapp":
//         return <IoLogoWhatsapp className="w-2 h-2" />;
//       case "email":
//         return (
//           <Image
//             src={GmailIcon}
//             alt="Gmail"
//             width={8}
//             height={8}
//             className="w-2 h-2"
//           />
//         );
//       case "sms":
//         return <MdSms className="w-2 h-2" />;
//       case "instagram":
//         return <FaInstagramSquare className="w-2 h-2" />;
//       case "telegram":
//         return (
//           <svg
//             className="w-2 h-2"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.87 8.81c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
//           </svg>
//         );
//       default:
//         return (
//           <Image
//             src={GmailIcon}
//             alt="Gmail"
//             width={8}
//             height={8}
//             className="w-2 h-2"
//           />
//         );
//     }
//   };

//   // Get channel icon colors
//   const getChannelIconStyle = () => {
//     switch (channel) {
//       case "whatsapp":
//         return "bg-[#25D366] text-white border-white";
//       case "email":
//         return "bg-[#1A89FF] text-white border-white";
//       case "sms":
//         return "bg-black text-white border-white";
//       case "instagram":
//         return "bg-linear-to-br from-[#833AB4] to-[#E1306C] text-white border-white";
//       case "telegram":
//         return "bg-[#0088CC] text-white border-white";
//       default:
//         return "bg-[#EA4335] text-white border-white";
//     }
//   };

//   return (
//     <div
//       className={cn(
//         "size-full w-full flex flex-col relative",
//         getBackgroundStyle()
//       )}
//     >
//       {/* WhatsApp Background Image */}
//       {channel === "whatsapp" && (
//         <div className="absolute inset-0 pointer-events-none">
//           <Image
//             src={WhatsAppBg}
//             alt="WhatsApp Background"
//             fill
//             className="object-cover opacity-30 dark:opacity-20"
//             priority
//           />
//         </div>
//       )}

//       {/* Telegram Background Image */}
//       {channel === "telegram" && (
//         <div className="absolute inset-0 pointer-events-none">
//           <Image
//             src={TelegramBg}
//             alt="Telegram Background"
//             fill
//             className="object-cover opacity-40 dark:opacity-30"
//             priority
//           />
//         </div>
//       )}

//       {/* Chat Header */}
//       <div
//         className={cn(
//           "sticky top-0 z-10 shadow-sm px-6 py-4 rounded-t-2xl transition-all duration-300",
//           getHeaderStyle()
//         )}
//       >
//         <div className="flex items-center justify-between gap-3">
//           {/* Left: Agent Info */}
//           <div className="flex items-center gap-3 flex-1 min-w-0">
//             {agentImage && (
//               <div
//                 className={cn(
//                   "relative size-11 rounded-full overflow-visible shrink-0 shadow-md transition-all duration-300 hover:scale-105",
//                   channel === "email"
//                     ? "ring-2 ring-gray-300/30 hover:ring-gray-300/50"
//                     : "ring-2 ring-blue-500/20 hover:ring-blue-500/40"
//                 )}
//               >
//                 <div className="relative size-11 rounded-full overflow-hidden">
//                   <Image
//                     src={agentImage}
//                     alt={agentName || "Agent"}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 {/* Channel Icon Badge */}
//                 {type === "customer" && (
//                   <div
//                     className={cn(
//                       "absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full border-2 shadow-sm p-[3px]",
//                       getChannelIconStyle()
//                     )}
//                   >
//                     {getChannelIcon()}
//                   </div>
//                 )}
//               </div>
//             )}
//             <div className="flex-1 min-w-0">
//               <h3
//                 className={cn(
//                   "text-base font-semibold truncate transition-colors duration-200",
//                   channel === "whatsapp" || channel === "telegram"
//                     ? "text-white"
//                     : "text-gray-900 dark:text-white"
//                 )}
//               >
//                 {agentName}
//               </h3>
//               <p
//                 className={cn(
//                   "text-xs truncate flex items-center gap-1.5",
//                   channel === "whatsapp" || channel === "telegram"
//                     ? "text-gray-200"
//                     : "text-gray-500"
//                 )}
//               >
//                 <span className="size-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
//                 {agentDescription}
//               </p>
//             </div>
//           </div>

//           {/* Right: Action Icons */}
//           <div className="flex items-center gap-1 shrink-0">
//             <Button
//               variant="ghost"
//               size="icon"
//               className={cn(
//                 "size-9 rounded-full transition-all duration-200 hover:scale-105 active:scale-95",
//                 channel === "whatsapp" || channel === "telegram"
//                   ? "hover:bg-white/10 text-white"
//                   : "hover:bg-gray-100/80 hover:shadow-sm text-gray-600"
//               )}
//               onClick={onSearchClick}
//               aria-label="Search messages"
//             >
//               <HugeiconsIcon icon={Search01FreeIcons} className="size-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className={cn(
//                 "size-9 rounded-full transition-all duration-200 hover:scale-105 active:scale-95",
//                 channel === "whatsapp" || channel === "telegram"
//                   ? "hover:bg-white/10 text-white"
//                   : "hover:bg-gray-100/80 hover:shadow-sm text-gray-600"
//               )}
//               onClick={onMenuClick}
//               aria-label="More options"
//             >
//               <HugeiconsIcon
//                 icon={InformationCircleFreeIcons}
//                 className="size-4"
//               />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Messages Content */}
//       <div className="flex-1 overflow-hidden">
//         {isLoading && (
//           <div className="flex items-center justify-center h-full">
//             <div className="flex flex-col items-center gap-4 animate-in fade-in-0 duration-300">
//               <Loader2 className="w-12 h-12 text-primary animate-spin" />
//               <p className="text-sm text-muted-foreground">
//                 Loading messages...
//               </p>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="flex flex-col items-center justify-center gap-3 py-6 text-center text-sm text-gray-600 border border-red-200 bg-red-50/50 rounded-2xl animate-in fade-in-0 slide-in-from-top-2 duration-300">
//             <p className="font-medium">Failed to load messages</p>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => refetch()}
//               className="bg-white hover:bg-gray-50 border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
//             >
//               Retry
//             </Button>
//           </div>
//         )}

//         <ScrollArea
//           className={cn("h-full flex flex-col gap-4 mx-auto w-full px-4")}
//         >
//           <div className="flex flex-col gap-16 py-4">
//             {/* Default Banner - Show when no messages */}
//             {!isLoading && messages.length === 0 && (
//               <div className="flex flex-col items-center justify-center h-[400px] gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
//                 <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg ring-4 ring-primary/10">
//                   <Image
//                     src={LinkAILogo}
//                     alt="LinkAI Logo"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="flex flex-col items-center gap-2 text-center max-w-md">
//                   <h3 className="text-2xl font-semibold text-foreground">
//                     Welcome to LinkAI
//                   </h3>
//                   <p className="text-muted-foreground text-sm leading-relaxed">
//                     Start a conversation and experience intelligent automation.
//                     Your messages will appear here.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {messages.map((message, index) => {
//               // Channel-specific message styling
//               const getUserMessageStyle = () => {
//                 switch (channel) {
//                   case "whatsapp":
//                     return "bg-[#D9FDD3] dark:bg-[#005C4B] text-gray-900 dark:text-white shadow-sm border-none";
//                   case "instagram":
//                     return "bg-linear-to-br from-[#833AB4] via-[#C13584] to-[#E1306C] text-white shadow-lg border-none";
//                   case "sms":
//                     return "bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-sm";
//                   case "telegram":
//                     return "bg-[#E7F3FF] dark:bg-[#3390EC] text-gray-900 dark:text-white shadow-sm border-none";
//                   case "email":
//                   default:
//                     return "bg-[#1A73E8] dark:bg-[#4285F4] text-white shadow-sm border-none";
//                 }
//               };

//               const getAssistantMessageStyle = () => {
//                 switch (channel) {
//                   case "whatsapp":
//                     return "bg-white dark:bg-[#1F2C33] text-gray-900 dark:text-white shadow-sm border-none";
//                   case "instagram":
//                     return "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800";
//                   case "sms":
//                     return "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm";
//                   case "telegram":
//                     return "bg-white dark:bg-[#2B2B2B] text-gray-900 dark:text-white shadow-sm border-none";
//                   case "email":
//                   default:
//                     return "bg-[#F1F3F4] dark:bg-[#2D2E30] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700";
//                 }
//               };

//               const getBubbleRadius = () => {
//                 switch (channel) {
//                   case "whatsapp":
//                     return message.role === "user"
//                       ? "rounded-lg rounded-tr-sm"
//                       : "rounded-lg rounded-tl-sm";
//                   case "instagram":
//                     return "rounded-lg";
//                   case "sms":
//                     return "rounded-[18px]";
//                   case "telegram":
//                     return message.role === "user"
//                       ? "rounded-lg rounded-tr-sm"
//                       : "rounded-lg rounded-tl-sm";
//                   case "email":
//                   default:
//                     return message.role === "user"
//                       ? "rounded-lg rounded-tr-sm"
//                       : "rounded-lg rounded-tl-sm";
//                 }
//               };

//               return (
//                 <div
//                   key={message._id || index}
//                   className="flex flex-col gap-2 w-full mx-auto"
//                 >
//                   <div
//                     className={cn(
//                       "flex flex-col gap-1",
//                       message.role === "user" ? "items-end" : "items-start"
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "max-w-4/5 flex flex-col gap-3 transition-all duration-200",
//                         channel === "email" ? "px-4 py-3" : "px-4 py-3",
//                         channel === "email" && message.role === "user"
//                           ? "hover:shadow-md"
//                           : channel === "email"
//                           ? "hover:shadow-sm"
//                           : "hover:scale-none",
//                         getBubbleRadius(),
//                         message.role === "user" && getUserMessageStyle(),
//                         message.role === "assistant" &&
//                           getAssistantMessageStyle()
//                       )}
//                     >
//                       {/* Attachments inside the bubble */}
//                       {message.attachments?.length ? (
//                         <div className="flex flex-wrap gap-2">
//                           {message.attachments.map((attachment, idx) =>
//                             isImageAttachment(attachment) ? (
//                               <div
//                                 key={`${attachment}-img-${idx}`}
//                                 className={cn(
//                                   "rounded-xl overflow-hidden border transition-all duration-200 hover:scale-105",
//                                   message.role === "user"
//                                     ? "border-white/30"
//                                     : "border-gray-200"
//                                 )}
//                               >
//                                 <Image
//                                   src={attachment}
//                                   alt="attachment"
//                                   width={120}
//                                   height={90}
//                                   className="h-24 w-28 object-cover"
//                                 />
//                               </div>
//                             ) : (
//                               <span
//                                 key={`${attachment}-chip-${idx}`}
//                                 className={cn(
//                                   "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border transition-all duration-200 hover:scale-105",
//                                   message.role === "user"
//                                     ? "border-white/40 bg-white/20"
//                                     : "bg-gray-50 border-gray-200"
//                                 )}
//                               >
//                                 {isPdfAttachment(attachment) ? (
//                                   <Image
//                                     src={PdfPng}
//                                     width={14}
//                                     height={14}
//                                     alt="pdf"
//                                   />
//                                 ) : (
//                                   <HugeiconsIcon
//                                     icon={Link01FreeIcons}
//                                     className="size-3"
//                                   />
//                                 )}
//                                 <span className="max-w-40 truncate">
//                                   {attachment.split("/").pop()}
//                                 </span>
//                               </span>
//                             )
//                           )}
//                         </div>
//                       ) : null}

//                       {/* Message text */}
//                       <p
//                         className={cn(
//                           "leading-relaxed whitespace-pre-line",
//                           channel === "email"
//                             ? "text-[14px] font-normal"
//                             : "text-[15px]",
//                           message.role === "assistant" &&
//                             channel !== "whatsapp" &&
//                             channel !== "instagram" &&
//                             channel !== "sms" &&
//                             channel !== "telegram" &&
//                             "text-gray-900 dark:text-gray-100",
//                           channel === "sms" &&
//                             message.role === "user" &&
//                             "text-white",
//                           channel === "telegram" &&
//                             message.role === "user" &&
//                             "text-gray-900 dark:text-white"
//                         )}
//                       >
//                         {message.message || message.content}
//                       </p>

//                       {/* WhatsApp/Telegram-specific time and checkmark inside bubble */}
//                       {(channel === "whatsapp" || channel === "telegram") &&
//                         message.createdAt && (
//                           <div className="flex items-center justify-end gap-1">
//                             <span
//                               className={cn(
//                                 "text-[11px]",
//                                 message.role === "user"
//                                   ? "text-gray-600 dark:text-gray-300"
//                                   : "text-gray-500"
//                               )}
//                             >
//                               {format(new Date(message.createdAt), "hh:mm a")}
//                             </span>
//                             {message.role === "user" && (
//                               <svg
//                                 viewBox="0 0 16 15"
//                                 width="16"
//                                 height="15"
//                                 className={cn(
//                                   "inline-block",
//                                   message.role === "user"
//                                     ? "text-blue-500 dark:text-blue-400"
//                                     : "text-gray-500"
//                                 )}
//                               >
//                                 <path
//                                   fill="currentColor"
//                                   d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
//                                 />
//                               </svg>
//                             )}
//                           </div>
//                         )}
//                     </div>

//                     {/* Time outside and below the bubble (for non-WhatsApp/Telegram) */}
//                     {channel !== "whatsapp" &&
//                       channel !== "telegram" &&
//                       message.createdAt && (
//                         <div
//                           className={cn(
//                             "text-[11px] px-2 font-normal transition-opacity duration-200",
//                             channel === "email"
//                               ? "text-gray-500 dark:text-gray-400"
//                               : channel === "instagram"
//                               ? "text-gray-400"
//                               : channel === "sms"
//                               ? "text-gray-600 dark:text-gray-400"
//                               : "text-gray-500"
//                           )}
//                         >
//                           {format(
//                             new Date(message.createdAt),
//                             channel === "email" ? "MMM d, h:mm a" : "hh:mm a"
//                           )}
//                         </div>
//                       )}
//                   </div>
//                 </div>
//               );
//             })}
//             {/* Show typing indicator when streaming */}
//             {isStreaming && (
//               <div className="flex flex-col gap-2 w-full mx-auto animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
//                 <div className="flex flex-col gap-1 items-start">
//                   <TypingIndicator channel={channel} />
//                 </div>
//               </div>
//             )}
//             {/* Invisible element at the bottom to scroll to */}
//             <div ref={messagesEndRef} className="h-0" />
//           </div>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// };

// export { MessageList };
