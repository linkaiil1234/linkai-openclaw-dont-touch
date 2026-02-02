"use client";

import { motion } from "framer-motion";
import { Loading01Icon } from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  message?: string;
}

export const Loading = ({
  size = "md",
  fullScreen = false,
  message = "Loading...",
}: LoadingProps) => {
  const sizeClasses = {
    sm: "size-6",
    md: "size-10",
    lg: "size-16",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-[#1A89FF]/20 dark:from-gray-950 dark:to-blue-950/20 z-50"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="flex flex-col items-center gap-4"
      >
        {/* Animated Spinner */}
        <motion.div
          className="relative"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <HugeiconsIcon
            icon={Loading01Icon}
            className={`${sizeClasses[size]} text-[#2663eb]`}
          />
        </motion.div>

        {/* Pulsing Dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="size-2 rounded-full bg-[#2663eb]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Loading Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.4,
            }}
            className="text-sm font-medium text-foreground/80"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

// Alternative: Spinner with ring
export const LoadingSpinner = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizeMap = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
  };

  return (
    <motion.div
      className={`${sizeMap[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <HugeiconsIcon
        icon={Loading01Icon}
        className="size-full text-[#2663eb]"
      />
    </motion.div>
  );
};

// Alternative: Dots Loader
export const LoadingDots = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="size-2 rounded-full bg-[#2663eb]"
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Alternative: Pulse Ring Loader
export const LoadingPulse = ({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "size-8",
    md: "size-12",
    lg: "size-16",
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse ring */}
      <motion.div
        className={`absolute ${sizeClasses[size]} rounded-full border-2 border-[#2663eb]`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner pulse ring */}
      <motion.div
        className={`absolute ${sizeClasses[size]} rounded-full border-2 border-[#2663eb]`}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />

      {/* Center dot */}
      <motion.div
        className="size-3 rounded-full bg-[#2663eb]"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// Full Screen Pulsing Dots Loader
export const LoadingFullScreenDots = ({
  message = "Loading...",
}: {
  message?: string;
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-[#1A89FF]/20 dark:from-gray-950 dark:to-blue-950/20 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="flex flex-col items-center gap-6"
      >
        {/* Pulsing Dots Loading Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 rounded-full bg-primary"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          ))}
        </div>

        {/* Loading Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.4,
            }}
            className="text-sm font-medium text-foreground/80"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
