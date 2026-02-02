// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useGetAllConversations } from "@/hooks/api/chatwoot/conversations";
// import { useGetAllConversationMessages } from "@/hooks/api/chatwoot/messages";
// import { formatDistanceToNow } from "date-fns";
// import { Send, MessageSquare } from "lucide-react";
// import { cn } from "@/lib/utils";

// const ConversationsPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const conversationId = searchParams.get("conversation_id");

//   const { data: conversations, isLoading: isLoadingConversations } =
//     useGetAllConversations({});

//   const { data: messages, isLoading: isLoadingMessages } =
//     useGetAllConversationMessages(conversationId || "", {
//       enabled: !!conversationId,
//     });

//   const formatTimestamp = (timestamp: number) => {
//     return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
//   };

//   const handleConversationClick = (id: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("conversation_id", id.toString());
//     router.replace(`/conversations?${params.toString()}`, { scroll: false });
//   };

//   const getMessageTypeLabel = (type: number) => {
//     const types = {
//       0: "incoming",
//       1: "outgoing",
//       2: "activity",
//       3: "template",
//     };
//     return types[type as keyof typeof types] || "unknown";
//   };

//   return (
//     <div className="flex gap-2 h-[calc(100vh-1rem)]">
//       {/* Conversations List */}
//       <section className="max-w-md w-full bg-card rounded-xl border border-border p-2 shadow-xl flex flex-col">
//         <div className="mb-4 p-2">
//           <h2 className="text-lg font-semibold">Conversations</h2>
//           {conversations?.data && (
//             <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
//               <span>All: {conversations.data.meta.all_count}</span>
//               <span>Mine: {conversations.data.meta.mine_count}</span>
//               <span>
//                 Unassigned: {conversations.data.meta.unassigned_count}
//               </span>
//             </div>
//           )}
//         </div>

//         <ScrollArea className="flex-1">
//           {isLoadingConversations && (
//             <div className="flex flex-col gap-2">
//               <Skeleton className="h-20 w-full" />
//               <Skeleton className="h-20 w-full" />
//               <Skeleton className="h-20 w-full" />
//               <Skeleton className="h-20 w-full" />
//             </div>
//           )}

//           <div className="flex flex-col gap-2">
//             {conversations?.data?.payload.map((conversation) => (
//               <div
//                 key={conversation.id}
//                 onClick={() => handleConversationClick(conversation.id)}
//                 className={cn(
//                   "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:bg-muted/50",
//                   conversationId === conversation.id.toString()
//                     ? "bg-muted border-primary"
//                     : "bg-muted/20 border-border"
//                 )}
//               >
//                 <Avatar>
//                   <AvatarImage src={conversation.meta.sender.thumbnail} />
//                   <AvatarFallback>
//                     {conversation.meta.sender.name.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between gap-2 mb-1">
//                     <h3 className="font-medium truncate">
//                       {conversation.meta.sender.name}
//                     </h3>
//                     <span className="text-xs text-muted-foreground whitespace-nowrap">
//                       {formatTimestamp(conversation.timestamp)}
//                     </span>
//                   </div>

//                   {conversation.last_non_activity_message && (
//                     <p className="text-sm text-muted-foreground line-clamp-1">
//                       {conversation.last_non_activity_message.content}
//                     </p>
//                   )}

