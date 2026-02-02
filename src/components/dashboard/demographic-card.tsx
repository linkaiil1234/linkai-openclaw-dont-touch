/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  More01Icon,
  WhatsappIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useGetAllAgents } from "@/hooks/api/agent";
import { useMemo } from "react";
import CountryMap from "./country-map";
import { TAgent } from "@/types/models/agent";
import Image from "next/image";
import CountryImage from "@/assets/images/Country 02.svg";

// export default function DemographicCard() {
//   const { data: agentsData } = useGetAllAgents();
//   const agents = (agentsData?.data ?? []) as TAgent[];

//   // Generate demo data for integrations/channels distribution
//   const integrationData = useMemo(() => {
//     const totalAgents = agents.length;
//     const whatsappAgents = agents.filter((agent: any) =>
//       agent.config?.channels?.some((ch: any) =>
//         typeof ch === "string"
//           ? ch.includes("whatsapp")
//           : ch.name?.includes("whatsapp")
//       )
//     ).length;
//     const emailAgents = agents.filter((agent: any) =>
//       agent.config?.channels?.some((ch: any) =>
//         typeof ch === "string"
//           ? ch.includes("email")
//           : ch.name?.includes("email")
//       )
//     ).length;

//     // Demo percentages based on agent distribution
//     const whatsappPercent =
//       totalAgents > 0 ? Math.round((whatsappAgents / totalAgents) * 100) : 65;
//     const emailPercent =
//       totalAgents > 0 ? Math.round((emailAgents / totalAgents) * 100) : 35;

//     return [
//       {
//         name: "WhatsApp",
//         count: whatsappAgents || Math.floor(totalAgents * 0.65) || 15,
//         percentage: whatsappPercent,
//         icon: WhatsappIcon,
//       },
//       {
//         name: "Email",
//         count: emailAgents || Math.floor(totalAgents * 0.35) || 8,
//         percentage: emailPercent,
//         icon: Mail01Icon,
//       },
//     ];
//   }, [agents]);

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 sm:p-6">
//       <div className="flex justify-between">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//             Integration Distribution
//           </h3>
//           <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
//             Number of agents using each integration
//           </p>
//         </div>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="dropdown-toggle">
//               <HugeiconsIcon
//                 icon={More01Icon}
//                 className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-5"
//               />
//             </button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-40 z-30">
//             <DropdownMenuItem className="cursor-pointer">
//               View More
//             </DropdownMenuItem>
//             <DropdownMenuItem variant="destructive" className="cursor-pointer">
//               Delete
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
//         <div className="-mx-4 -my-6 h-[212px] sm:-mx-6 z-10">
//           <CountryMap />
//         </div>
//       </div>

//       <div className="space-y-5">
//         {integrationData.map((integration, index) => (
//           <div key={index} className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
//                 <Image
//                   src={CountryImage}
//                   alt={integration.name}
//                   width={40}
//                   height={40}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
//                   {integration.name}
//                 </p>
//                 <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
//                   {integration.count} Agents
//                 </span>
//               </div>
//             </div>

//             <div className="flex w-full max-w-[140px] items-center gap-3">
//               <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
//                 <div
//                   className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-indigo-500 text-xs font-medium text-white"
//                   style={{ width: `${integration.percentage}%` }}
//                 ></div>
//               </div>
//               <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                 {integration.percentage}%
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

export default function DemographicCard() {
  return <div>DemographicCard</div>;
}
