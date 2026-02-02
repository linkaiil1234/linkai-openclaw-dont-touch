"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Refresh01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

const TOUR_STORAGE_PREFIX = "linkaiil_tour_completed_";

export default function UserTourCard() {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetTours = () => {
    setIsResetting(true);
    try {
      // Clear all tour completion states
      if (typeof window !== "undefined") {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith(TOUR_STORAGE_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      }

      toast.success(
        "Tutorials reset successfully! Tours will show again on your next visit.",
      );

      // Small delay before navigating to show the toast
      setTimeout(() => {
        setIsResetting(false);
      }, 500);
    } catch (error) {
      console.error("Error resetting tours:", error);
      toast.error("Failed to reset tutorials");
      setIsResetting(false);
    }
  };

  return (
    <div className="p-5 border rounded-2xl lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Product Tutorials
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Reset all product tours to see them again. This will allow you to
            replay the interactive tutorials that guide you through different
            features of the platform.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              Agents Tour
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              Inbox Tour
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              Customers Tour
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              Integrations Tour
            </span>
          </div>
        </div>

        <Button
          onClick={handleResetTours}
          variant="outline"
          disabled={isResetting}
          className="w-full lg:w-auto rounded-full shrink-0 cursor-pointer"
        >
          <HugeiconsIcon
            icon={Refresh01FreeIcons}
            className={`size-4 mr-2 ${isResetting ? "animate-spin" : ""}`}
          />
          {isResetting ? "Resetting..." : "Repeat Tutorials"}
        </Button>
      </div>
    </div>
  );
}