//                   <div className="flex items-center gap-2 mt-2">
//                     <Badge variant="outline" className="text-xs">
//                       {conversation.meta.channel.split("::")[1]}
//                     </Badge>
//                     <Badge
//                       variant={
//                         conversation.status === "open" ? "default" : "outline"
//                       }
//                       className="text-xs"
//                     >
//                       {conversation.status}
//                     </Badge>
//                     {conversation.unread_count > 0 && (
//                       <Badge variant="destructive" className="text-xs">
//                         {conversation.unread_count}
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {!isLoadingConversations &&
//             conversations?.data?.payload.length === 0 && (
//               <div className="text-center text-muted-foreground py-8">
//                 No conversations found
//               </div>
//             )}
//         </ScrollArea>
//       </section>

//       {/* Message Thread */}
//       <section className="flex-1 bg-card rounded-xl border border-border shadow-xl flex flex-col">
//         {!conversationId ? (
//           <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
//             <MessageSquare className="w-12 h-12 opacity-50" />
//             <p className="text-lg">Select a conversation to view messages</p>
//           </div>
//         ) : (
//           <>
//             {/* Messages Header */}
//             {messages?.data && (
//               <div className="p-4 border-b border-border">
//                 <div className="flex items-center gap-3">
//                   <Avatar>
//                     <AvatarImage
//                       src={messages.data.meta.contact.thumbnail}
//                     />
//                     <AvatarFallback>
//                       {messages.data.meta.contact.name
//                         .charAt(0)
//                         .toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h2 className="font-semibold">
//                       {messages.data.meta.contact.name}
//                     </h2>
//                     {messages.data.meta.contact.email && (
//                       <p className="text-sm text-muted-foreground">
//                         {messages.data.meta.contact.email}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Messages List */}
//             <ScrollArea className="flex-1 p-4">
//               {isLoadingMessages && (
//                 <div className="flex flex-col gap-3">
//                   <Skeleton className="h-16 w-3/4" />
//                   <Skeleton className="h-16 w-3/4 ml-auto" />
//                   <Skeleton className="h-16 w-3/4" />
//                   <Skeleton className="h-16 w-3/4 ml-auto" />
//                 </div>
//               )}

//               <div className="flex flex-col gap-3">
//                 {messages?.data?.payload.map((message) => {
//                   const isIncoming = message.message_type === 0;
//                   const isOutgoing = message.message_type === 1;

//                   return (
//                     <div
//                       key={message.id}
//                       className={cn(
//                         "flex gap-2",
//                         isOutgoing && "flex-row-reverse"
//                       )}
//                     >
//                       {message.sender && (
//                         <Avatar className="w-8 h-8">
//                           <AvatarImage src={message.sender.thumbnail} />
//                           <AvatarFallback>
//                             {message.sender.name.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                       )}

//                       <div
//                         className={cn(
//                           "max-w-[70%] rounded-lg p-3",
//                           isIncoming &&
//                             "bg-muted border border-border",
//                           isOutgoing && "bg-primary text-primary-foreground"
//                         )}
//                       >
//                         {message.sender && (
//                           <p
//                             className={cn(
//                               "text-xs font-medium mb-1",
//                               isOutgoing
//                                 ? "text-primary-foreground/80"
//                                 : "text-muted-foreground"
//                             )}
//                           >
//                             {message.sender.name}
//                           </p>
//                         )}
//                         <p className="text-sm whitespace-pre-wrap">
//                           {message.content}
//                         </p>
//                         <div
//                           className={cn(
//                             "flex items-center gap-2 mt-1 text-xs",
//                             isOutgoing
//                               ? "text-primary-foreground/70"
//                               : "text-muted-foreground"
//                           )}
//                         >
//                           <span>
//                             {formatTimestamp(message.created_at)}
//                           </span>
//                           {message.status && (
//                             <Badge
//                               variant="outline"
//                               className="text-xs h-4 px-1"
//                             >
//                               {message.status}
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {!isLoadingMessages &&
//                 messages?.data?.payload.length === 0 && (
//                   <div className="text-center text-muted-foreground py-8">
//                     No messages in this conversation
//                   </div>
//                 )}
//             </ScrollArea>

//             {/* Message Input */}
//             <div className="p-4 border-t border-border">
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Type your message..."
//                   className="flex-1"
//                 />
//                 <Button size="icon">
//                   <Send className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </>
//         )}
//       </section>
//     </div>
//   );
// };

// export default ConversationsPage;

const ConversationsPage = () => {
  return (
    <div>
      <div className="text-2xl font-bold">Conversations</div>
      <p className="text-sm text-muted-foreground">Coming soon...</p>
    </div>
  );
};

export default ConversationsPage;
