"use client";

import { useState, useRef, useEffect } from "react";
import {
  Settings,
  Wand2,
  Send,
  Loader2,
  Sparkles,
  X,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tick02Icon,
  MessageSecure01Icon,
  ArrowDown01Icon,
  Cancel01Icon,
  Database01Icon,
  Add01Icon,
  File01Icon,
  TextIcon,
  Globe02Icon,
  MoreHorizontalIcon,
  ToolsFreeIcons,
  FileVerifiedIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TChannel } from "@/types/models/channel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { TTool } from "@/types/models/tool";
import {
  AllIntegrationsDialog,
  AssetDialog,
  FilesSheet,
  TextSheet,
  WebsiteSheet,
  QnaSheet,
  type QnaBlock,
} from "@/components/agent-train";
import { DisconnectToolDialog } from "@/components/dialog/disconnect-tool-dialog";
import { toast } from "sonner";
import { useUpdateAgent } from "@/hooks/api/agent";
import { invalidateQueries } from "@/lib/query-client";
import { TAgentConfig } from "@/types/models/agent";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from "@/components/ui/file-upload";
import {
  useGetAllAssets,
  useCreateFileAsset,
  useCreateTextAsset,
  useCreateWebsiteAsset,
  useGetCrawlMap,
} from "@/hooks/api/asset";
import { TAsset } from "@/types/models/asset";
import { useGetAllFilesByAgentId, useDeleteFileById } from "@/hooks/api/file";
import { useGetAllTextsByAgentId, useDeleteTextById } from "@/hooks/api/text";
import {
  useGetAllWebsitesByAgentId,
  useDeleteWebsiteById,
} from "@/hooks/api/website";
import { useDeleteMCP } from "@/hooks/api/mcp";
import { TAgentStatus } from "@/types/common";
import EmojiPicker from "emoji-picker-react";
import { Streamdown } from "streamdown";
import { useAuth } from "@/providers/auth-provider";
import DemoUserProfileImage from "@/assets/images/demo-user-profile-image.avif";

type TMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
};

type TEditSettingsPanelProps = {
  editMessages: TMessage[];
  onSendEditMessage: (message: string) => void;
  isEditLoading: boolean;
  streamingContent?: string;
  presets?: Record<
    string,
    {
      name: string;
      messageLength: "short" | "medium" | "long";
      creativity: number;
      nickname: string;
    }
  >;
  selectedPreset?: string | null;
  onSelectPreset?: (preset: string) => void;
  shareUrl?: string;
  onGenerateShare?: () => void;
  socialMediaChannels?: TChannel[];
  tools?: TTool[];
  isChannelConnected?: (channelId: string) => boolean;
  getChannelIconAndColor?: (channel: TChannel) => {
    icon: React.ReactNode;
    color: string;
  };
  isChannelsPanelOpen?: boolean;
  setIsChannelsPanelOpen?: (open: boolean) => void;
  onChannelClick?: (channel: TChannel) => void;
  onShowAllTools?: () => void;
  agentId?: string;
  agentName?: string;
  agentConfig?: TAgentConfig;
  agentBehavior?: {
    agent_calls_you?: string;
    message_length?: "short" | "medium" | "long";
    creativity?: number;
    approved_emojis?: string[];
    blocked_words?: string[];
  };
  onConfigUpdate?: () => void;
};

