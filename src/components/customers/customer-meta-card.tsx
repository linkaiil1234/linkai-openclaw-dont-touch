"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdSms } from "react-icons/md";
import { FaTelegramPlane } from "react-icons/fa";
import Image from "next/image";
import GmailIcon from "@/assets/icons/Gmail Icon 2020.png";
import { InstagramIconGradient } from "@/constants/channel-icons";
import { Edit, Globe2 } from "lucide-react";
import { Button } from "../ui/button";
import { getInitials } from "@/constants/get-initials";

type Customer = {
  id: string;
  name: string;
  thumbnail: string;
  email: string;
  status: string;
  spending: number;
  channels: string[];
  phone?: string;
  location?: string;
};

type CustomerMetaCardProps = {
  customer: Customer;
  onEdit?: () => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    case "Lead":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    case "Inactive":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    case "Blocked":
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
  }
};

const renderChannelIcon = (channelType: string) => {
  switch (channelType) {
    case "whatsapp":
      return <IoLogoWhatsapp className="text-[#25D366] w-4 h-4" />;
    case "web":
      return <Globe2 className="text-gray-700 dark:text-gray-300 w-4 h-4" />;
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
    default:
      return null;
  }
};

export default function CustomerMetaCard({
  customer,
  onEdit,
}: CustomerMetaCardProps) {
  return (
    <div className="p-5 border rounded-2xl lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <Avatar className="size-16 border">
            {customer.thumbnail && (
              <AvatarImage src={customer.thumbnail} alt={customer.name} />
            )}
            <AvatarFallback className="text-base font-medium">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-foreground xl:text-left">
              {customer.name}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <Badge
                variant="outline"
                className={cn(
                  getStatusColor(customer.status),
                  "text-[10px] font-semibold",
                )}
              >
                {customer.status}
              </Badge>
              {customer.location && (
                <>
                  <div className="hidden h-3.5 w-px bg-border xl:block"></div>
                  <p className="text-sm text-muted-foreground">
                    {customer.location}
                  </p>
                </>
              )}
            </div>
          </div>
          {/* <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
            {customer.channels.map((channel, index) => (
              <div
                key={index}
                className="flex items-center justify-center size-11 rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
              >
                {renderChannelIcon(channel)}
              </div>
            ))}
          </div> */}
          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end ">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
