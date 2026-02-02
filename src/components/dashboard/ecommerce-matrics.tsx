"use client";
import {
  ArrowUp01Icon,
  RobotIcon,
  MessageMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "../ui/badge";
import { useGetAllAgents } from "@/hooks/api/agent";
import { useGetAllClients } from "@/hooks/api/crm/client";
import { useMemo } from "react";
import type { TAgentWithPartialConfig } from "@/types/models/agent";
import type { TClient } from "@/types/models/client";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useGetAllCustomers } from "@/hooks/api/customer";

export const EcommerceMetrics = () => {
  const { data: agentsData, isLoading: isLoadingAgents } = useGetAllAgents();
  const { data: clientsData, isLoading: isLoadingClients } = useGetAllClients();
  const { data: customersData, isLoading: isLoadingCustomers } =
    useGetAllCustomers();

  const agents = useMemo(
    () => (agentsData?.data ?? []) as TAgentWithPartialConfig[],
    [agentsData?.data],
  );
  const clients = useMemo(
    () => (clientsData?.data ?? []) as TClient[],
    [clientsData?.data],
  );

  const metrics = useMemo(() => {
    const totalAgents = agents.length;
    const totalClients = clients.length;
    const activeClients = clients.filter(
      (client) => client.status === "active",
    ).length;

    // Calculate total conversations across all clients
    const totalConversations = clients.reduce(
      (sum, client) => sum + (client.total_conversations || 0),
      0,
    );

    // Calculate growth (mock data for now - you can replace with real comparison)
    const agentsGrowth = totalAgents > 0 ? 12.5 : 0;
    const clientsGrowth = totalClients > 0 ? 68 : 0;

    return {
      totalAgents,
      totalClients,
      activeClients,
      totalConversations,
      agentsGrowth,
      clientsGrowth,
    };
  }, [agents, clients]);

  const isLoading = isLoadingAgents || isLoadingClients;

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-row gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl w-full border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 h-[168px] animate-pulse"
          >
            <div className="h-12 w-12 bg-gray-200 rounded-xl dark:bg-gray-700" />
            <div className="mt-5 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="h-8 w-20 bg-gray-200 rounded dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (agents.length === 0 && clients.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/3">
        <div className="text-center">
          <HugeiconsIcon
            icon={RobotIcon}
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
          />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            No data available
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create agents and engage with customers to see metrics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-row gap-4 px-3 pt-1 pb-3">
      {/* Money Saved Metric */}
      <motion.div
        className="rounded-2xl w-full border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 h-[168px] cursor-pointer"
        initial={{ scale: 1 }}
        style={{
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)",
        }}
        whileHover={{
          scale: 1.05,
          boxShadow:
            "0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08)",
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 20,
          },
        }}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaMoneyCheckAlt className="text-gray-800 w-5 h-5" />
        </div>

        <div className="flex items-end justify-between mt-2 ">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ">
              Money Saved
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-3xl">
              96%
            </h4>
          </div>
          {metrics.agentsGrowth > 0 && (
            <Badge
              variant="default"
              className="bg-green-100 text-green-700 font-medium"
            >
              <HugeiconsIcon icon={ArrowUp01Icon} className="size-3" />
              {metrics.agentsGrowth.toFixed(1)}%
            </Badge>
          )}
        </div>
      </motion.div>

      <motion.div
        className="rounded-2xl w-full border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 h-[168px] cursor-pointer"
        initial={{ scale: 1 }}
        style={{
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)",
        }}
        whileHover={{
          scale: 1.05,
          boxShadow:
            "0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08)",
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 20,
          },
        }}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <HugeiconsIcon
            icon={MessageMultipleIcon}
            className="text-gray-800 size-6 dark:text-white/90"
          />
        </div>

        <div className="flex items-end justify-between mt-2 ">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ">
              Customers Engaged
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-3xl">
              {customersData?.data?.length || 0}
            </h4>
          </div>

          {metrics.clientsGrowth > 0 && (
            <Badge
              variant="default"
              className="bg-green-100 text-green-700 font-medium"
            >
              <HugeiconsIcon icon={ArrowUp01Icon} className="size-3" />
              {metrics.clientsGrowth}%
            </Badge>
          )}
        </div>
      </motion.div>
    </div>
  );
};
