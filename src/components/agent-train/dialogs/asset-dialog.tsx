import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Database01Icon,
  File01Icon,
  TextIcon,
  Globe02Icon,
  Search01Icon,
  Download01Icon,
  Delete02Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import { TAsset } from "@/types/models/asset";
import { TProcessingStatus } from "@/types/common";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tick02Icon,
  Clock01Icon,
  Loading03Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Loader2 } from "lucide-react";

interface AssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: "files" | "text" | "website";
  onTabChange: (tab: "files" | "text" | "website") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  filesData?: { data?: Array<{ _id: string; asset?: any }> };
  textsData?: { data?: Array<{ _id: string; content?: string; asset?: any }> };
  websitesData?: { data?: Array<{ _id: string; urls?: string; asset?: any }> };
  onDeleteFile: (fileId: string) => void;
  isDeletingFile: string | null;
  onDeleteText: (textId: string) => void;
  isDeletingText: string | null;
  onDeleteWebsite: (websiteId: string) => void;
  isDeletingWebsite: string | null;
  filePage: number;
  textPage: number;
  websitePage: number;
  onFilePageChange: (page: number) => void;
  onTextPageChange: (page: number) => void;
  onWebsitePageChange: (page: number) => void;
  onOpenFilesSheet?: () => void;
  onOpenTextSheet?: () => void;
  onOpenWebsiteSheet?: () => void;
}

