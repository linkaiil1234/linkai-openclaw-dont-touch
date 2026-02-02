import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File01Icon,
  Tick02Icon,
  Clock01Icon,
  Loading03Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TProcessingStatus } from "@/types/common";
import { TAsset } from "@/types/models/asset";

interface FilesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => void;
  assetsData?: { data?: TAsset[] };
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

export const FilesSheet = ({
  open,
  onOpenChange,
  onUpload,
  assetsData,
}: FilesSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={File01Icon} className="h-5 w-5" />
            Upload Training Files
          </SheetTitle>
          <SheetDescription>
            Upload files to train your agent with custom knowledge
          </SheetDescription>
        </SheetHeader>

        <div
          className="mt-6 space-y-4 overflow-y-auto hide-scrollbar pr-2 p-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {/* File Upload Component */}
          <FileUpload
            accept=".pdf,.txt,.md,.csv,.xlsx,.xls,.doc,.docx"
            maxFiles={20}
            maxSize={50 * 1024 * 1024}
            onUpload={onUpload}
            multiple={true}
          >
            <FileUploadDropzone className="min-h-[120px]">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <HugeiconsIcon icon={File01Icon} className="h-8 w-8" />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs mt-1">
                    PDF, TXT, MD, CSV, Excel, Word (max 50MB per file)
                  </p>
                </div>
              </div>
            </FileUploadDropzone>

            <FileUploadList />
          </FileUpload>

          {/* Uploaded Files from API */}
          {assetsData?.data && assetsData.data.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Uploaded Files
              </h4>
              <div className="space-y-2">
                {assetsData.data.map((asset) => (
                  <div
                    key={asset._id}
                    className="flex items-center gap-2.5 rounded-md border p-3 bg-background"
                  >
                    {/* File Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded border bg-accent/50 shrink-0">
                      <HugeiconsIcon icon={File01Icon} className="h-5 w-5" />
                    </div>

                    {/* File Metadata */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {asset.name || "Unnamed file"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {asset.size_bytes
                          ? `${(asset.size_bytes / 1024 / 1024).toFixed(2)} MB`
                          : "Unknown size"}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <ProcessingStatusBadge status={asset.processing_status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!assetsData?.data || assetsData.data.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <HugeiconsIcon
                icon={File01Icon}
                className="h-12 w-12 mx-auto mb-3 opacity-50"
              />
              <p className="text-sm font-medium">
                No training files uploaded yet
              </p>
              <p className="text-xs mt-1">
                Upload files to train your agent with custom knowledge
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
