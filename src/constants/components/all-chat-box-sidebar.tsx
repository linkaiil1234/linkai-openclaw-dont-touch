import React from "react";
import { TChannel } from "@/types/models/channel";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTelegram } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { InstagramIconGradient } from "@/constants/channel-icons";
import { MdSms } from "react-icons/md";
import { HugeiconsIcon } from "@hugeicons/react";
import { MessageSecure01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";

// Helper function to get channel icon and color
export const getChannelIconAndColor = (
  channel: TChannel,
): { icon: React.ReactNode; color: string } => {
  const channelName = channel.name?.toLowerCase();

  if (channelName === "whatsapp") {
    return {
      icon: <IoLogoWhatsapp size={24} />,
      color: "#25D366",
    };
  }
  if (channelName === "telegram") {
    return {
      icon: <FaTelegram size={24} />,
      color: "#0088cc",
    };
  }
  if (channelName === "facebook") {
    return {
      icon: <FaFacebookSquare size={24} />,
      color: "#1877F2",
    };
  }
  if (channelName === "instagram") {
    return {
      icon: <InstagramIconGradient size={24} />,
      color: "#ffffff",
    };
  }
  if (channelName === "email") {
    return {
      icon: (
        <Image
          src={GmailIcon}
          alt="Gmail"
          width={24}
          height={24}
          className="object-contain"
        />
      ),
      color: "#EA4335",
    };
  }
  if (channelName === "sms") {
    return {
      icon: <MdSms size={24} />,
      color: "#8B5CF6",
    };
  }

  // Default fallback
  return {
    icon: <HugeiconsIcon icon={MessageSecure01Icon} size={24} />,
    color: "#6366F1",
  };
};
