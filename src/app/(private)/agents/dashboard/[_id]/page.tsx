// "use client";

// import {
//   ArrowLeft01Icon,
//   ArrowDown01Icon,
//   Delete02Icon,
//   CallIcon,
//   InstagramIcon,
//   Facebook01Icon,
//   ChatBotFreeIcons,
//   ChartLineData01Icon,
//   FolderCheckIcon,
//   LanguageSquareIcon,
//   SparklesIcon,
//   Edit01FreeIcons,
//   LegalHammerIcon,
//   Link01Icon,
//   MessageMultiple01Icon,
// } from "@hugeicons/core-free-icons";
// import { HugeiconsIcon } from "@hugeicons/react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   TDeleteAgentPayload,
//   useDeleteAgent,
//   useGetAgentById,
// } from "@/hooks/api/agent";
// import { useParams } from "next/navigation";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";

// export default function AgentDashboardPage() {
//   const { _id } = useParams<{ _id: string }>();
//   const router = useRouter();
//   const { data: agent, isLoading: isAgentLoading } = useGetAgentById(_id);

//   const { mutate: deleteAgent, isPending: isDeletingAgent } = useDeleteAgent();

//   const onDelete = (payload: TDeleteAgentPayload) => {
//     deleteAgent(payload, {
//       onSuccess: () => {
//         toast.success("Agent deleted successfully");
//         router.push("/agents");
//       },
//       onError: (error) => {
//         toast.error(error.message);
//       },
//     });
//   };

//   if (isAgentLoading) {
//     return (
//       <div className="w-full h-full mx-auto flex flex-col gap-6 container p-6">
//         <Skeleton className="h-8 w-32" />
//         <Skeleton className="h-32 w-full" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-1 flex flex-col gap-6">
//             <Skeleton className="h-72 w-full" />
//             <Skeleton className="h-64 w-full" />
//           </div>
//           <div className="lg:col-span-2">
//             <Skeleton className="h-96 w-full" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!agent?.data) {
//     return (
//       <div className="w-full h-full mx-auto flex flex-col gap-6 container p-6">
//         <Link
//           href="/agents"
//           className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
//         >
//           <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
//           <span className="text-sm font-medium">Back to Agents</span>
//         </Link>
//         <div className="flex items-center justify-center h-64">
//           <p className="text-muted-foreground">Agent not found</p>
//         </div>
//       </div>
//     );
//   }

//   const agentData = agent.data;

//   // Calculate stats from agent config (now properly populated)
//   const channels = agentData.config?.channels || [];
//   const tools = agentData.config?.tools || [];
//   const channelsCount = channels.length;
//   const toolsCount = tools.length;

//   // Mock data for conversations (since not in API response)
//   const recentConversations = [
//     {
//       id: 1,
//       name: "Emily Johnson",
//       avatar: "EJ",
//       message: "Voice message",
//       duration: "0:14",
//       time: "11:21 AM",
//       type: "voice",
//       icon: <HugeiconsIcon icon={CallIcon} />,
//     },
//     {
//       id: 2,
//       name: "David Smith",
//       avatar: "DS",
//       message: "I placed an order a few days ago...",
//       time: "10:45 AM",
//       type: "instagram",
//       icon: <HugeiconsIcon icon={InstagramIcon} />,
//       verified: true,
//     },
//     {
//       id: 3,
//       name: "Mark Zuckerberg",
//       avatar: "MZ",
//       message: "The new feature request is pending approval.",
//       time: "Yesterday",
//       type: "facebook",
//       icon: <HugeiconsIcon icon={Facebook01Icon} />,
//       verified: true,
//     },
//   ];

//   return (
//     <div className="w-6xl h-full mx-auto flex flex-col gap-6 container p-6 overflow-hidden">
//       {/* Back Navigation */}
//       <Link
//         href="/agents"
//         className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
//       >
//         <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
//         <span className="text-sm font-medium">Back to Agents</span>
//       </Link>

