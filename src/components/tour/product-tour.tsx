"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/providers/auth-provider";

export interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | "top-right-corner"
    | "left-chat-preview-toggle";
  spotlightPadding?: number;
  bannerMode?: boolean; // If true, shows as a floating banner instead of element spotlight
  requiredTab?: "edit" | "settings"; // Tab that must be active for this step
}

interface ProductTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
  autoStart?: boolean;
}

export const ProductTour = ({
  steps,
  isOpen,
  onComplete,
  onSkip,
}: ProductTourProps) => {
  const session = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState<DOMRect | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isOpen || currentStep >= steps.length) return;

    let cleanupTimeout: NodeJS.Timeout | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;
    let retryCount = 0;
    const maxRetries = 10; // Increased retries for tab switching

    const switchTab = (tab: "edit" | "settings") => {
      // Find the tab buttons - they're in a flex container with gap-1
      const tabContainer = document.querySelector(
        'div[class*="flex p-1.5 gap-1"]',
      );
      if (!tabContainer) return;

      const tabButtons = tabContainer.querySelectorAll("button");
      tabButtons.forEach((button) => {
        const text = button.textContent?.trim().toLowerCase() || "";
        const shouldClick =
          (tab === "edit" && text === "edit") ||
          (tab === "settings" && text === "settings");

        // Check if button is not already active (doesn't have bg-white class)
        const isActive = button.classList.contains("bg-white");

        if (shouldClick && !isActive) {
          (button as HTMLButtonElement).click();
        }
      });
    };

    const findElement = () => {
      const step = steps[currentStep];

      // Switch to required tab first if needed
      if (step.requiredTab) {
        switchTab(step.requiredTab);
      }

      // Wait a bit for tab switch to complete, then find element
      setTimeout(
        () => {
          const targetElement = document.querySelector(step.target);

          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            // Check if element is visible (not hidden by tab)
            if (rect.width > 0 && rect.height > 0) {
              setTargetPosition(rect);
              setIsReady(true);
              retryCount = 0;

              // Scroll element into view if needed
              targetElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
              return;
            }
          }

          // Element not found or not visible, retry
          if (retryCount < maxRetries) {
            setIsReady(false);
            retryCount++;
            retryTimeout = setTimeout(() => {
              findElement();
            }, 500);
          } else {
            // Max retries reached, show element anyway if it exists (might be off-screen)
            const targetElement = document.querySelector(step.target);
            if (targetElement) {
              const rect = targetElement.getBoundingClientRect();
              setTargetPosition(rect);
              setIsReady(true);
            } else {
              // Element truly doesn't exist, but don't stop the tour
              setIsReady(true);
              setTargetPosition(null);
            }
          }
        },
        step.requiredTab ? 400 : 100,
      ); // Longer delay if tab switching is needed
    };

    const updateTargetPosition = () => {
      const step = steps[currentStep];

      // If in banner mode, don't need to find element
      if (step.bannerMode) {
        setTargetPosition(null);
        setIsReady(true);
        return;
      }

      // Reset retry count when starting a new step
      retryCount = 0;
      findElement();
    };

    // Use setTimeout to avoid synchronous setState within effect
    cleanupTimeout = setTimeout(() => {
      setIsReady(false);
      retryCount = 0;
      updateTargetPosition();
    }, 0);

    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition, true);

    return () => {
      if (cleanupTimeout) clearTimeout(cleanupTimeout);
      if (retryTimeout) clearTimeout(retryTimeout);
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition, true);
      retryCount = 0;
    };
  }, [isOpen, currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onSkip();
  };

  const getTooltipPosition = () => {
    const step = steps[currentStep];
    const placement = step?.placement || "bottom";

    // For banner mode or center placement, position in center of viewport
    if (step.bannerMode || placement === "center") {
      return {
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        transform: "translate(-50%, -50%)",
      };
    }

    // If no target position, center the tooltip
    if (
      !targetPosition ||
      targetPosition.width === 0 ||
      targetPosition.height === 0
    ) {
      return {
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        transform: "translate(-50%, -50%)",
      };
    }

    const padding = 20;
    const tooltipHeight = 300; // Approximate tooltip height
    const viewportHeight = window.innerHeight;

    let position: {
      top: number;
      left: number;
      transform: string;
      maxHeight?: string;
    } = { top: 0, left: 0, transform: "" };

    switch (placement) {
      case "top":
        position = {
          top: targetPosition.top - padding,
          left: targetPosition.left + targetPosition.width / 2,
          transform: "translate(-50%, -100%)",
        };
        break;
      case "bottom":
        position = {
          top: targetPosition.bottom + padding,
          left: targetPosition.left + targetPosition.width / 2,
          transform: "translate(-50%, 0)",
        };
        break;
      case "left":
        position = {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left - padding,
          transform: "translate(-100%, -50%)",
        };
        break;
      case "right":
        position = {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.right + padding,
          transform: "translate(0, -50%)",
        };
      case "left-chat-preview-toggle":
        position = {
          top: targetPosition.top + 50,
          left: targetPosition.left - 165,
          transform: `translate(-${80}%, -50%)`,
        };
        break;

        // Check if tooltip would go off bottom of screen
        const tooltipBottom = position.top + tooltipHeight / 2;
        if (tooltipBottom > viewportHeight - 20) {
          // Adjust to align top instead of center
          position.top = Math.max(20, viewportHeight - tooltipHeight - 20);
          position.transform = "translate(0, 0)";
        }

        // Check if tooltip would go off top of screen
        const tooltipTop = position.top - tooltipHeight / 2;
        if (tooltipTop < 20) {
          position.top = 20;
          position.transform = "translate(0, 0)";
        }
        break;
      case "top-right-corner":
        position = {
          top: targetPosition.top - 200,
          left: targetPosition.right + padding,
          transform: "translate(0, -50%)",
        };
        break;
      default:
        position = {
          top: targetPosition.bottom + padding,
          left: targetPosition.left + targetPosition.width / 2,
          transform: "translate(-50%, 0)",
        };
    }

    return position;
  };

  // Always show tour if open, even if element not ready (will show with null position)
  if (!isOpen) return null;

  const step = steps[currentStep];
  const tooltipPosition = getTooltipPosition();
  const spotlightPadding = step?.spotlightPadding || 8;
  const isBannerMode = step?.bannerMode || step?.placement === "center";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full screen overlay for banner mode, spotlight for regular mode */}
          {isBannerMode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-9998 pointer-events-none bg-black/60  dark:bg-black/70"
            />
          ) : (
            targetPosition &&
            targetPosition.width > 0 &&
            targetPosition.height > 0 && (
              <>
                {/* Overlay - Top section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed left-0 right-0 z-9998 pointer-events-none bg-black/60  dark:bg-black/70"
                  style={{
                    top: 0,
                    height: targetPosition.top - spotlightPadding,
                  }}
                />

                {/* Overlay - Bottom section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed left-0 right-0 z-9998 pointer-events-none  bg-black/60 dark:bg-black/70"
                  style={{
                    top: targetPosition.bottom + spotlightPadding,
                    bottom: 0,
                  }}
                />

                {/* Overlay - Left section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed z-9998 pointer-events-none bg-black/60 dark:bg-black/70 "
                  style={{
                    top: targetPosition.top - spotlightPadding,
                    left: 0,
                    width: targetPosition.left - spotlightPadding,
                    height: targetPosition.height + spotlightPadding * 2,
                  }}
                />

                {/* Overlay - Right section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed z-9998 pointer-events-none bg-black/60 dark:bg-black/70"
                  style={{
                    top: targetPosition.top - spotlightPadding,
                    left: targetPosition.right + spotlightPadding,
                    right: 0,
                    height: targetPosition.height + spotlightPadding * 2,
                  }}
                />

                {/* Highlighted element border */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="fixed z-9999 pointer-events-none"
                  style={{
                    top: targetPosition.top - spotlightPadding,
                    left: targetPosition.left - spotlightPadding,
                    width: targetPosition.width + spotlightPadding * 2,
                    height: targetPosition.height + spotlightPadding * 2,
                    border: "3px solid #3b82f6",
                    // borderRadius: "0px",
                    boxShadow:
                      "0 0 0 4px rgba(59, 130, 246, 0.2), " +
                      "0 0 20px rgba(59, 130, 246, 0.4)",
                  }}
                />
              </>
            )
          )}

          {/* Tooltip */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed z-10000 ${
              isBannerMode ? "max-w-xl" : "max-w-md"
            }`}
            style={{
              ...tooltipPosition,
            }}
          >
            <div
              className={`relative rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 bg-clip-padding shadow-2xl pointer-events-auto flex flex-col gap-4 ${
                isBannerMode ? "p-8" : "p-6"
              }`}
            >
              {/* Close button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleSkip}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
                </button>
              </div>

              {/* Header */}
              <div className="flex flex-col gap-3 pr-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-normal leading-relaxed">
                  {step.content}
                </p>
              </div>

              {/* Divider */}
              <div className="bg-gray-200/60 dark:bg-gray-700/60 h-px w-full"></div>

              {/* Progress indicators */}
              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full flex-1 transition-all duration-500 ${
                      index === currentStep
                        ? "bg-blue-600"
                        : index < currentStep
                          ? "bg-blue-400"
                          : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-4">
                {/* Left side - Step counter */}
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                  Step {currentStep + 1} of {steps.length}
                </span>

                {/* Right side - Action buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSkip}
                    className="h-9 px-4 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 hover:text-gray-500 cursor-pointer dark:text-gray-300 font-medium text-sm"
                  >
                    Skip Tour
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md"
                  >
                    {currentStep === steps.length - 1 ? "Finish" : "Next"}
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="w-4 h-4 ml-1.5"
                    />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