export default function EditSettingsPanel({
  editMessages,
  onSendEditMessage,
  isEditLoading,
  streamingContent,
  socialMediaChannels: socialMediaTools = [],
  tools: tools = [],
  isChannelConnected,
  getChannelIconAndColor,
  onChannelClick,
  onShowAllTools,
  agentId = "",
  agentName,
  agentConfig,
  agentBehavior,
  onConfigUpdate,
}: TEditSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "settings">("edit");
  const [editInput, setEditInput] = useState("");
  const editEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false);
  const [agentNameState, setAgentNameState] = useState(agentName || "");
  const [agentDescription, setAgentDescription] = useState("");
  const [agentStatus, setAgentStatus] = useState<TAgentStatus>("active");
  const prevAgentNameRef = useRef(agentName);
  const detailsSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMountRef = useRef(true);
  const [behaviorOpen, setBehaviorOpen] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const [isFilesPanelOpen, setIsFilesPanelOpen] = useState(false);

  // All integrations dialog state
  const [showAllIntegrationsDialog, setShowAllIntegrationsDialog] =
    useState(false);

  // Disconnect tool dialog state
  const [showDisconnectToolDialog, setShowDisconnectToolDialog] =
    useState(false);
  const [toolToDisconnect, setToolToDisconnect] = useState<{
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color?: string;
  } | null>(null);

  // Knowledge Base states
  const [openSheet, setOpenSheet] = useState<
    "files" | "text" | "website" | "qna" | null
  >(null);
  const [trainingText, setTrainingText] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [enableCrawl, setEnableCrawl] = useState(false);
  const [crawlMapUrls, setCrawlMapUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [showUrlSelection, setShowUrlSelection] = useState(false);
  const [qnaBlocks, setQnaBlocks] = useState<QnaBlock[]>([]);
  const [isSubmittingQna, setIsSubmittingQna] = useState(false);

  // Asset Dialog States
  const [showAssetDialog, setShowAssetDialog] = useState(false);
  const [assetDialogTab, setAssetDialogTab] = useState<
    "files" | "text" | "website"
  >("files");
  const [assetSearchQuery, setAssetSearchQuery] = useState("");
  const [assetFilePage, setAssetFilePage] = useState(1);
  const [assetTextPage, setAssetTextPage] = useState(1);
  const [assetWebsitePage, setAssetWebsitePage] = useState(1);
  const assetsPerPage = 10;

  // Track which specific ID is being deleted
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [deletingTextId, setDeletingTextId] = useState<string | null>(null);
  const [deletingWebsiteId, setDeletingWebsiteId] = useState<string | null>(
    null,
  );

  const { session } = useAuth();

  const { mutate: updateAgent, isPending: isUpdatingAgent } = useUpdateAgent();

  // Knowledge Base hooks - Assets for FilesSheet
  const { data: assetsData } = useGetAllAssets(
    { type: "file" },
    {
      enabled: !!agentId,
      refetchInterval: (query) => {
        const assets = query.state.data?.data as TAsset[] | undefined;
        const hasProcessing = assets?.some(
          (a) =>
            a.processing_status === "processing" ||
            a.processing_status === "unprocessed",
        );
        return hasProcessing ? 3000 : false;
      },
    },
  );

  // Knowledge Base hooks
  const { data: filesData, refetch: refetchFiles } = useGetAllFilesByAgentId({
    agent_id: agentId,
    page: assetFilePage.toString(),
    limit: assetsPerPage.toString(),
  });

  const { data: textsData, refetch: refetchTexts } = useGetAllTextsByAgentId({
    agent_id: agentId,
    page: assetTextPage.toString(),
    limit: assetsPerPage.toString(),
  });

  const { data: websitesData, refetch: refetchWebsites } =
    useGetAllWebsitesByAgentId({
      agent_id: agentId,
      page: assetWebsitePage.toString(),
      limit: assetsPerPage.toString(),
    });

  const { mutate: deleteFile } = useDeleteFileById({
    onSuccess: (data) => {
      toast.success(data.message || "File deleted successfully");
      refetchFiles();
      invalidateQueries({ queryKey: ["useGetAllFilesByAgentId"] });
      setDeletingFileId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete file");
      setDeletingFileId(null);
    },
  });

  const { mutate: deleteText } = useDeleteTextById({
    onSuccess: (data) => {
      toast.success(data.message || "Text deleted successfully");
      refetchTexts();
      invalidateQueries({ queryKey: ["useGetAllTextsByAgentId"] });
      setDeletingTextId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete text");
      setDeletingTextId(null);
    },
  });

  const { mutate: deleteWebsite } = useDeleteWebsiteById({
    onSuccess: (data) => {
      toast.success(data.message || "Website deleted successfully");
      refetchWebsites();
      invalidateQueries({ queryKey: ["useGetAllWebsitesByAgentId"] });
      setDeletingWebsiteId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete website");
      setDeletingWebsiteId(null);
    },
  });

  const { mutate: createFileAsset } = useCreateFileAsset({
    onSuccess: (data) => {
      toast.success(data.message);
      invalidateQueries({ queryKey: ["useGetAllFilesByAgentId"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: createTextAsset, isPending: isCreatingTextAsset } =
    useCreateTextAsset({
      onSuccess: (data) => {
        toast.success(data.message);
        setTrainingText("");
        invalidateQueries({ queryKey: ["useGetAllTextsByAgentId"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: getCrawlMap, isPending: isGettingCrawlMap } = useGetCrawlMap({
    onSuccess: (data) => {
      const urls = data.data?.links || [];
      setCrawlMapUrls(urls);
      setSelectedUrls(urls); // Select all by default
      setShowUrlSelection(true);
      toast.success(`Found ${urls.length} URLs`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to get crawl map");
    },
  });

  const { mutate: createWebsiteAsset, isPending: isCreatingWebsiteAsset } =
    useCreateWebsiteAsset({
      onSuccess: (data) => {
        toast.success(data.message);
        setWebsiteUrl("");
        setCrawlMapUrls([]);
        setSelectedUrls([]);
        setShowUrlSelection(false);
        invalidateQueries({ queryKey: ["useGetAllWebsitesByAgentId"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  // File upload handler
  const handleFileUpload = async (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => {
    for (const file of files) {
      createFileAsset(
        {
          file,
          agent_id: agentId,
          onProgress: (progress) => options.onProgress(file, progress),
        },
        {
          onSuccess: () => options.onSuccess(file),
          onError: (error) => options.onError(file, new Error(error.message)),
        },
      );
    }
  };

  // Helper to get config IDs
  const getConfigIds = () => {
    const channelsData = agentConfig?.channels || [];
    const toolsData = agentConfig?.tools || [];

    const channelIds = channelsData.map((item: string | { _id: string }) =>
      typeof item === "string" ? item : item._id,
    );
    const toolIds = toolsData.map((item: string | { _id: string }) =>
      typeof item === "string" ? item : item._id,
    );

    return { channelIds, toolIds };
  };

  // Helper to check if tool is connected
  const isToolConnected = (toolId: string) => {
    const { toolIds } = getConfigIds();
    return toolIds.includes(toolId);
  };

  // handle connected tool
  const connectedTools = tools.filter((tool) => isToolConnected(tool._id));

  const { mutate: deleteMCP } = useDeleteMCP({
    onSuccess: (data) => {
      // toast.success(data.message || "MCP disconnected successfully")
      invalidateQueries({ queryKey: ["useGetAgentById", agentId] });
      onConfigUpdate?.();
    },
    onError: (error) => {
      // toast.error(error.message || "")
    },
  });

  // Handle disconnect tool
  const handleDisconnectTool = (
    itemId: string,
    itemName: string,
    type: "channel" | "tool",
  ) => {
    if (!agentId) return;

    const { channelIds, toolIds } = getConfigIds();

    deleteMCP({
      agent_id: agentId,
      tool_id: itemId,
    });

    updateAgent(
      {
        _id: agentId,
        config: {
          channels:
            type === "channel"
              ? channelIds.filter((id) => id !== itemId)
              : channelIds,
          tools:
            type === "tool" ? toolIds.filter((id) => id !== itemId) : toolIds,
        } as TAgentConfig,
      },
      {
        onSuccess: () => {
          toast.success(`${itemName} disconnected successfully`);
          invalidateQueries({ queryKey: ["useGetAgentById", agentId] });
          onConfigUpdate?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to disconnect");
        },
      },
    );
  };

  // Refs to track previous behavior values for sync
  const prevBehaviorRef = useRef(agentBehavior);

  const [messageLength, setMessageLength] = useState<
    "short" | "medium" | "long"
  >(() => agentBehavior?.message_length || "medium");
  const [agentNickname, setAgentNickname] = useState(
    () => agentBehavior?.agent_calls_you || "Boss",
  );
  const [creativity, setCreativity] = useState(
    () => agentBehavior?.creativity ?? 50,
  );
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(() =>
    agentBehavior?.approved_emojis?.length
      ? agentBehavior.approved_emojis
      : ["👍", "❤️", "😊", "🎉", "✨"],
  );
  const [negativeWords, setNegativeWords] = useState<string[]>(
    () => agentBehavior?.blocked_words || [],
  );
  const [newNegativeWord, setNewNegativeWord] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const behaviorSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when agentBehavior changes from external source (e.g., refetch)
  useEffect(() => {
    if (agentBehavior && prevBehaviorRef.current !== agentBehavior) {
      const hasChanged =
        prevBehaviorRef.current?.agent_calls_you !==
          agentBehavior.agent_calls_you ||
        prevBehaviorRef.current?.message_length !==
          agentBehavior.message_length ||
        prevBehaviorRef.current?.creativity !== agentBehavior.creativity ||
        JSON.stringify(prevBehaviorRef.current?.approved_emojis) !==
          JSON.stringify(agentBehavior.approved_emojis) ||
        JSON.stringify(prevBehaviorRef.current?.blocked_words) !==
          JSON.stringify(agentBehavior.blocked_words);

      if (hasChanged) {
        // Intentionally updating state from props to sync external changes (controlled pattern)
        if (
          agentBehavior.agent_calls_you !== undefined &&
          agentBehavior.agent_calls_you !== agentNickname
        ) {
          // eslint-disable-next-line
          setAgentNickname(agentBehavior.agent_calls_you);
        }
        if (
          agentBehavior.message_length !== undefined &&
          agentBehavior.message_length !== messageLength
        ) {
          setMessageLength(agentBehavior.message_length);
        }
        if (
          agentBehavior.creativity !== undefined &&
          agentBehavior.creativity !== creativity
        ) {
          setCreativity(agentBehavior.creativity);
        }
        if (
          agentBehavior.approved_emojis !== undefined &&
          JSON.stringify(agentBehavior.approved_emojis) !==
            JSON.stringify(selectedEmojis)
        ) {
          setSelectedEmojis(agentBehavior.approved_emojis);
        }
        if (
          agentBehavior.blocked_words !== undefined &&
          JSON.stringify(agentBehavior.blocked_words) !==
            JSON.stringify(negativeWords)
        ) {
          setNegativeWords(agentBehavior.blocked_words);
        }
      }

      prevBehaviorRef.current = agentBehavior;
    }
  }, [agentBehavior]);

  // Debounced save function for behavior
  const saveBehavior = (behaviorData: {
    agent_calls_you?: string;
    message_length?: "short" | "medium" | "long";
    creativity?: number;
    approved_emojis?: string[];
    blocked_words?: string[];
  }) => {
    if (!agentId) return;

    // Clear existing timeout
    if (behaviorSaveTimeoutRef.current) {
      clearTimeout(behaviorSaveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    behaviorSaveTimeoutRef.current = setTimeout(() => {
      updateAgent(
        {
          _id: agentId,
          behavior: behaviorData,
        },
        {
          onSuccess: () => {
            toast.success("Behavior settings saved", {
              duration: 1000,
            });
            invalidateQueries({ queryKey: ["useGetAgentById", agentId] });
            onConfigUpdate?.();
          },
          onError: (error) => {
            toast.error(error.message || "Failed to save behavior settings");
          },
        },
      );
    }, 1000); // 1 second debounce
  };

  // Cleanup behavior timeout on unmount
  useEffect(() => {
    return () => {
      if (behaviorSaveTimeoutRef.current) {
        clearTimeout(behaviorSaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    editEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [editMessages]);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  const handleSendEdit = () => {
    if (editInput.trim()) {
      onSendEditMessage(editInput);
      setEditInput("");
    }
  };

  const toggleEmoji = (emoji: string) => {
    const newEmojis = selectedEmojis.includes(emoji)
      ? selectedEmojis.filter((e) => e !== emoji)
      : [...selectedEmojis, emoji];

    setSelectedEmojis(newEmojis);
    saveBehavior({
      agent_calls_you: agentNickname,
      message_length: messageLength,
      creativity: creativity,
      approved_emojis: newEmojis,
      blocked_words: negativeWords,
    });
  };

  const addNegativeWord = () => {
    if (
      newNegativeWord.trim() &&
      !negativeWords.includes(newNegativeWord.trim().toLowerCase())
    ) {
      const newWords = [...negativeWords, newNegativeWord.trim().toLowerCase()];
      setNegativeWords(newWords);
      setNewNegativeWord("");
      saveBehavior({
        agent_calls_you: agentNickname,
        message_length: messageLength,
        creativity: creativity,
        approved_emojis: selectedEmojis,
        blocked_words: newWords,
      });
    }
  };

  const removeNegativeWord = (word: string) => {
    const newWords = negativeWords.filter((w) => w !== word);
    setNegativeWords(newWords);
    saveBehavior({
      agent_calls_you: agentNickname,
      message_length: messageLength,
      creativity: creativity,
      approved_emojis: selectedEmojis,
      blocked_words: newWords,
    });
  };

  // Handle nickname change
  // const handleNicknameChange = (value: string) => {
  //   setAgentNickname(value);
  //   saveBehavior({
  //     agent_calls_you: value,
  //     message_length: messageLength,
  //     creativity: creativity,
  //     approved_emojis: selectedEmojis,
  //     blocked_words: negativeWords,
  //   });
  // };

  // Handle message length change
  const handleMessageLengthChange = (length: "short" | "medium" | "long") => {
    setMessageLength(length);
    saveBehavior({
      agent_calls_you: agentNickname,
      message_length: length,
      creativity: creativity,
      approved_emojis: selectedEmojis,
      blocked_words: negativeWords,
    });
  };

  // Handle creativity change
  const handleCreativityChange = (value: number) => {
    setCreativity(value);
    saveBehavior({
      agent_calls_you: agentNickname,
      message_length: messageLength,
      creativity: value,
      approved_emojis: selectedEmojis,
      blocked_words: negativeWords,
    });
  };

  // Sync agentName prop to state when it changes externally
  // This is necessary to sync external prop changes to internal editable state
  useEffect(() => {
    if (
      agentName &&
      agentName !== prevAgentNameRef.current &&
      agentName !== agentNameState
    ) {
      prevAgentNameRef.current = agentName;
      // eslint-disable-next-line
      setAgentNameState(agentName);
    }
  }, [agentName]);

  // Debounced save function for agent details
  const saveAgentDetails = () => {
    if (!agentId) return;

    // Clear existing timeout
    if (detailsSaveTimeoutRef.current) {
      clearTimeout(detailsSaveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    detailsSaveTimeoutRef.current = setTimeout(() => {
      updateAgent(
        {
          _id: agentId,
          name: agentNameState,
          description: agentDescription,
          status: agentStatus,
        },
        {
          onSuccess: () => {
            toast.success("Agent details saved");
            invalidateQueries({ queryKey: ["useGetAgentById", agentId] });
            // onConfigUpdate?.()
          },
          onError: (error) => {
            toast.error(error.message || "Failed to save agent details");
          },
        },
      );
    }, 1000); // 1 second debounce
  };

  // Save agent details when they change
  useEffect(() => {
    // Skip save on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    if (agentId && (agentNameState || agentDescription || agentStatus)) {
      saveAgentDetails();
    }
  }, [agentNameState, agentDescription, agentStatus]);

  // Cleanup details timeout on unmount
  useEffect(() => {
    return () => {
      if (detailsSaveTimeoutRef.current) {
        clearTimeout(detailsSaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={` w-96 h-full bg-white flex flex-col border-r border-slate-100 transition-all duration-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
    >
      <div className="p-3 border-b border-slate-100 flex items-center justify-center">
        <span className="text-2xl text-center tracking-tight font-semibold text-slate-600">
          Improve your Agent
        </span>
      </div>
      <div className="flex p-1.5 gap-1 bg-slate-50/80 border-b border-slate-100">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
            activeTab === "edit"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Wand2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
            activeTab === "settings"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {activeTab === "edit" ? (
        <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
          <div className="p-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 text-xs font-medium text-slate-700"
                // onClick={() => setShowKnowledgeBasePanel(true)}
                onClick={() => setShowAssetDialog(true)}
              >
                {/* <Database className="w-3.5 h-3.5 text-slate-500" /> */}
                Training Files
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 text-xs font-medium text-slate-700"
                // onClick={() => setIsChannelsPanelOpen?.(true)}
                onClick={onShowAllTools}
              >
                {/* <Puzzle className="w-3.5 h-3.5 text-slate-500" /> */}
                Channels
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 text-xs font-medium text-slate-700"
                onClick={() => setShowAllIntegrationsDialog(true)}
              >
                Tools
              </button>
            </div>
          </div>

          <div className="edit-ai-agent flex-1 overflow-y-auto p-4">
            {editMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-2">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200/50 flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="font-semibold text-slate-800 text-[15px] mb-1.5">
                  Edit with AI
                </h3>
                <p className="text-xs text-slate-500 mb-5 max-w-[180px] leading-relaxed">
                  Describe how you want to change your agent behavior
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {["Make it shorter", "Be friendly", "Add emojis"].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setEditInput(suggestion)}
                        className="px-3 py-2 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-slate-600 text-xs rounded-full transition-all duration-200 active:scale-[0.98]"
                      >
                        {suggestion}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {editMessages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-medium ${
                        message.role === "user"
                          ? "bg-blue-500 text-white border-none"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {message.role === "user" ? (
                        <Image
                          src={DemoUserProfileImage}
                          alt="user"
                          width={32}
                          height={32}
                          className="w-full h-full object-contain "
                        />
                      ) : (
                        <Wand2 className="w-3 h-3" />
                      )}
                    </div>
                    <Streamdown
                      components={{
                        ul: ({ children }) => (
                          <ul className="ml-4">{children}</ul>
                        ),
                      }}
                      className={` px-3 py-2.5 rounded-xl text-xs leading-relaxed ${
                        message.role === "user"
                          ? "bg-blue-500 text-white max-w-[85%]"
                          : "bg-slate-50 text-slate-800 border border-slate-100"
                      }`}
                    >
                      {message.content}
                    </Streamdown>
                  </div>
                ))}
                {isEditLoading && streamingContent && (
                  <div className="flex gap-2.5 animate-in fade-in duration-300">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Wand2 className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl max-w-[85%]">
                      <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {streamingContent}
                        <span className="inline-block w-1 h-3 bg-blue-500 animate-pulse ml-1" />
                      </div>
                    </div>
                  </div>
                )}
                {isEditLoading && !streamingContent && (
                  <div className="flex gap-2.5 animate-in fade-in duration-300">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Wand2 className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                      <span className="text-xs text-slate-600">
                        Thinking...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={editEndRef} />
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="relative">
              <input
                type="text"
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendEdit()}
                placeholder="Describe changes..."
                className="w-full pl-3.5 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all duration-200"
              />
              <button
                onClick={handleSendEdit}
                disabled={!editInput.trim() || isEditLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white disabled:opacity-40 transition-all duration-200 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <AllIntegrationsDialog
            open={showAllIntegrationsDialog}
            onOpenChange={setShowAllIntegrationsDialog}
            agentId={agentId}
            agentConfig={agentConfig}
            tools={tools.map((tool) => ({
              ...tool,
              icon_url: tool.icon_url,
              isConnected: isToolConnected(tool._id),
            }))}
          />
          <AssetDialog
            open={showAssetDialog}
            onOpenChange={setShowAssetDialog}
            activeTab={assetDialogTab}
            onTabChange={setAssetDialogTab}
            searchQuery={assetSearchQuery}
            onSearchQueryChange={setAssetSearchQuery}
            filesData={filesData}
            textsData={textsData}
            websitesData={websitesData}
            onDeleteFile={(fileId) => {
              setDeletingFileId(fileId);
              deleteFile({ file_id: fileId });
            }}
            isDeletingFile={deletingFileId}
            onDeleteText={(textId) => {
              setDeletingTextId(textId);
              deleteText({ text_id: textId });
            }}
            isDeletingText={deletingTextId}
            onDeleteWebsite={(websiteId) => {
              setDeletingWebsiteId(websiteId);
              deleteWebsite({ website_id: websiteId });
            }}
            isDeletingWebsite={deletingWebsiteId}
            filePage={assetFilePage}
            textPage={assetTextPage}
            websitePage={assetWebsitePage}
            onFilePageChange={setAssetFilePage}
            onTextPageChange={setAssetTextPage}
            onWebsitePageChange={setAssetWebsitePage}
          />
          <>
            <FilesSheet
              open={openSheet === "files"}
              onOpenChange={(open) => !open && setOpenSheet(null)}
              onUpload={handleFileUpload}
              assetsData={assetsData as { data?: TAsset[] } | undefined}
            />
            <TextSheet
              open={openSheet === "text"}
              onOpenChange={(open) => !open && setOpenSheet(null)}
              text={trainingText}
              onTextChange={setTrainingText}
              onSubmit={() => {
                if (!trainingText.trim()) return;
                createTextAsset({
                  text: trainingText,
                  agent_id: agentId,
                });
              }}
              isSubmitting={isCreatingTextAsset}
            />
            <WebsiteSheet
              open={openSheet === "website"}
              onOpenChange={(open) => !open && setOpenSheet(null)}
              websiteUrl={websiteUrl}
              onWebsiteUrlChange={setWebsiteUrl}
              enableCrawl={enableCrawl}
              onEnableCrawlChange={setEnableCrawl}
              showUrlSelection={showUrlSelection}
              onShowUrlSelectionChange={setShowUrlSelection}
              crawlMapUrls={crawlMapUrls}
              onCrawlMapUrlsChange={setCrawlMapUrls}
              selectedUrls={selectedUrls}
              onSelectedUrlsChange={setSelectedUrls}
              isGettingCrawlMap={isGettingCrawlMap}
              isCreatingWebsiteAsset={isCreatingWebsiteAsset}
              onGetCrawlMap={(url) => getCrawlMap({ url })}
              onCreateWebsiteAsset={(urls) => {
                createWebsiteAsset({
                  urls,
                  agent_id: agentId,
                });
              }}
              onValidateUrl={(url) => {
                if (!url.trim()) {
                  return {
                    isValid: false,
                    errorMessage: "Please enter a valid URL",
                  };
                }
                return { isValid: true };
              }}
            />
            <AssetDialog
              open={showAssetDialog}
              onOpenChange={setShowAssetDialog}
              activeTab={assetDialogTab}
              onTabChange={setAssetDialogTab}
              searchQuery={assetSearchQuery}
              onSearchQueryChange={setAssetSearchQuery}
              filesData={filesData}
              textsData={textsData}
              websitesData={websitesData}
              onDeleteFile={(fileId) => {
                setDeletingFileId(fileId);
                deleteFile({ file_id: fileId });
              }}
              isDeletingFile={deletingFileId}
              onDeleteText={(textId) => {
                setDeletingTextId(textId);
                deleteText({ text_id: textId });
              }}
              isDeletingText={deletingTextId}
              onDeleteWebsite={(websiteId) => {
                setDeletingWebsiteId(websiteId);
                deleteWebsite({ website_id: websiteId });
              }}
              isDeletingWebsite={deletingWebsiteId}
              filePage={assetFilePage}
              textPage={assetTextPage}
              websitePage={assetWebsitePage}
              onFilePageChange={setAssetFilePage}
              onTextPageChange={setAssetTextPage}
              onWebsitePageChange={setAssetWebsitePage}
              onOpenFilesSheet={() => setOpenSheet("files")}
              onOpenTextSheet={() => setOpenSheet("text")}
              onOpenWebsiteSheet={() => setOpenSheet("website")}
            />
            <QnaSheet
              open={openSheet === "qna"}
              onOpenChange={(open) => !open && setOpenSheet(null)}
              qnaBlocks={qnaBlocks}
              onQnaBlocksChange={setQnaBlocks}
              onSubmit={(formattedText) => {
                setIsSubmittingQna(true);
                createTextAsset(
                  {
                    text: formattedText,
                    agent_id: agentId,
                  },
                  {
                    onSuccess: (data) => {
                      toast.success(data.message);
                      setQnaBlocks([]);
                      setIsSubmittingQna(false);
                    },
                    onError: (error) => {
                      toast.error(error.message);
                      setIsSubmittingQna(false);
                    },
                  },
                );
              }}
              isSubmitting={isSubmittingQna}
            />

            {/* Disconnect Tool Dialog */}
            <DisconnectToolDialog
              open={showDisconnectToolDialog}
              onOpenChange={setShowDisconnectToolDialog}
              tool={toolToDisconnect}
              onConfirmDisconnect={(toolId, toolName) => {
                handleDisconnectTool(toolId, toolName, "tool");
              }}
              isDisconnecting={false}
            />
          </>
        </div>
      ) : (
        <div className="flex-1 space-y-2 py-2 px-1 overflow-y-auto animate-in fade-in duration-300 bg-[#f1f1f171]">
          {/* behavior section */}
          <Collapsible
            defaultOpen={false}
            open={behaviorOpen}
            onOpenChange={setBehaviorOpen}
            className="behavior-section bg-card/80 backdrop-blur-xl border-b rounded-2xl shadow-lg border-border/50 overflow-hidden"
          >
            <div className="p-4 border-b border-border/50 ">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between hover:bg-gray-200/60 hover:text-gray-800 transition-all duration-200 p-2 cursor-pointer"
                  aria-label="Toggle behavior panel"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="font-semibold">Behavior</span>
                    {/* {isSavingBehavior && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    )}
                     */}
                  </div>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      behaviorOpen && "rotate-180",
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 space-y-4">
                {/* <div>
                  <label className="text-[10px] font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
                    Agent calls you
                  </label>
                  <input
                    type="text"
                    value={agentNickname}
                    onChange={(e) => handleNicknameChange(e.target.value)}
                    placeholder="Boss, Friend, Sir..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-300 transition-all duration-200"
                  />
                </div> */}

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
                    Message Length
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["short", "medium", "long"] as const).map((length) => (
                      <button
                        key={length}
                        onClick={() => handleMessageLengthChange(length)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                          messageLength === length
                            ? "bg-blue-500 text-white shadow-sm"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {length.charAt(0).toUpperCase() + length.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Creativity
                    </label>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {creativity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={creativity}
                    onChange={(e) =>
                      handleCreativityChange(Number(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                    <span>Focused</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
                    Approved Emojis
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedEmojis.length > 0 ? (
                      selectedEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => toggleEmoji(emoji)}
                          className="w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all duration-200 active:scale-90 bg-blue-500 shadow-sm hover:bg-blue-600 relative group"
                        >
                          {emoji}
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <X className="w-2 h-2 text-white" />
                          </span>
                        </button>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No emojis selected
                      </span>
                    )}
                  </div>
                  <Popover
                    open={isEmojiPickerOpen}
                    onOpenChange={setIsEmojiPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <button className="px-3 py-2 mt-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5">
                        <Smile className="w-3.5 h-3.5" />
                        Add Emoji
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-0"
                      align="start"
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          if (!selectedEmojis.includes(emojiData.emoji)) {
                            toggleEmoji(emojiData.emoji);
                          }
                          setIsEmojiPickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
                    Blocked Words
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {negativeWords.map((word) => (
                      <span
                        key={word}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-100 text-red-600 text-[11px] font-medium rounded-md"
                      >
                        {word}
                        <button
                          onClick={() => removeNegativeWord(word)}
                          className="hover:bg-red-100 rounded p-0.5 transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newNegativeWord}
                      onChange={(e) => setNewNegativeWord(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addNegativeWord()}
                      placeholder="Add word..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-300 transition-all duration-200"
                    />
                    <button
                      onClick={addNegativeWord}
                      disabled={!newNegativeWord.trim()}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg disabled:opacity-40 transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Channels Section */}
          {socialMediaTools && socialMediaTools.length > 0 && (
            <Collapsible
              open={channelsOpen}
              onOpenChange={setChannelsOpen}
              defaultOpen={false}
              className="bg-card/80 rounded-2xl shadow-lg border border-border/50 overflow-hidden"
            >
              <div className="p-4 border-b border-border/50 channels-section">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between hover:bg-gray-200/60 hover:text-gray-800 transition-all duration-200 p-2 cursor-pointer"
                    aria-label="Toggle channels panel"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <HugeiconsIcon
                          icon={MessageSecure01Icon}
                          className="w-4 h-4 text-emerald-500"
                        />
                      </div>
                      <span className="font-semibold">Integrate channels</span>
                      {/* {isUpdatingAgent && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500 ml-2" />
                      )} */}
                      {socialMediaTools.filter(
                        (ch) => ch.name?.toLowerCase() !== "playground",
                      ).length > 0 &&
                        !isUpdatingAgent && (
                          <Badge variant="secondary" className="ml-2">
                            {
                              socialMediaTools
                                .filter(
                                  (ch) =>
                                    ch.name?.toLowerCase() !== "playground",
                                )
                                .filter((ch) => isChannelConnected(ch._id))
                                .length
                            }
                            /
                            {
                              socialMediaTools.filter(
                                (ch) => ch.name?.toLowerCase() !== "playground",
                              ).length
                            }
                          </Badge>
                        )}
                    </div>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        channelsOpen && "rotate-180",
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 overflow-y-auto">
                  <div className="space-y-4 h-72 overflow-y-auto hide-scrollbar">
                    {/* Channel Integration Grid - 2 per row, 4 total */}
                    <div className=" w-full  grid grid-cols-2 gap-3 pt-3 mx-auto">
                      {/* Other Channels - Filter out Playground */}
                      {socialMediaTools
                        .filter(
                          (channel) =>
                            channel.name?.toLowerCase() !== "playground",
                        )
                        .slice(0, 4)
                        .map((channel) => {
                          const isConnected = isChannelConnected(channel._id);
                          const { icon, color } =
                            getChannelIconAndColor(channel);

                          return (
                            <div
                              key={channel._id}
                              onClick={() => onChannelClick?.(channel)}
                              className={cn(
                                "relative rounded-xl p-3 cursor-pointer transition-all border-none duration-200 border-2",
                                isConnected
                                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 hover:bg-green-100/50 dark:hover:bg-green-900/30"
                                  : "bg-foreground/5 border-border/50 hover:bg-foreground/10 hover:border-primary/30",
                              )}
                            >
                              {/* Connected Badge */}
                              {isConnected && (
                                <div className="absolute top-2 right-5 size-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                                  <HugeiconsIcon
                                    icon={Tick02Icon}
                                    className="size-3.5 text-white"
                                  />
                                </div>
                              )}

                              {/* Icon */}
                              <div className="flex items-center justify-center mb-2">
                                <div
                                  className="flex size-12 items-center justify-center rounded-lg"
                                  style={{
                                    color: color,
                                  }}
                                >
                                  {icon}
                                </div>
                              </div>

                              {/* Channel Name */}
                              <h4 className="text-sm font-semibold text-center truncate">
                                {channel.name || "Channel"}
                              </h4>
                            </div>
                          );
                        })}
                    </div>

                    {/* Show More Integrations Button */}
                    {/* {socialMediaTools.filter(
                    (channel) => channel.name?.toLowerCase() !== "playground"
                  ).length > 4 && ( */}
                    <Button
                      variant="outline"
                      onClick={onShowAllTools}
                      className="w-full text-sm font-medium hover:bg-primary/50 border-dashed gap-2"
                    >
                      More Channels Integrations
                    </Button>
                    {/* )} */}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}

          {/* tools section */}
          {tools && tools.length > 0 && (
            <Collapsible
              open={isToolsPanelOpen}
              onOpenChange={setIsToolsPanelOpen}
              className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border/50 overflow-hidden"
            >
              <div className="p-4 border-b border-border/50 tools-section">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between hover:bg-gray-200/60 hover:text-gray-800 transition-all duration-200 p-2 cursor-pointer"
                    aria-label="Toggle tools panel"
                  >
                    <div className="flex items-center gap-2 ">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <HugeiconsIcon
                          icon={ToolsFreeIcons}
                          className="size-4 text-blue-500"
                        />
                      </div>
                      <span className="font-semibold">
                        Integrate with tools
                      </span>
                      {/* {isUpdatingAgent && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 ml-2" />
                      )} */}
                      {connectedTools.length > 0 && !isUpdatingAgent && (
                        <Badge variant="secondary" className="ml-2">
                          {connectedTools.length}
                        </Badge>
                      )}
                    </div>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isToolsPanelOpen && "rotate-180",
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-4 h-[300px] overflow-y-auto hide-scrollbar flex flex-col justify-between pr-2 py-2">
                  {/* Connected Tools */}
                  {connectedTools.length > 0 ? (
                    <div className="space-y-3">
                      <div className="bg-background dark:bg-muted/50 rounded-xl border shadow-lg overflow-hidden">
                        <div className="divide-y divide-border/50">
                          {connectedTools.slice(0, 4).map((tool, index) => (
                            <div
                              key={tool._id}
                              className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 hover:bg-muted/50 transition-all duration-300  border-dotted border-gray-400 "
                              style={{
                                animation: `slideIn 0.3s ease-out ${
                                  index * 0.1
                                }s both`,
                              }}
                            >
                              <div
                                className="flex size-12 items-center justify-center rounded-lg border border-foreground/5 bg-muted transition-all duration-200"
                                style={{
                                  backgroundColor: `${(tool as any).color || "#6366F1"}10`,
                                }}
                              >
                                {tool.icon_url ? (
                                  <Image
                                    src={tool.icon_url}
                                    alt={tool.name || "Tool"}
                                    width={24}
                                    height={24}
                                    className="size-6 object-contain"
                                  />
                                ) : (
                                  <div
                                    style={{
                                      color: (tool as any).color || "#6366F1",
                                    }}
                                  >
                                    {(tool as any).icon || "🔧"}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <h3 className="text-sm font-medium truncate">
                                  {tool.name}
                                </h3>
                                <p className="text-muted-foreground line-clamp-1 text-xs flex items-center gap-1.5">
                                  <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                                  Connected & Active
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setToolToDisconnect({
                                    _id: tool._id,
                                    name: tool.name,
                                    icon: (tool as any).icon,
                                    icon_url: (tool as any).icon_url,
                                    color: (tool as any).color,
                                  });
                                  setShowDisconnectToolDialog(true);
                                }}
                                aria-label={`Disconnect ${tool.name}`}
                                className="size-9 rounded-disconnect bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 hover:bg-red-100 dark:hover:bg-red-950 hover:border-red-200 dark:hover:border-red-900/50 animate-pulse-slow transition-all duration-200 group/btn"
                              >
                                <HugeiconsIcon
                                  icon={Tick02Icon}
                                  className="size-4 text-green-600 dark:text-green-400 group-hover/btn:hidden"
                                />
                                <HugeiconsIcon
                                  icon={Cancel01Icon}
                                  className="size-4 text-red-600 dark:text-red-400 hidden group-hover/btn:block"
                                />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm mb-3">No tools connected yet</p>
                    </div>
                  )}

                  {/* Add Tool Button */}
                  {connectedTools.length < tools.length && (
                    <Button
                      variant="outline"
                      onClick={() => setShowAllIntegrationsDialog(true)}
                      className="w-full text-sm font-medium hover:bg-primary/50 border-dashed gap-2"
                    >
                      More Integrations
                    </Button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Knowledge Base Section */}
          {agentId && (
            <Collapsible
              open={isFilesPanelOpen}
              onOpenChange={setIsFilesPanelOpen}
              className="knowledge-base-section bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border/50 overflow-hidden"
            >
              <div className="p-4 border-b border-border/50">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between hover:bg-gray-200/60 hover:text-gray-800 transition-all duration-200 p-2 cursor-pointer"
                    aria-label="Toggle training files panel"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                        <HugeiconsIcon
                          icon={FileVerifiedIcon}
                          className="size-4 text-yellow-500"
                        />
                      </div>
                      <span className="font-semibold">Knowledge Base</span>
                      <Badge variant="secondary" className="ml-2">
                        {(filesData?.data?.length || 0) +
                          (textsData?.data?.length || 0) +
                          (websitesData?.data?.length || 0)}
                      </Badge>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isFilesPanelOpen && "rotate-180",
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="px-4 pb-4 pt-2">
                <div className="space-y-3">
                  {/* File Upload Dropzone */}
                  <FileUpload
                    accept=".pdf,.txt,.md,.csv,.xlsx,.xls,.doc,.docx"
                    maxSize={50 * 1024 * 1024}
                    multiple
                    onUpload={handleFileUpload}
                  >
                    <FileUploadDropzone className="min-h-[100px]">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <HugeiconsIcon icon={File01Icon} className="h-6 w-6" />
                        <div className="text-center">
                          <p className="text-xs font-medium">
                            Drop files or click to browse
                          </p>
                          <p className="text-[10px] mt-0.5">
                            PDF, TXT, MD, CSV, Excel, Word
                          </p>
                        </div>
                      </div>
                    </FileUploadDropzone>
                    <FileUploadList />
                  </FileUpload>

                  {/* Asset Type Icons with Count */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <HugeiconsIcon
                          icon={File01Icon}
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Files</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {filesData?.data?.length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <HugeiconsIcon
                          icon={TextIcon}
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Texts</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {textsData?.data?.length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <HugeiconsIcon
                          icon={Globe02Icon}
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Websites
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {websitesData?.data?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenSheet("text")}
                      className="text-xs gap-1.5"
                    >
                      <HugeiconsIcon icon={TextIcon} className="h-3.5 w-3.5" />
                      Add Text
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenSheet("website")}
                      className="text-xs gap-1.5"
                    >
                      <HugeiconsIcon
                        icon={Globe02Icon}
                        className="h-3.5 w-3.5"
                      />
                      Add URL
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenSheet("qna")}
                      className="text-xs gap-1.5"
                    >
                      <HugeiconsIcon
                        icon={MessageSecure01Icon}
                        className="h-3.5 w-3.5"
                      />
                      Add Q&A
                    </Button>
                  </div>

                  {/* Show More Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowAssetDialog(true)}
                    className="w-full text-sm font-medium hover:bg-primary/60 border-dashed gap-2"
                  >
                    <HugeiconsIcon
                      icon={MoreHorizontalIcon}
                      className="h-4 w-4"
                    />
                    Show More Details
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* agent-details section */}
          <Collapsible
            defaultOpen={false}
            open={agentDetailsOpen}
            onOpenChange={setAgentDetailsOpen}
            className="agent-details-section bg-card/80 backdrop-blur-xl border-b rounded-2xl shadow-lg border-border/50 overflow-hidden"
          >
            <div className="p-4 border-b border-border/50 ">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between hover:bg-gray-200/60 hover:text-gray-800 transition-all duration-200 p-2 cursor-pointer"
                  aria-label="agent details panel"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="font-semibold">Agent Details</span>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      agentDetailsOpen && "rotate-180",
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
                    Agent Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={agentNameState}
                      onChange={(e) => setAgentNameState(e.target.value)}
                      placeholder="Agent Name"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-300 transition-all duration-200"
                    />
                    {/* {isUpdatingAgent && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 absolute right-2 top-1/2 -translate-y-1/2" />
                    )} */}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
                    Agent Description
                  </label>
                  <div className="relative">
                    <textarea
                      value={agentDescription}
                      onChange={(e) => setAgentDescription(e.target.value)}
                      placeholder="Agent Description"
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-300 transition-all duration-200 resize-none"
                    />
                    {/* {isUpdatingAgent && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 absolute right-2 top-1/2 -translate-y-1/2" />
                    )} */}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
                    Agent Status
                  </label>
                  <div className="relative">
                    <Select
                      value={agentStatus}
                      onValueChange={(value) =>
                        setAgentStatus(value as TAgentStatus)
                      }
                    >
                      <SelectTrigger className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-300 transition-all duration-200 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* All Integrations Dialog */}
          <AllIntegrationsDialog
            open={showAllIntegrationsDialog}
            onOpenChange={setShowAllIntegrationsDialog}
            agentId={agentId}
            agentConfig={agentConfig}
            tools={tools.map((tool) => ({
              ...tool,
              icon_url: tool.icon_url,
              isConnected: isToolConnected(tool._id),
            }))}
          />

          {/* Knowledge Base Sheets and Dialogs */}
          {agentId && (
            <>
              <FilesSheet
                open={openSheet === "files"}
                onOpenChange={(open) => !open && setOpenSheet(null)}
                onUpload={handleFileUpload}
                assetsData={assetsData as { data?: TAsset[] } | undefined}
              />
              <TextSheet
                open={openSheet === "text"}
                onOpenChange={(open) => !open && setOpenSheet(null)}
                text={trainingText}
                onTextChange={setTrainingText}
                onSubmit={() => {
                  if (!trainingText.trim()) return;
                  createTextAsset({
                    text: trainingText,
                    agent_id: agentId,
                  });
                }}
                isSubmitting={isCreatingTextAsset}
              />
              <WebsiteSheet
                open={openSheet === "website"}
                onOpenChange={(open) => !open && setOpenSheet(null)}
                websiteUrl={websiteUrl}
                onWebsiteUrlChange={setWebsiteUrl}
                enableCrawl={enableCrawl}
                onEnableCrawlChange={setEnableCrawl}
                showUrlSelection={showUrlSelection}
                onShowUrlSelectionChange={setShowUrlSelection}
                crawlMapUrls={crawlMapUrls}
                onCrawlMapUrlsChange={setCrawlMapUrls}
                selectedUrls={selectedUrls}
                onSelectedUrlsChange={setSelectedUrls}
                isGettingCrawlMap={isGettingCrawlMap}
                isCreatingWebsiteAsset={isCreatingWebsiteAsset}
                onGetCrawlMap={(url) => getCrawlMap({ url })}
                onCreateWebsiteAsset={(urls) => {
                  createWebsiteAsset({
                    urls,
                    agent_id: agentId,
                  });
                }}
                onValidateUrl={(url) => {
                  if (!url.trim()) {
                    return {
                      isValid: false,
                      errorMessage: "Please enter a valid URL",
                    };
                  }
                  return { isValid: true };
                }}
              />
              <AssetDialog
                open={showAssetDialog}
                onOpenChange={setShowAssetDialog}
                activeTab={assetDialogTab}
                onTabChange={setAssetDialogTab}
                searchQuery={assetSearchQuery}
                onSearchQueryChange={setAssetSearchQuery}
                filesData={filesData}
                textsData={textsData}
                websitesData={websitesData}
                onDeleteFile={(fileId) => {
                  setDeletingFileId(fileId);
                  deleteFile({ file_id: fileId });
                }}
                isDeletingFile={deletingFileId}
                onDeleteText={(textId) => {
                  setDeletingTextId(textId);
                  deleteText({ text_id: textId });
                }}
                isDeletingText={deletingTextId}
                onDeleteWebsite={(websiteId) => {
                  setDeletingWebsiteId(websiteId);
                  deleteWebsite({ website_id: websiteId });
                }}
                isDeletingWebsite={deletingWebsiteId}
                filePage={assetFilePage}
                textPage={assetTextPage}
                websitePage={assetWebsitePage}
                onFilePageChange={setAssetFilePage}
                onTextPageChange={setAssetTextPage}
                onWebsitePageChange={setAssetWebsitePage}
              />
              <QnaSheet
                open={openSheet === "qna"}
                onOpenChange={(open) => !open && setOpenSheet(null)}
                qnaBlocks={qnaBlocks}
                onQnaBlocksChange={setQnaBlocks}
                onSubmit={(formattedText) => {
                  setIsSubmittingQna(true);
                  createTextAsset(
                    {
                      text: formattedText,
                      agent_id: agentId,
                    },
                    {
                      onSuccess: (data) => {
                        toast.success(data.message);
                        setQnaBlocks([]);
                        setIsSubmittingQna(false);
                      },
                      onError: (error) => {
                        toast.error(error.message);
                        setIsSubmittingQna(false);
                      },
                    },
                  );
                }}
                isSubmitting={isSubmittingQna}
              />

              {/* Disconnect Tool Dialog */}
              <DisconnectToolDialog
                open={showDisconnectToolDialog}
                onOpenChange={setShowDisconnectToolDialog}
                tool={toolToDisconnect}
                onConfirmDisconnect={(toolId, toolName) => {
                  handleDisconnectTool(toolId, toolName, "tool");
                }}
                isDisconnecting={false}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
