import React, { useState } from "react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Tool {
  _id: string;
  name: string;
  icon?: React.ReactNode;
  icon_url?: string;
  color: string;
  description: string;
  bgGradient: string;
  isConnected?: boolean;
}

interface IntegrationsSectionProps {
  tools: Tool[];
  onToolClick: (tool: Tool) => void;
  onClose: () => void;
}

export default function IntegrationsSection({
  tools,
  onToolClick,
  onClose,
}: IntegrationsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section>
      <div className="">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, idx) => (
              <div
                key={tool._id}
                className="relative group block p-2 h-full w-full"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/80 block rounded-3xl"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <IntegrationCard
                  title={tool.name}
                  description={tool.description}
                  icon={tool.icon}
                  icon_url={tool.icon_url}
                  color={tool.color}
                  isConnected={tool.isConnected}
                  onClick={() => {
                    onToolClick(tool);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface IntegrationCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  icon_url?: string;
  color?: string;
  isConnected?: boolean;
  onClick?: () => void;
}

const IntegrationCard = ({
  title,
  description,
  icon,
  icon_url,
  color = "#6366F1",
  isConnected = false,
  onClick,
}: IntegrationCardProps) => {
  return (
    <Card
      className={cn(
        "relative z-10 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-none h-full",
        isConnected
          ? "bg-green-50 dark:bg-green-950/20"
          : "bg-[#F5F5F5] dark:bg-secondary",
      )}
      onClick={onClick}
    >
      <div className="relative">
        {/* Connected Badge */}
        {isConnected && (
          <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
            <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
          </div>
        )}

        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
          style={{
            // backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {icon_url ? (
            <Image
              src={icon_url}
              alt={title}
              width={32}
              height={32}
              className="size-8 object-contain"
            />
          ) : (
            <div className="*:size-8">{icon}</div>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-muted-foreground text-xs line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};