// Processing status badge component
const ProcessingStatusBadge = ({ status }: { status: TProcessingStatus }) => {
  const statusConfig = {
    unprocessed: {
      label: "Queued",
      icon: Clock01Icon,
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800",
    },
    processing: {
      label: "Processing",
      icon: Loading03Icon,
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 animate-pulse",
    },
    processed: {
      label: "Ready",
      icon: Tick02Icon,
      className: "bg-green-100 text-green-700 dark:bg-green-900/30",
    },
    failed: {
      label: "Failed",
      icon: Cancel01Icon,
      className: "bg-red-100 text-red-700 dark:bg-red-900/30",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("gap-1", config.className)}>
      <HugeiconsIcon icon={config.icon} className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export const AssetDialog = ({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchQueryChange,
  filesData,
  textsData,
  websitesData,
  onDeleteFile,
  isDeletingFile,
  onDeleteText,
  isDeletingText,
  onDeleteWebsite,
  isDeletingWebsite,
  onOpenFilesSheet,
  onOpenTextSheet,
  onOpenWebsiteSheet,
}: AssetDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-3xl max-h-[85vh] overflow-hidden ">
        <DialogHeader className=" w-full flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Database01Icon} className="h-5 w-5" />
              Knowledge Base Management
            </DialogTitle>
            <DialogDescription>
              View, search, and manage all your training assets
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === "files" && filesData?.data?.length > 0 && (
              <Button size="sm" onClick={() => onOpenFilesSheet?.()}>
                <HugeiconsIcon icon={File01Icon} className="h-4 w-4" />
                Add File
              </Button>
            )}
            {activeTab === "text" && textsData?.data?.length > 0 && (
              <Button size="sm" onClick={() => onOpenTextSheet?.()}>
                <HugeiconsIcon icon={TextIcon} className="h-4 w-4" />
                Add Text
              </Button>
            )}
            {activeTab === "website" && websitesData?.data?.length > 0 && (
              <Button size="sm" onClick={() => onOpenWebsiteSheet?.()}>
                <HugeiconsIcon icon={Globe02Icon} className="h-4 w-4" />
                Add Website
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b pb-3 mb-4">
            <Button
              variant={activeTab === "files" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("files")}
              className="gap-2"
            >
              <HugeiconsIcon icon={File01Icon} className="h-4 w-4" />
              Files ({filesData?.data?.length || 0})
            </Button>
            <Button
              variant={activeTab === "text" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("text")}
              className="gap-2"
            >
              <HugeiconsIcon icon={TextIcon} className="h-4 w-4" />
              Texts ({textsData?.data?.length || 0})
            </Button>
            <Button
              variant={activeTab === "website" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("website")}
              className="gap-2"
            >
              <HugeiconsIcon icon={Globe02Icon} className="h-4 w-4" />
              Websites ({websitesData?.data?.length || 0})
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-9 border"
            />
          </div>

          {/* Content Area */}
          <ScrollArea className="w-full h-96 overflow-y-auto pr-4">
            {activeTab === "files" && (
              <div className="space-y-2">
                {filesData?.data && filesData.data.length > 0 ? (
                  filesData.data
                    .filter((file) => {
                      if (!searchQuery) return true;
                      const asset =
                        typeof file.asset === "object" ? file.asset : null;
                      return asset?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase());
                    })
                    .map((file) => {
                      const asset =
                        typeof file.asset === "object" ? file.asset : null;
                      return (
                        <div
                          key={file._id}
                          className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-blue-500/10">
                            <HugeiconsIcon
                              icon={File01Icon}
                              className="h-6 w-6 text-blue-600"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {asset?.name || "Unnamed file"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {asset?.size_bytes
                                  ? `${(asset.size_bytes / 1024 / 1024).toFixed(
                                      2,
                                    )} MB`
                                  : "Unknown size"}
                              </p>
                              {asset && (
                                <ProcessingStatusBadge
                                  status={asset.processing_status}
                                />
                              )}
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
                              >
                                <HugeiconsIcon
                                  icon={Download01Icon}
                                  className="h-4 w-4"
                                />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteFile(file._id)}
                              aria-label={`Delete ${asset?.name}`}
                              className="hover:bg-gray-200 cursor-pointer"
                              disabled={isDeletingFile === file._id}
                            >
                              {isDeletingFile === file._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <HugeiconsIcon
                                  icon={Delete02Icon}
                                  className="h-4 w-4 text-destructive"
                                />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <HugeiconsIcon
                      icon={File01Icon}
                      className="h-16 w-16 mx-auto mb-4 opacity-50"
                    />
                    <p className="text-sm font-medium">No files uploaded yet</p>
                    <p className="text-xs mt-1">
                      Upload files to train your agent
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        onOpenFilesSheet?.();
                      }}
                      className="mt-4"
                    >
                      Add File
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "text" && (
              <div className="space-y-2">
                {textsData?.data && textsData.data.length > 0 ? (
                  textsData.data
                    .filter((text) => {
                      if (!searchQuery) return true;
                      return text.content
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase());
                    })
                    .map((text) => {
                      const asset =
                        typeof text.asset === "object" ? text.asset : null;
                      return (
                        <div
                          key={text._id}
                          className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-blue-500/10 shrink-0">
                            <HugeiconsIcon
                              icon={TextIcon}
                              className="h-6 w-6 text-blue-600"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">
                              {text.content?.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <p className="text-xs text-muted-foreground">
                                {text.content?.length || 0} characters
                              </p>
                              {asset && (
                                <ProcessingStatusBadge
                                  status={asset.processing_status}
                                />
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteText(text._id)}
                            aria-label="Delete text"
                            className="hover:bg-gray-200 cursor-pointer"
                            disabled={isDeletingText === text._id}
                          >
                            {isDeletingText === text._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <HugeiconsIcon
                                icon={Delete02Icon}
                                className="h-4 w-4 text-destructive"
                              />
                            )}
                          </Button>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <HugeiconsIcon
                      icon={TextIcon}
                      className="h-16 w-16 mx-auto mb-4 opacity-50"
                    />
                    <p className="text-sm font-medium">No text content yet</p>
                    <p className="text-xs mt-1">
                      Add text content to train your agent
                    </p>
                    <Button
                      // variant="secondary"
                      size="sm"
                      onClick={() => {
                        onOpenTextSheet?.();
                        // onOpenChange(false);
                      }}
                      className="mt-4 p-2"
                    >
                      Add Text
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "website" && (
              <div className="space-y-2">
                {websitesData?.data && websitesData.data.length > 0 ? (
                  websitesData.data
                    .filter((website) => {
                      if (!searchQuery) return true;
                      return website.urls
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase());
                    })
                    .map((website) => {
                      const asset =
                        typeof website.asset === "object"
                          ? website.asset
                          : null;
                      return (
                        <div
                          key={website._id}
                          className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-green-500/10">
                            <HugeiconsIcon
                              icon={Globe02Icon}
                              className="h-6 w-6 text-green-600"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {website.urls || "Website"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                                {asset?.name}
                              </p>
                              {asset && (
                                <ProcessingStatusBadge
                                  status={asset.processing_status}
                                />
                              )}
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
                              >
                                <HugeiconsIcon
                                  icon={Link01Icon}
                                  className="h-4 w-4"
                                />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteWebsite(website._id)}
                              aria-label={`Delete ${website.urls}`}
                              className="hover:bg-gray-200 cursor-pointer"
                              disabled={isDeletingWebsite === website._id}
                            >
                              {isDeletingWebsite === website._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <HugeiconsIcon
                                  icon={Delete02Icon}
                                  className="h-4 w-4 text-destructive"
                                />
                              )}
                            </Button>
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
                    <p className="text-sm font-medium">No websites added yet</p>
                    <p className="text-xs mt-1">
                      Add websites to train your agent
                    </p>
                    <Button
                      // variant="secondary"
                      size="sm"
                      onClick={() => {
                        onOpenWebsiteSheet?.();
                        // onOpenChange(false);
                      }}
                      className="mt-4 "
                    >
                      Add Website
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
