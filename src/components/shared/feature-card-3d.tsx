"use client";

import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ReactNode } from "react";
import logo from "@/assets/images/linkai_favicon.jpeg";
import { TAgent } from "@/types/models/agent";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface FeatureCard3DProps {
  agents?: Pick<TAgent, "_id" | "name" | "description" | "avatar">[];
  name: string;
  description: string;
  iconBgColor?: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  onButtonClick?: () => void;
  onToggle?: (checked: boolean) => void;
  isEnabled?: boolean;
  // For icon - can be either an image URL or a React node
  iconUrl?: string;
  icon?: ReactNode;
  // Optional category badge (for actions page)
  category?: string;
  categoryColor?: string;
  // Optional menu action
  onMenuClick?: () => void;
}

export const FeatureCard3D = ({
  agents = [],
  name,
  description,
  buttonText = "Connect",
  onButtonClick,
  onToggle,
  isEnabled = false,
  iconUrl,
  icon,
  onMenuClick,
}: FeatureCard3DProps) => {
  return (
    <CardContainer className="w-full h-68">
      <CardBody className="w-full h-full">
        <CardItem translateZ="50" className="w-full h-full">
          <article className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 h-full flex flex-col">
            {/* Main Content Section */}
            <div className="relative p-5 pb-9">
              {/* Icon */}
              <CardItem translateZ="100">
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center bg-gray-200/40 p-1">
                  {iconUrl ? (
                    <Image
                      src={iconUrl}
                      alt={`${name} logo`}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    icon
                  )}
                </div>
              </CardItem>

              {/* Title and Description */}
              <CardItem translateZ="60" className="w-full">
                <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
                  {name}
                </h3>
                <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              </CardItem>

              {/* Three-dot menu */}
              {/* <div className="absolute top-5 right-5 h-fit">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-transparent"
                  onClick={onMenuClick}
                >
                  <MoreVertical className="h-6 w-6" />
                </Button>
              </div> */}
            </div>

            {/* Actions Section */}
            <CardItem translateZ="80" className="w-full mt-auto">
              <div className="flex items-center justify-between border-t border-gray-200 p-5 dark:border-gray-800">
                {/* Left side - Settings icon and Details button */}
                <div className="flex gap-3">
                  {agents.length > 0 && (
                    <div className="flex -space-x-1">
                      {agents.slice(0, 5).map((agent) => (
                        <Tooltip key={agent._id}>
                          <TooltipTrigger asChild>
                            <Avatar
                              key={agent._id}
                              className="size-6 border-2 border-gray-200 rounded-full"
                            >
                              <AvatarImage src={logo.src} alt="Agent Avatar" />
                              <AvatarFallback>
                                {agent.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>{agent.name}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side - Toggle button */}
                <Button
                  variant="outline"
                  className="h-9 px-4 rounded-lg hover:bg-gray-800 hover:text-white duration-200 ease-in text-sm cursor-pointer font-medium "
                  onClick={() => {
                    if (onButtonClick) {
                      onButtonClick();
                    } else if (onToggle) {
                      onToggle(!isEnabled);
                    }
                  }}
                >
                  {buttonText}
                </Button>
              </div>
            </CardItem>
          </article>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};
