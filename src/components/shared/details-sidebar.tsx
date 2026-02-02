"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Download01Icon,
  Image01Icon,
  Cancel01Icon,
  File01Icon,
  TextIcon,
  Globe02Icon,
  Delete02Icon,
  Link01Icon,
  Clock01Icon,
  Loading03Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TProcessingStatus } from "@/types/common";
import { useGetAllFilesByAgentId, useDeleteFileById } from "@/hooks/api/file";
import { useGetAllTextsByAgentId, useDeleteTextById } from "@/hooks/api/text";
import {
  useGetAllWebsitesByAgentId,
  useDeleteWebsiteById,
} from "@/hooks/api/website";
import { invalidateQueries } from "@/lib/query-client";
import LinkAIFavicon from "@/assets/images/linkai_favicon.jpeg";
import {
  getActiveTabStyle,
  getAvatarRing,
  getDetailFieldsBg,
  getHeaderBackground,
  getHoverBg,
  getSeparatorColor,
  getSidebarBg,
  getTabsBg,
} from "@/constants/components/details-sidebar";

type DetailField = {
  label: string;
  value: string | ReactNode;
};

type FileItem = {
  name: string;
  size: string;
  date: string;
  time: string;
  preview: string;
};

type TabConfig = {
  value: string;
  label: string;
  icon: ReactNode;
};

type DetailsSidebarProps = {
  avatar: string;
  name: string;
  email?: string | null;
  headerClassName?: string;
  avatarClassName?: string;
  detailFields: DetailField[];
  filesTitle: string;
  files?: FileItem[]; // Legacy prop for backward compatibility
  tabs: TabConfig[];
  emptyTabMessages?: Record<string, string>;
  isOpen?: boolean;
  onClose?: () => void;
  channel?: string;
  // Agent ID to fetch data
  agentId?: string;
  // Pagination (optional, defaults to page 1, limit 10)
  page?: string;
  limit?: string;
  // Search query
  assetSearchQuery?: string;
};

