"use client";

import { EcommerceMetrics } from "@/components/dashboard/ecommerce-matrics";
import MonthlySalesChart from "@/components/dashboard/monthly-sales-chat";
import MonthlyTarget from "@/components/dashboard/monthly-target";
import RecentChats from "@/components/dashboard/recent-chat";
import StatisticsChart from "@/components/dashboard/statics-chart";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      mass: 0.8,
      ease: "easeOut" as const,
      duration: 0.4,
    },
  },
};

const nestedItemVariants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 15,
      mass: 0.6,
      ease: "easeOut" as const,
      duration: 0.3,
    },
  },
};

// Hover animation configuration
const hoverAnimation = {
  scale: 1.02,
  y: -8,
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 20,
  },
};

// Enhanced shadow configurations for better depth and visual appeal
const hoverShadow =
  "0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)";
const defaultShadow =
  "0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)";

export default function Dashboard() {
  return (
    <motion.div
      className="flex flex-col gap-4 md:gap-6 max-w-[1500px] mx-auto font-sans px-4 md:px-6 "
      style={{ fontFamily: "Outfit, sans-serif" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* First Row: EcommerceMetrics + MonthlySalesChart | MonthlyTarget */}
      <motion.div
        className="flex flex-col xl:flex-row gap-4 md:gap-x-6 h-[475px]"
        variants={itemVariants}
      >
        <motion.div
          className="flex flex-col xl:w-[58.333%] gap-y-6 h-full min-h-0 "
          variants={containerVariants}
        >
          <motion.div
            className="h-max pb-0 shrink-0 rounded-xl "
            variants={nestedItemVariants}
          >
            <div className="relative rounded-xl overflow-hidden">
              <EcommerceMetrics />
            </div>
          </motion.div>
          <motion.div
            className="flex-1 pt-0 min-h-0"
            variants={nestedItemVariants}
          >
            <motion.div
              className="relative rounded-xl overflow-hidden h-full ml-3"
              style={{
                boxShadow: defaultShadow,
              }}
              whileHover={{
                ...hoverAnimation,
                boxShadow: hoverShadow,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
            >
              <MonthlySalesChart />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-1 xl:w-[41.666%] h-[475px] rounded-xl  pt-1"
          variants={nestedItemVariants}
        >
          <motion.div
            className="relative overflow-hidden h-full rounded-xl"
            style={{
              boxShadow: defaultShadow,
            }}
            whileHover={{
              ...hoverAnimation,
              boxShadow: hoverShadow,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
          >
            <MonthlyTarget />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Second Row: StatisticsChart (Full Width) */}
      <motion.div className="w-full" variants={itemVariants}>
        <motion.div
          className="relative rounded-xl overflow-hidden ml-3"
          style={{
            boxShadow: defaultShadow,
          }}
          whileHover={{
            ...hoverAnimation,
            boxShadow: hoverShadow,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
        >
          <StatisticsChart />
        </motion.div>
      </motion.div>

      {/* Third Row: DemographicCard | RecentChats */}
      <motion.div
        className="flex flex-col xl:flex-row gap-4 md:gap-6"
        variants={itemVariants}
      >
        {/* <div className="flex-1 xl:w-[41.666%]">
          <DemographicCard />
        </div> */}

        <motion.div className="flex-1 xl:w-[58.333%]">
          <motion.div
            className="relative rounded-xl overflow-hidden ml-3 "
            style={{
              boxShadow: defaultShadow,
            }}
            whileHover={{
              ...hoverAnimation,
              boxShadow: hoverShadow,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
          >
            <RecentChats />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
