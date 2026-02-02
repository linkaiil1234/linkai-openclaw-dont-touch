import { FaFacebookSquare, FaTelegram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { InstagramIconGradient } from "./channel-icons";
import { CiGlobe } from "react-icons/ci";

export const CREATION_STEPS = [
  { title: "Understanding your prompt" },
  { title: "Drafting the agent voice" },
  { title: "Scaffolding knowledge" },
  { title: "Running safety passes" },
  { title: "Finalizing handoff" },
];

// Channel configurations matching page.tsx icon and color logic
const whatsappConfig = {
  icon: IoLogoWhatsapp,
  colorHex: "#25D366",
  gradientFrom: "from-emerald-500",
  gradientTo: "to-emerald-600",
};

const telegramConfig = {
  icon: FaTelegram,
  colorHex: "#0088cc",
  gradientFrom: "from-sky-500",
  gradientTo: "to-sky-600",
};

const facebookConfig = {
  icon: FaFacebookSquare,
  colorHex: "#1877F2",
  gradientFrom: "from-blue-600",
  gradientTo: "to-blue-700",
};

const instagramConfig = {
  icon: InstagramIconGradient,
  colorHex: "#ffffff",
  gradientFrom: "from-pink-400",
  gradientTo: "to-pink-600",
  isGradientIcon: true,
};

const webchatConfig = {
  icon: CiGlobe,
  colorHex: "#6B46C1",
  gradientFrom: "from-purple-600",
  gradientTo: "to-purple-700",
};

export const AVAILABLE_CHANNELS = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: whatsappConfig.icon,
    color: whatsappConfig.colorHex,
    glowColor: `bg-${whatsappConfig.colorHex}-400/30`,
    gradientFrom: whatsappConfig.gradientFrom,
    gradientTo: whatsappConfig.gradientTo,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: telegramConfig.icon,
    color: telegramConfig.colorHex,
    glowColor: `bg-${telegramConfig.colorHex}-400/30`,
    gradientFrom: telegramConfig.gradientFrom,
    gradientTo: telegramConfig.gradientTo,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: facebookConfig.icon,
    color: facebookConfig.colorHex,
    glowColor: `bg-${facebookConfig.colorHex}-400/30`,
    gradientFrom: facebookConfig.gradientFrom,
    gradientTo: facebookConfig.gradientTo,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: instagramConfig.icon,
    color: "bg-pink-500",
    glowColor: "bg-pink-400/30",
    gradientFrom: instagramConfig.gradientFrom,
    gradientTo: instagramConfig.gradientTo,
    isGradientIcon: true,
  },
  {
    id: "webchat",
    name: "Web Chat",
    icon: webchatConfig.icon,
    color: "#6B46C1",
    glowColor: "bg-purple-400/30",
    gradientFrom: webchatConfig.gradientFrom,
    gradientTo: webchatConfig.gradientTo,
  },
];

// Orbit positions for up to 5 items
export const ORBIT_POSITIONS = [
  { x: -120, y: -80, delay: 0.4 },
  { x: 120, y: -60, delay: 0.5 },
  { x: -100, y: 80, delay: 0.6 },
  { x: 100, y: 100, delay: 0.7 },
  { x: 0, y: -120, delay: 0.8 },
];

export const getStepTitle = (formStep: number, agentName: string) => {
  switch (formStep) {
    case 1:
      return "Create Your AI Agent";
    case 2:
      return `Connect Your Channels to ${agentName}`;
    case 3:
      return `Add Tools & Capabilities to ${agentName}`;
    case 4:
      return `Train Your Agent ${agentName}`;
    case 5:
      return `Creating Your Agent ${agentName}`;
    case 6:
      return `Agent Created! ${agentName}`;
    default:
      return "Set up your AI Agent";
  }
};

export const getStepDescription = (formStep: number) => {
  switch (formStep) {
    case 1:
      return "Give your agent a name and describe what it should do.";
    case 2:
      return "Select the platforms where your agent will interact with customers.";
    case 3:
      return "Enhance your agent with powerful tools and integrations.";
    case 4:
      return "Upload files, add text, or connect websites to train your agent.";
    case 5:
      return "Please wait while we set up your agent...";
    case 6:
      return "Your AI agent is ready to assist customers!";
    default:
      return "";
  }
};