//       {/* Agent Header */}
//       <div className="flex items-start justify-between gap-4 bg-card rounded-xl p-6 border">
//         <div className="flex items-start gap-4 flex-1">
//           {/* Agent Avatar */}
//           <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
//             <HugeiconsIcon
//               icon={ChatBotFreeIcons}
//               className="h-6 w-6 text-white"
//             />
//           </div>

//           {/* Agent Info */}
//           <div className="flex flex-col gap-1 flex-1">
//             <div className="flex items-center gap-2">
//               <h1 className="text-xl font-bold">{agentData.name}</h1>
//               <Badge
//                 className={`${
//                   agentData.status === "active"
//                     ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
//                     : agentData.status === "inactive"
//                     ? "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-500/20"
//                     : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
//                 }`}
//               >
//                 {agentData.status.toUpperCase()}
//               </Badge>
//             </div>

//             {/* Stats */}
//             <div className="flex items-center gap-6 mt-2">
//               <div className="flex items-center gap-2">
//                 <HugeiconsIcon
//                   icon={ChartLineData01Icon}
//                   className="h-4 w-4 text-blue-500"
//                 />
//                 <span className="text-sm font-medium text-blue-500">
//                   Step {agentData.setup_step}/5
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <HugeiconsIcon
//                   icon={FolderCheckIcon}
//                   className="h-4 w-4 text-purple-500"
//                 />
//                 <span className="text-sm text-muted-foreground">
//                   {agentData.category || "Category"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <HugeiconsIcon
//                   icon={LanguageSquareIcon}
//                   className="h-4 w-4 text-green-500"
//                 />
//                 <span className="text-sm text-muted-foreground">
//                   {agentData.language || "Language"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <HugeiconsIcon
//                   icon={SparklesIcon}
//                   className="h-4 w-4 text-amber-500"
//                 />
//                 <span className="text-sm text-muted-foreground">
//                   {agentData.tone || "Tone"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Configure Dropdown */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6">
//               <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4" />
//               Open Studio & Configure
//               <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 ml-1" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-48">
//             <DropdownMenuItem
//               onClick={() => router.push(`/agents/edit/${agentData._id}`)}
//               className="cursor-pointer focus:bg-blue-50 focus:text-blue-700 dark:focus:bg-blue-950/30 dark:focus:text-blue-300 data-highlighted:bg-blue-100 data-highlighted:text-blue-700 dark:data-highlighted:bg-blue-950/30 dark:data-highlighted:text-blue-300 transition-all"
//             >
//               <HugeiconsIcon icon={Edit01FreeIcons} className="h-4 w-4 mr-2" />
//               Edit Agent
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => router.push(`/agents/train/${agentData._id}`)}
//               className="cursor-pointer focus:bg-blue-50 focus:text-blue-700 dark:focus:bg-blue-950/30 dark:focus:text-blue-300 data-highlighted:bg-blue-100 data-highlighted:text-blue-700 dark:data-highlighted:bg-blue-950/30 dark:data-highlighted:text-blue-300 transition-all"
//             >
//               <HugeiconsIcon icon={LegalHammerIcon} className="h-4 w-4 mr-2" />
//               Train Agent
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => onDelete({ _id: agentData._id })}
//               className="cursor-pointer focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30 dark:focus:text-red-300 data-highlighted:bg-red-100 data-highlighted:text-red-700 dark:data-highlighted:bg-red-950/30 dark:data-highlighted:text-red-300 transition-all"
//             >
//               <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 mr-2" />
//               Delete Agent
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Main Content - Two Column Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
//         {/* Left Column - Stats & Info */}
//         <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-4">
//           {/* Conversations Card */}
//           <Card className="bg-slate-900 h-72 text-white p-6 space-y-4 border-0">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <HugeiconsIcon icon={ChatBotFreeIcons} className="h-5 w-5" />
//                 <h3 className="text-sm font-medium">AGENT STATUS</h3>
//               </div>
//               <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30">
//                 {agentData.status.toUpperCase()}
//               </Badge>
//             </div>

