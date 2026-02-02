"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileEditIcon,
  Upload01Icon,
  Delete02Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Clock01Icon,
  Loading01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
} from "@/components/ui/file-upload";
import { useGetAllFilesByAgentId, useDeleteFileById } from "@/hooks/api/file";
import {
  useGetAllWebsitesByAgentId,
  useDeleteWebsiteById,
} from "@/hooks/api/website";
import { useGetAllTextsByAgentId, useDeleteTextById } from "@/hooks/api/text";
import {
  useCreateFileAsset,
  useCreateTextAsset,
  useCreateWebsiteAsset,
} from "@/hooks/api/asset";
import { useGetAllAgents } from "@/hooks/api/agent";
import { invalidateQueries } from "@/lib/query-client";
import type { TFile } from "@/types/models/file";
import type { TWebsite } from "@/types/models/website";
import type { TText } from "@/types/models/text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "processed":
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5" />
          Processed
        </span>
      );
    case "processing":
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
          <HugeiconsIcon
            icon={Loading01Icon}
            className="h-3.5 w-3.5 animate-spin"
          />
          Processing
        </span>
      );
    case "failed":
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
          <HugeiconsIcon icon={CancelCircleIcon} className="h-3.5 w-3.5" />
          Failed
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
          <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
          Pending
        </span>
      );
  }
};

