"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdSms } from "react-icons/md";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import Image from "next/image";
import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";
import { InstagramIconGradient } from "@/constants/channel-icons";
import { Globe2 } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  status: string;
  spending: number;
  channels: string[];
  phone?: string;
  location?: string;
};

type CustomerChannelsCardProps = {
  customer: Customer;
};

const renderChannelIcon = (channelType: string) => {
  switch (channelType) {
    case "whatsapp":
      return <IoLogoWhatsapp className="text-[#25D366] w-4 h-4" />;
    case "telegram":
      return <FaTelegramPlane className="text-[#0088CC] w-4 h-4" />;
    case "email":
      return (
        <Image
          src={GmailIcon}
          alt="Gmail"
          width={16}
          height={16}
          className="w-4 h-4"
        />
      );
    case "sms":
      return <MdSms className="text-gray-700 dark:text-gray-300 w-4 h-4" />;
    case "instagram":
      return <InstagramIconGradient className="size-4" />;
    case "facebook":
      return (
        <FaFacebook className="text-gray-700 dark:text-gray-300 w-4 h-4" />
      );
    case "web":
      return <Globe2 className="text-gray-700 dark:text-gray-300 w-4 h-4" />;
    default:
      return null;
  }
};

const getChannelName = (channelType: string) => {
  switch (channelType) {
    case "whatsapp":
      return "WhatsApp";
    case "telegram":
      return "Telegram";
    case "email":
      return "Email";
    case "sms":
      return "SMS";
    default:
      return channelType;
  }
};

export default function CustomerChannelsCard({
  customer,
}: CustomerChannelsCardProps) {
  return (
    <div className="p-5 border rounded-2xl lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-foreground mb-6">
            Communication Channels
          </h4>

          <div className="flex flex-wrap gap-3">
            <TooltipProvider>
              {customer.channels.map((channel, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center size-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-all cursor-pointer">
                      {renderChannelIcon(channel)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>{getChannelName(channel)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