//             <div className="flex flex-col gap-2">
//               {/* Setup Progress */}
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-300">Setup Progress</span>
//                   <span className="font-bold">
//                     Step {agentData.setup_step} / 5
//                   </span>
//                 </div>
//                 <Progress
//                   value={(agentData.setup_step / 5) * 100}
//                   className="h-2 bg-slate-700"
//                   indicatorClassName="bg-blue-500"
//                 />
//               </div>

//               <Separator className="bg-slate-700 my-2" />

//               <div className="space-y-1">
//                 <p className="text-xs font-medium text-muted-foreground line-clamp-5 ">
//                   {agentData.description}
//                 </p>
//               </div>

//               {/* Agent Details */}
//             </div>
//           </Card>

//           {/* Knowledge Base Card */}
//           <Card className="p-6 flex flex-col justify-between">
//             <div className="flex items-center justify-between">
//               <h3 className="text-sm font-medium">Knowledge Base</h3>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8"
//                 onClick={() => router.push(`/agents/train/${agentData._id}`)}
//               >
//                 <HugeiconsIcon icon={Link01Icon} className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* System Instruction */}
//             {agentData.system_prompt && (
//               <div className="space-y-2">
//                 <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
//                   System Instruction
//                 </p>
//                 <p className="text-sm text-muted-foreground leading-relaxed p-3 bg-secondary rounded-lg italic text-ellipsis overflow-hidden">
//                   {agentData.system_prompt}
//                 </p>
//               </div>
//             )}

//             {/* Channels and Tools Count */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
//                 <div className="p-2 rounded-lg bg-green-100">
//                   <HugeiconsIcon
//                     icon={MessageMultiple01Icon}
//                     className="h-4 w-4 text-green-600"
//                   />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-green-600">
//                     {channelsCount}
//                   </p>
//                   <p className="text-xs text-muted-foreground uppercase">
//                     Channels
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
//                 <div className="p-2 rounded-lg bg-blue-100">
//                   <HugeiconsIcon
//                     icon={FolderCheckIcon}
//                     className="h-4 w-4 text-blue-600"
//                   />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {toolsCount}
//                   </p>
//                   <p className="text-xs text-muted-foreground uppercase">
//                     Tools
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Deployment URL */}
//           {agentData.deployment_url && (
//             <Card className="p-6">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold text-sm">Deployment URL</h3>
//                 <Badge variant="outline" className="text-xs">
//                   Active
//                 </Badge>
//               </div>
//               <a
//                 href={agentData.deployment_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 break-all mt-3"
//               >
//                 <HugeiconsIcon
//                   icon={LanguageSquareIcon}
//                   className="h-4 w-4 shrink-0"
//                 />
//                 <span className="truncate text-xs">
//                   {agentData.deployment_url}
//                 </span>
//                 <HugeiconsIcon icon={Link01Icon} className="h-3 w-3 shrink-0" />
//               </a>
//             </Card>
//           )}

//           {/* Connected Channels */}
//           {channelsCount > 0 && (
//             <Card className="p-6">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-semibold text-sm">Connected Channels</h3>
//                 <Badge variant="outline" className="text-xs">
//                   {channelsCount} Active
//                 </Badge>
//               </div>
//               <div className="space-y-2">
//                 {channels.map((channel) => (
//                   <div
//                     key={channel._id}
//                     className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg bg-green-100">
//                         <HugeiconsIcon
//                           icon={MessageMultiple01Icon}
//                           className="h-4 w-4 text-green-600"
//                         />
//                       </div>
//                       <span className="text-sm font-medium capitalize text-black">
//                         {channel.name || "Unknown"}
//                       </span>
//                     </div>
//                     <div className="h-2 w-2 rounded-full bg-green-500" />
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           )}

