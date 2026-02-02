import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-indigo-500 dark:outline-indigo-500",
];

// Avatar color palette - distinct colors with good contrast
const avatarColors = [
  { bg: "bg-[#6366F1]", text: "text-[#E0E7FF]" }, // Indigo
  { bg: "bg-[#3B82F6]", text: "text-[#DBEAFE]" }, // Blue
  { bg: "bg-[#8B5CF6]", text: "text-[#EDE9FE]" }, // Purple
  { bg: "bg-[#14B8A6]", text: "text-[#CCFBF1]" }, // Teal
  { bg: "bg-[#EC4899]", text: "text-[#FCE7F3]" }, // Pink
  { bg: "bg-[#F59E0B]", text: "text-[#FEF3C7]" }, // Amber
  { bg: "bg-[#EF4444]", text: "text-[#FEE2E2]" }, // Red
  { bg: "bg-[#10B981]", text: "text-[#D1FAE5]" }, // Green
  { bg: "bg-[#6366F1]", text: "text-[#E0E7FF]" }, // Indigo (repeat for more options)
  { bg: "bg-[#8B5CF6]", text: "text-[#EDE9FE]" }, // Purple (repeat)
];

/**
 * Generate a consistent color pair for an avatar based on a string (name)
 * Returns background and text color classes
 */
export function getAvatarColors(name: string): { bg: string; text: string } {
  if (!name) {
    return avatarColors[0];
  }

  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}