export default function FilesPage() {
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"files" | "websites" | "text">(
    "files",
  );

  // Get all agents for selection
  const { data: agentsData } = useGetAllAgents();

  // Fetch files with polling for processing files
  const { data: filesData, refetch: refetchFiles } = useGetAllFilesByAgentId(
    { agent_id: selectedAgentId },
    {
      enabled: !!selectedAgentId,
      refetchInterval: (query) => {
        const files = query.state.data?.data as unknown as
          | Array<{ asset?: { processing_status?: string } }>
          | undefined;
        const hasProcessing = files?.some((f) => {
          if (
            f.asset &&
            typeof f.asset === "object" &&
            "processing_status" in f.asset
          ) {
            const status = (f.asset as { processing_status?: string })
              .processing_status;
            return status === "processing" || status === "unprocessed";
          }
          return false;
        });
        return hasProcessing ? 3000 : false;
      },
    },
  );

  // Fetch websites
  const { data: websitesData, refetch: refetchWebsites } =
    useGetAllWebsitesByAgentId(
      { agent_id: selectedAgentId },
      { enabled: !!selectedAgentId },
    );

  // Fetch texts
  const { data: textsData, refetch: refetchTexts } = useGetAllTextsByAgentId(
    { agent_id: selectedAgentId },
    { enabled: !!selectedAgentId },
  );

  // Upload hooks
  const { mutate: uploadFile, isPending: isUploadingFile } = useCreateFileAsset(
    {
      onSuccess: (data) => {
        toast.success(data.message || "File uploaded successfully");
        setUploadFiles([]);
        refetchFiles();
        invalidateQueries({ queryKey: ["useGetAllFilesByAgentId"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to upload file");
      },
    },
  );

  const { mutate: uploadWebsite, isPending: isUploadingWebsite } =
    useCreateWebsiteAsset({
      onSuccess: (data) => {
        toast.success(data.message || "Website uploaded successfully");
        refetchWebsites();
        invalidateQueries({ queryKey: ["useGetAllWebsitesByAgentId"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to upload website");
      },
    });

  const { mutate: uploadText, isPending: isUploadingText } = useCreateTextAsset(
    {
      onSuccess: (data) => {
        toast.success(data.message || "Text uploaded successfully");
        refetchTexts();
        invalidateQueries({ queryKey: ["useGetAllTextsByAgentId"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to upload text");
      },
    },
  );

  // Delete hooks
  const { mutate: deleteFile } = useDeleteFileById({
    onSuccess: (data) => {
      toast.success(data.message || "File deleted successfully");
      refetchFiles();
      invalidateQueries({ queryKey: ["useGetAllFilesByAgentId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete file");
    },
  });

  const { mutate: deleteWebsite } = useDeleteWebsiteById({
    onSuccess: (data) => {
      toast.success(data.message || "Website deleted successfully");
      refetchWebsites();
      invalidateQueries({ queryKey: ["useGetAllWebsitesByAgentId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete website");
    },
  });

  const { mutate: deleteText } = useDeleteTextById({
    onSuccess: (data) => {
      toast.success(data.message || "Text deleted successfully");
      refetchTexts();
      invalidateQueries({ queryKey: ["useGetAllTextsByAgentId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete text");
    },
  });

  const handleUpload = async (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => {
    if (!selectedAgentId) {
      toast.error("Please select an agent first");
      return;
    }

    for (const file of files) {
      uploadFile(
        {
          file,
          agent_id: selectedAgentId,
          onProgress: (progress) => options.onProgress(file, progress),
        },
        {
          onSuccess: () => options.onSuccess(file),
        },
      );
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      deleteFile({ file_id: fileId });
    }
  };

  const handleDeleteWebsite = (websiteId: string) => {
    if (confirm("Are you sure you want to delete this website?")) {
      deleteWebsite({ website_id: websiteId });
    }
  };

  const handleDeleteText = (textId: string) => {
    if (confirm("Are you sure you want to delete this text?")) {
      deleteText({ text_id: textId });
    }
  };

  const files =
    (filesData?.data as unknown as Array<
      TFile & {
        asset?: {
          name?: string;
          size_bytes?: number;
          processing_status?: string;
        };
      }
    >) || [];
  const websites =
    (websitesData?.data as unknown as Array<
      TWebsite & { asset?: { name?: string; processing_status?: string } }
    >) || [];
  const texts =
    (textsData?.data as unknown as Array<
      TText & { asset?: { name?: string; processing_status?: string } }
    >) || [];
  const agents = agentsData?.data || [];

  return (
    <div className="w-full h-full mx-auto flex flex-col gap-6 container pt-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">
            File Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload and manage your documents, websites, and text for AI
            processing
          </p>
        </div>

        {/* Agent Selection */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Agent:</label>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent._id} value={agent._id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "files" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("files")}
            >
              Files
            </Button>
            <Button
              variant={activeTab === "websites" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("websites")}
            >
              Websites
            </Button>
            <Button
              variant={activeTab === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("text")}
            >
              Text
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Section - Only show for files tab */}
      {activeTab === "files" && (
        <Card className="p-6">
          <FileUpload
            value={uploadFiles}
            onValueChange={setUploadFiles}
            onUpload={handleUpload}
            accept=".pdf,.txt,.md,.docx,.xlsx"
            maxFiles={5}
            maxSize={10 * 1024 * 1024} // 10MB
            multiple
            disabled={!selectedAgentId || isUploadingFile}
          >
            <FileUploadDropzone className="min-h-[200px]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Upload01Icon}
                    className="h-6 w-6 text-primary"
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-medium">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, TXT, MD, DOCX, XLSX (max 10MB)
                  </p>
                  {!selectedAgentId && (
                    <p className="text-xs text-destructive mt-2">
                      Please select an agent first
                    </p>
                  )}
                </div>
              </div>
            </FileUploadDropzone>

            <FileUploadList>
              {uploadFiles.map((file) => (
                <FileUploadItem key={file.name} value={file}>
                  <FileUploadItemPreview />
                  <div className="flex-1 min-w-0">
                    <FileUploadItemMetadata />
                    <FileUploadItemProgress className="mt-2" />
                  </div>
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="sm">
                      <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
        </Card>
      )}

      {/* Content List */}
      <div className="flex-1 overflow-y-auto">
        {!selectedAgentId ? (
          <Card className="p-12 flex flex-col items-center justify-center gap-3">
            <HugeiconsIcon
              icon={FileEditIcon}
              className="h-12 w-12 text-muted-foreground"
            />
            <p className="text-sm text-muted-foreground">
              Please select an agent to view files
            </p>
          </Card>
        ) : (
          <motion.div
            className="grid gap-4 pb-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {activeTab === "files" &&
              (files.length === 0 ? (
                <Card className="p-12 flex flex-col items-center justify-center gap-3">
                  <HugeiconsIcon
                    icon={FileEditIcon}
                    className="h-12 w-12 text-muted-foreground"
                  />
                  <p className="text-sm text-muted-foreground">
                    No files uploaded yet
                  </p>
                </Card>
              ) : (
                files.map((file) => (
                  <motion.div key={file._id} variants={item}>
                    <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <HugeiconsIcon
                          icon={FileEditIcon}
                          className="h-5 w-5 text-primary"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {file.asset &&
                          typeof file.asset === "object" &&
                          file.asset &&
                          "name" in file.asset
                            ? (file.asset as { name?: string }).name ||
                              "Untitled"
                            : "Untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.asset &&
                          typeof file.asset === "object" &&
                          file.asset &&
                          "size_bytes" in file.asset &&
                          (file.asset as { size_bytes?: number }).size_bytes
                            ? formatBytes(
                                (file.asset as { size_bytes: number })
                                  .size_bytes,
                              )
                            : "Unknown size"}{" "}
                          • {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {file.asset &&
                          typeof file.asset === "object" &&
                          file.asset &&
                          "processing_status" in file.asset &&
                          (file.asset as { processing_status?: string })
                            .processing_status &&
                          getStatusBadge(
                            (file.asset as { processing_status: string })
                              .processing_status,
                          )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file._id)}
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            className="h-4 w-4 text-destructive"
                          />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ))}

            {activeTab === "websites" &&
              (websites.length === 0 ? (
                <Card className="p-12 flex flex-col items-center justify-center gap-3">
                  <HugeiconsIcon
                    icon={FileEditIcon}
                    className="h-12 w-12 text-muted-foreground"
                  />
                  <p className="text-sm text-muted-foreground">
                    No websites added yet
                  </p>
                </Card>
              ) : (
                websites.map((website) => (
                  <motion.div key={website._id} variants={item}>
                    <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <HugeiconsIcon
                          icon={FileEditIcon}
                          className="h-5 w-5 text-primary"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {website.urls || "Untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(website.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWebsite(website._id)}
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            className="h-4 w-4 text-destructive"
                          />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ))}

            {activeTab === "text" &&
              (texts.length === 0 ? (
                <Card className="p-12 flex flex-col items-center justify-center gap-3">
                  <HugeiconsIcon
                    icon={FileEditIcon}
                    className="h-12 w-12 text-muted-foreground"
                  />
                  <p className="text-sm text-muted-foreground">
                    No text added yet
                  </p>
                </Card>
              ) : (
                texts.map((text) => (
                  <motion.div key={text._id} variants={item}>
                    <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <HugeiconsIcon
                          icon={FileEditIcon}
                          className="h-5 w-5 text-primary"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {text.content?.substring(0, 50) || "Untitled"}
                          {text.content && text.content.length > 50 && "..."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(text.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteText(text._id)}
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            className="h-4 w-4 text-destructive"
                          />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