//           {/* Enabled Tools */}
//           {toolsCount > 0 && (
//             <Card className="p-6">
//               <h3 className="text-sm font-semibold mb-3">Enabled Tools</h3>
//               <div className="space-y-2">
//                 {tools.map((tool) => (
//                   <div
//                     key={tool._id}
//                     className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg bg-blue-100">
//                         <HugeiconsIcon
//                           icon={FolderCheckIcon}
//                           className="h-4 w-4 text-blue-600"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-sm font-medium">{tool.name}</span>
//                         {tool.mcp_url && (
//                           <span className="text-xs text-muted-foreground truncate max-w-[200px]">
//                             {tool.mcp_url}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div
//                       className={`h-2 w-2 rounded-full ${
//                         tool.is_enabled ? "bg-green-500" : "bg-gray-400"
//                       }`}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           )}
//         </div>

//         {/* Right Column - Recent Conversations */}
//         <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
//           <Card className="flex-1 flex flex-col overflow-hidden">
//             {/* Header */}
//             <div className="flex items-center justify-between px-6 pb-6 border-b">
//               <div>
//                 <h2 className="text-sm font-semibold">Recent Conversations</h2>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Live interactions handled by {agentData.name}
//                 </p>
//               </div>
//               <Link href="/clients">
//                 <Button variant="link" className="text-blue-600 gap-2">
//                   View All Inbox
//                   <HugeiconsIcon icon={Link01Icon} className="h-4 w-4" />
//                 </Button>
//               </Link>
//             </div>

//             {/* Conversations List */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
//               {recentConversations.map((conversation) => (
//                 <div
//                   key={conversation.id}
//                   className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/20 transition-all duration-300 ease-in-out cursor-pointer bg-muted group"
//                 >
//                   {/* Avatar with Channel Icon */}
//                   <div className="relative">
//                     <Avatar className="h-10 w-10">
//                       <AvatarImage
//                         src={`https://api.dicebear.com/7.x/initials/svg?seed=${conversation.avatar}`}
//                       />
//                       <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white">
//                         {conversation.avatar}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div
//                       className={`absolute -bottom-1 -right-1 p-1 rounded-full ${
//                         conversation.type === "voice"
//                           ? "bg-green-500"
//                           : conversation.type === "instagram"
//                           ? "bg-pink-500"
//                           : "bg-blue-500"
//                       }`}
//                     >
//                       {conversation.icon}
//                     </div>
//                   </div>

//                   {/* Conversation Details */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <h4 className="font-semibold text-sm">
//                         {conversation.name}
//                       </h4>
//                       {conversation.verified && (
//                         <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
//                           <span className="text-white text-xs">✓</span>
//                         </div>
//                       )}
//                     </div>
//                     <p className="text-xs text-muted-foreground truncate">
//                       {conversation.type === "voice" ? (
//                         <span className="flex items-center gap-2">
//                           <span>Voice message</span>
//                           <span className="text-xs">
//                             ({conversation.duration})
//                           </span>
//                         </span>
//                       ) : (
//                         conversation.message
//                       )}
//                     </p>
//                   </div>

//                   {/* Time */}
//                   <span className="text-xs text-muted-foreground whitespace-nowrap">
//                     {conversation.time}
//                   </span>
//                 </div>
//               ))}

//               {/* See More */}
//               <div className="pt-4 text-center absolute bottom-1 left-0 right-0">
//                 <Button
//                   variant="ghost"
//                   className="text-muted-foreground hover:text-foreground"
//                 >
//                   See more conversations...
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

const AgentDashboardPage = () => {
  return (
    <div>
      <div className="text-2xl font-bold">Agent Dashboard</div>
      <p className="text-sm text-muted-foreground">Coming soon...</p>
    </div>
  );
};

export default AgentDashboardPage;