export function DetailsSidebar({
  avatar,
  name,
  email,
  headerClassName,
  avatarClassName,
  detailFields,
  filesTitle,
  files,
  tabs,
  emptyTabMessages = {},
  isOpen = true,
  onClose,
  channel = "email",
  agentId,
  page = "1",
  limit = "10",
  assetSearchQuery = "",
}: DetailsSidebarProps) {
  // Fetch files, texts, and websites data using hooks (must be called before early return)
  const { data: filesDataResponse } = useGetAllFilesByAgentId(
    agentId
      ? {
          agent_id: agentId,
          page,
          limit,
          // populate: "",
        }
      : { agent_id: "" },
    {
      enabled: !!agentId,
    },
  );
  console.log("filesDataResponse in details-sidebar", filesDataResponse);

  const { data: textsDataResponse } = useGetAllTextsByAgentId(
    agentId
      ? {
          agent_id: agentId,
          page,
          limit,
          // populate: "asset",
        }
      : { agent_id: "" },
    {
      enabled: !!agentId,
    },
  );
  console.log("textsDataResponse in details-sidebar", textsDataResponse);
  // console.log("Agent ID in details-sidebar", agentId);

  const { data: websitesDataResponse } = useGetAllWebsitesByAgentId(
    agentId
      ? {
          agent_id: agentId,
          page,
          limit,
          // populate: "asset",
        }
      : { agent_id: "" },
    {
      enabled: !!agentId,
    },
  );
  console.log("websitesDataResponse in details-sidebar", websitesDataResponse);

  // Delete mutations
  const { mutate: deleteFile } = useDeleteFileById({
    onSuccess: () => {
      invalidateQueries({ queryKey: ["useGetAllFilesByAgentId"] });
    },
  });

  const { mutate: deleteText } = useDeleteTextById({
    onSuccess: () => {
      invalidateQueries({ queryKey: ["useGetAllTextsByAgentId"] });
    },
  });

  const { mutate: deleteWebsite } = useDeleteWebsiteById({
    onSuccess: () => {
      invalidateQueries({ queryKey: ["useGetAllWebsitesByAgentId"] });
    },
  });

  // Extract data arrays from responses
  const filesData = filesDataResponse?.data || [];
  const textsData = textsDataResponse?.data || [];
  const websitesData = websitesDataResponse?.data || [];

  console.log("Extracted filesData:", filesData);
  console.log("Extracted textsData:", textsData);
  console.log("Extracted websitesData:", websitesData);

  if (!isOpen) return null;

  // Truncate filename to character limit
  const truncateFileName = (fileName: string, maxLength: number): string => {
    if (fileName.length <= maxLength) return fileName;
    return fileName.substring(0, maxLength) + "...";
  };

  return (
    <section
      className={cn(
        "w-80 max-w-1/4 min-w-[320px] backdrop-blur-2xl shadow-lg rounded-2xl border overflow-y-auto scrollbar-hide",
        "animate-in slide-in-from-right-3 fade-in-0 duration-300",
        getSidebarBg(channel),
      )}
    >
      <div className="relative pb-6">
        {onClose && (
          <Button
            size="icon"
            variant="ghost"
            // rounded="full"
            className="absolute top-4 right-4 z-10 size-8 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        )}
        <div
          className={
            headerClassName ||
            cn(
              "absolute inset-x-0 top-0 h-24 rounded-t-2xl",
              getHeaderBackground(channel),
            )
          }
        />
        <div className="relative flex flex-col items-center px-4 pt-6 gap-3">
          <div
            className={
              avatarClassName ||
              cn(
                "size-40 rounded-2xl overflow-hidden transition-all duration-300",
                getAvatarRing(channel),
              )
            }
          >
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                width={120}
                height={120}
                className="size-40 object-cover"
              />
            ) : (
              <div className="size-40 rounded-xl bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                <Image
                  src={LinkAIFavicon}
                  alt={name}
                  width={120}
                  height={120}
                  className="size-40 object-cover"
                />
              </div>
            )}
          </div>
          <div className="text-center space-y-1">
            <p className="text-xl font-semibold text-gray-900 leading-tight tracking-tight">
              {name}
            </p>
            <p className="text-sm text-gray-500 font-medium">
              {email ?? "No email provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-4">
        <div
          className={cn(
            "rounded-2xl border shadow-sm",
            getDetailFieldsBg(channel),
          )}
        >
          {detailFields.map((field, index) => (
            <div key={field.label}>
              {index > 0 && (
                <Separator className={getSeparatorColor(channel)} />
              )}
              <div
                className={cn(
                  "flex items-start gap-3 p-4 transition-colors duration-200",
                  getHoverBg(channel),
                )}
              >
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {field.label}
                  </p>
                  {typeof field.value === "string" ? (
                    <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-4">
                      {field.value}
                    </p>
                  ) : (
                    field.value
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-linear-to-b  from-white to-gray-50/30 border border-gray-100 shadow-sm py-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="font-semibold text-gray-900 text-base">
                {filesTitle}
              </p>
            </div>
          </div>
          <Tabs defaultValue={tabs[0]?.value || "files"} className="w-full ">
            <TabsList
              className={cn("grid w-full h-11 rounded-xl", getTabsBg(channel))}
              style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "rounded-lg h-9 text-xs font-medium text-gray-600 data-[state=active]:shadow-sm transition-all duration-200 hover:text-gray-900 -space-x-1",
                    getActiveTabStyle(channel),
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.value === "files" && (
                    <span
                      className={cn("text-xs ", getActiveTabStyle(channel))}
                    >
                      {filesData?.length || 0}
                    </span>
                  )}
                  {tab.value === "texts" && (
                    <span
                      className={cn("text-xs ", getActiveTabStyle(channel))}
                    >
                      {textsData?.length || 0}
                    </span>
                  )}
                  {tab.value === "websites" && (
                    <span className={cn("text-xs", getActiveTabStyle(channel))}>
                      {websitesData?.length || 0}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Files Tab */}
            <TabsContent value="files" className="mt-3 w-full">
              <ScrollArea className="w-full max-h-[340px] scroll-smooth">
                <div className="w-full space-y-2 ">
                  {filesData && filesData.length > 0 ? (
                    filesData
                      .filter((file) => {
                        if (!assetSearchQuery) return true;
                        const asset =
                          typeof file.asset === "object" ? file.asset : null;
                        return asset?.name
                          ?.toLowerCase()
                          .includes(assetSearchQuery.toLowerCase());
                      })
                      .map((file) => {
                        console.log("Rendering file item:", file);
                        const asset =
                          typeof file.asset === "object" ? file.asset : null;
                        console.log("File asset:", asset);
                        return (
                          <div
                            key={file._id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/10 transition-all"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-blue-500/10 shrink-0">
                              <HugeiconsIcon
                                icon={File01Icon}
                                className="h-6 w-6 text-blue-600"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {truncateFileName(asset?.name || "", 10)}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {asset?.size_bytes
                                    ? `${(
                                        asset.size_bytes /
                                        1024 /
                                        1024
                                      ).toFixed(2)} MB`
                                    : "Unknown size"}
                                </p>
                                {/* {asset && (
                                  <ProcessingStatusBadge
                                    status={asset.processing_status}
                                  />
                                )} */}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {asset?.url && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    window.open(asset.url, "_blank");
                                  }}
                                  aria-label="Download file"
                                  className="h-8 w-8 hover:bg-blue-500"
                                >
                                  <HugeiconsIcon
                                    icon={Download01Icon}
                                    className="h-4 w-4"
                                  />
                                </Button>
                              )}
                              {agentId && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    deleteFile({ file_id: file._id })
                                  }
                                  aria-label={`Delete ${asset?.name}`}
                                  className="h-8 w-8 hover:bg-red-100"
                                >
                                  <HugeiconsIcon
                                    icon={Delete02Icon}
                                    className="h-4 w-4 text-destructive"
                                  />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                  ) : files && files.length > 0 ? (
                    // Legacy files support
                    files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex w-full items-center justify-center gap-2 p-2.5 rounded-lg bg-red-600 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100/50 last:border-0 group cursor-pointer "
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <Avatar className="size-11 rounded-xl ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
                          <AvatarImage
                            src={file.preview}
                            alt={file.name}
                            className="rounded-xl object-cover"
                          />
                          <AvatarFallback className="rounded-xl bg-gray-100">
                            <HugeiconsIcon
                              icon={Image01Icon}
                              className="size-4 text-gray-500"
                            />
                          </AvatarFallback>
                        </Avatar>
                        <TooltipProvider delayDuration={5000}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex-1 min-w-0 cursor-pointer">
                                <p className="text-[13px] font-semibold text-gray-900 leading-tight truncate line-clamp-1">
                                  {truncateFileName(file.name, 15)}
                                </p>
                                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                                  {file.date}
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p className="break-all">
                                {truncateFileName(file.name, 15)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="size-6 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 opacity-100 p-1">
                          <HugeiconsIcon
                            icon={Download01Icon}
                            className="size-3.5"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <HugeiconsIcon
                        icon={File01Icon}
                        className="h-16 w-16 mx-auto mb-4 opacity-50"
                      />
                      <p className="text-sm font-medium">
                        No files uploaded yet
                      </p>
                      <p className="text-xs mt-1">
                        Upload files to train your agent
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="texts" className="mt-3 w-full">
              <ScrollArea className="w-full max-h-[340px] scroll-smooth">
                <div className="w-full space-y-2">
                  {textsData && textsData.length > 0 ? (
                    textsData
                      .filter((text) => {
                        if (!assetSearchQuery) return true;
                        return text.content
                          ?.toLowerCase()
                          .includes(assetSearchQuery.toLowerCase());
                      })
                      .map((text) => {
                        console.log("Rendering text item:", text);
                        const asset =
                          typeof text.asset === "object" ? text.asset : null;
                        console.log("Text asset:", asset);
                        return (
                          <div
                            key={text._id}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/10 transition-all"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-blue-500/10 shrink-0">
                              <HugeiconsIcon
                                icon={TextIcon}
                                className="h-6 w-6 text-blue-600"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-2">
                                {text.content?.substring(0, 50) || "No content"}
                                ...
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <p className="text-xs text-muted-foreground">
                                  {text.content?.length || 0} characters
                                </p>
                              </div>
                            </div>

                            {agentId && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  deleteText({ text_id: text._id })
                                }
                                aria-label="Delete text"
                                className="h-8 w-8 hover:bg-red-100 shrink-0"
                              >
                                <HugeiconsIcon
                                  icon={Delete02Icon}
                                  className="h-4 w-4 text-destructive"
                                />
                              </Button>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <HugeiconsIcon
                        icon={TextIcon}
                        className="h-16 w-16 mx-auto mb-4 opacity-50"
                      />
                      <p className="text-sm font-medium">
                        No texts uploaded yet
                      </p>
                      <p className="text-xs mt-1">
                        Upload texts to train your agent
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Website Tab */}
            <TabsContent value="websites" className="mt-3 w-full">
              <ScrollArea className="w-full max-h-[340px] scroll-smooth">
                <div className="w-full space-y-2">
                  {websitesData && websitesData.length > 0 ? (
                    websitesData
                      .filter((website) => {
                        if (!assetSearchQuery) return true;
                        return website.urls
                          ?.toLowerCase()
                          .includes(assetSearchQuery.toLowerCase());
                      })
                      .map((website) => {
                        const asset =
                          typeof website.asset === "object"
                            ? website.asset
                            : null;
                        return (
                          <div
                            key={website._id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/10 transition-all"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-green-500/10 shrink-0">
                              <HugeiconsIcon
                                icon={Globe02Icon}
                                className="h-6 w-6 text-green-600"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {truncateFileName(website.urls || "", 25)}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {/* {asset && (
                                  <ProcessingStatusBadge
                                    status={asset.processing_status}
                                  />
                                )} */}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {website.urls && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    window.open(website.urls, "_blank");
                                  }}
                                  aria-label="Visit website"
                                  className="h-8 w-8 hover:bg-blue-500"
                                >
                                  <HugeiconsIcon
                                    icon={Link01Icon}
                                    className="h-4 w-4"
                                  />
                                </Button>
                              )}
                              {agentId && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    deleteWebsite({ website_id: website._id })
                                  }
                                  aria-label={`Delete ${website.urls}`}
                                  className="h-8 w-8 hover:bg-red-100"
                                >
                                  <HugeiconsIcon
                                    icon={Delete02Icon}
                                    className="h-4 w-4 text-destructive"
                                  />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <HugeiconsIcon
                        icon={Globe02Icon}
                        className="h-16 w-16 mx-auto mb-4 opacity-50"
                      />
                      <p className="text-sm font-medium">
                        No websites uploaded yet
                      </p>
                      <p className="text-xs mt-1">
                        Upload websites to train your agent
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
