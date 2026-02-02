import { cn } from "@/lib/utils";

type BlinkerProps = {
  variant?: "success" | "error" | "warning" | "info" | "default";
  size?: "sm" | "md" | "lg";
};
export const Blinker = ({ variant = "default", size = "md" }: BlinkerProps) => {
  const size_of_blinker = {
    sm: "w-2 h-2",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  }[size];
  const color = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    default: "bg-accent",
  }[variant];

  return (
    <div className={cn("rounded-full animate-pulse", color, size_of_blinker)} />
  );
};
