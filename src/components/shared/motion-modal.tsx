"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type MotionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
};

export const MotionModal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  contentClassName,
  overlayClassName,
  hideCloseButton = false,
  closeOnOverlayClick = true,
}: MotionModalProps) => {
  const labelId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";

    return () => {
      style.overflow = previousOverflow;
    };
  }, [open]);

  const closeModal = () => onOpenChange(false);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: {
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
              },
            },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
        >
          <motion.div
            aria-hidden
            onClick={closeOnOverlayClick ? closeModal : undefined}
            className={cn(
              "absolute inset-0 bg-foreground/60 backdrop-blur-sm",
              overlayClassName,
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? labelId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            className={cn(
              "relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border bg-background shadow-2xl",
              className,
            )}
            initial={{ y: 24, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 28,
              mass: 0.85,
            }}
          >
            <div
              className={cn(
                "flex flex-col gap-4 p-2 h-full overflow-hidden",
                contentClassName,
              )}
            >
              {(title || description) && (
                <div className="space-y-2">
                  {title ? (
                    <h2 id={labelId} className="text-xl font-semibold">
                      {title}
                    </h2>
                  ) : null}
                  {description ? (
                    <p
                      id={descriptionId}
                      className="text-sm text-muted-foreground"
                    >
                      {description}
                    </p>
                  ) : null}
                </div>
              )}

              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
