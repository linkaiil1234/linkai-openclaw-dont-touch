"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import z from "zod";
import { useState, useRef } from "react";
import {
  ArrowUp01Icon,
  FileEditIcon,
  Link01FreeIcons,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UrlInput } from "./url-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SendIcon, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getAttachmentButtonStyle,
  getContainerStyle,
  getInputStyle,
  getSendButtonStyle,
} from "@/constants/components/chat-input";

const attachmentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("url"), url: z.string().url() }),
  z.object({ type: z.literal("pdf"), file: z.instanceof(File) }),
]);

const conversationSchema = z.object({
  attachments: z.array(attachmentSchema).default([]),
  message: z.string().min(1).max(1000),
});

export type ConversationFormValues = z.infer<typeof conversationSchema>;

export type ChatInputProps = {
  isAgentTraining?: boolean;
  onSubmit: (values: ConversationFormValues) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  channel?: "whatsapp" | "email" | "sms" | "instagram" | "telegram";
  onOpenAssetDialog?: () => void;
};

export function ChatInput({
  isAgentTraining = false,
  onSubmit,
  placeholder = "Type your message...",
  className,
  disabled = false,
  channel = "email",
  onOpenAssetDialog,
}: ChatInputProps) {
  const form = useForm<ConversationFormValues>({
    resolver: zodResolver(
      conversationSchema,
    ) as Resolver<ConversationFormValues>,
    defaultValues: {
      attachments: [],
      message: "",
    },
  });

  const attachments = form.watch("attachments");
  const [addingUrl, setAddingUrl] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    maxSize: 5242880, // 5MB
    noClick: true,
    noKeyboard: true,
    onDrop: (files) => {
      if (!files.length) return;
      addAttachments(
        files.map((file) => ({
          type: "pdf" as const,
          file,
        })),
      );
      setShowUploadModal(false);
    },
  });

  const handleOpenFileDialog = () => {
    open();
  };

  const addAttachments = (items: ConversationFormValues["attachments"]) => {
    form.setValue("attachments", [...attachments, ...items], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeAttachment = (index: number) => {
    const next = attachments.filter((_, i) => i !== index);
    form.setValue("attachments", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleAttachmentType = (type: "url" | "pdf" | "none") => {
    if (type === "pdf") {
      open();
      setAddingUrl(false);
    } else if (type === "url") {
      setAddingUrl(true);
    } else {
      form.setValue("attachments", [], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setAddingUrl(false);
      setPendingUrl("");
    }
  };

  const handleAddUrl = () => {
    const normalized = pendingUrl.trim();
    if (!normalized) return;
    const url = normalized.match(/^https?:\/\//)
      ? normalized
      : `https://${normalized}`;
    addAttachments([{ type: "url", url }]);
    setPendingUrl("");
    setAddingUrl(false);
  };

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
    form.reset({ attachments: [], message: "" });
    setAddingUrl(false);
    setPendingUrl("");
    setIsEmojiPickerOpen(false);
  });

  const handleEmojiSelect = (emoji: string) => {
    const currentMessage = form.getValues("message");
    const input = inputRef.current;
    if (input) {
      const cursorPosition = input.selectionStart || currentMessage.length;
      const newMessage =
        currentMessage.slice(0, cursorPosition) +
        emoji +
        currentMessage.slice(cursorPosition);
      form.setValue("message", newMessage, {
        shouldValidate: true,
        shouldDirty: true,
      });
      // Focus back on input and set cursor position after emoji
      setTimeout(() => {
        input.focus();
        const newPosition = cursorPosition + emoji.length;
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    } else {
      // Fallback if ref is not available
      form.setValue("message", currentMessage + emoji, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    setIsEmojiPickerOpen(false);
  };

  return (
    <Form {...form}>
      <div
        className={cn(
          "p-4 relative",
          showUploadModal ? "" : "",
          getContainerStyle(channel),
          className,
        )}
      >
        {/* File Upload Dialog */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent
            enableDialogClose
            className="max-w-md p-0 overflow-hidden"
          >
            <div
              {...getRootProps()}
              className={cn(
                "cursor-pointer transition-all duration-300",
                isDragActive && "scale-[1.02]",
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenFileDialog();
              }}
            >
              <input {...getInputProps()} />
              <DialogHeader className="px-6 pt-6 pb-4">
                <DialogTitle className="text-center">Upload Files</DialogTitle>
                <DialogDescription className="text-center">
                  Drag & drop files here or click to browse
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center gap-4 px-6 pb-6">
                <div
                  className={cn(
                    "size-20 rounded-full flex items-center justify-center transition-all duration-300",
                    isDragActive ? "bg-primary/20 scale-110" : "bg-muted/50",
                  )}
                >
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    className={cn(
                      "size-10 transition-all duration-300",
                      isDragActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">
                    {isDragActive
                      ? "Drop files here"
                      : "Drag & drop files here"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Or click to browse (up to 5MB each)
                  </p>
                </div>
              </div>

              <DialogFooter className="px-6 pb-6 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadModal(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFileDialog();
                  }}
                  className="flex-1"
                >
                  Browse Files
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex items-center gap-2 p-2.5 rounded-2xl transition-all duration-300 ease-out",
            channel === "whatsapp" ? "rounded-3xl" : "rounded-2xl",
            getInputStyle(channel),
            disabled && "opacity-50 pointer-events-none",
            showUploadModal && "hidden",
          )}
        >
          {isAgentTraining ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className={cn(
                "hover:scale-110 transition-all duration-200 size-10 group",
                getAttachmentButtonStyle(channel),
              )}
              disabled={disabled}
              onClick={onOpenAssetDialog}
            >
              <HugeiconsIcon icon={Link01FreeIcons} className="size-5" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "hover:scale-110 transition-all duration-200 size-10 group",
                    getAttachmentButtonStyle(channel),
                  )}
                  disabled={disabled}
                >
                  <HugeiconsIcon icon={Link01FreeIcons} className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl p-1.5"
                sideOffset={8}
              >
                <DropdownMenuItem
                  onSelect={() => handleAttachmentType("url")}
                  className="rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:text-primary group/item"
                >
                  <HugeiconsIcon
                    icon={Link01FreeIcons}
                    className="size-4 mr-2.5 text-primary/70 group-hover/item:text-primary transition-colors"
                  />
                  <span className="font-medium">Add URL</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowUploadModal(true)}
                  className="rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:text-primary group/item"
                >
                  <HugeiconsIcon
                    icon={FileEditIcon}
                    className="size-4 mr-2.5 text-primary/70 group-hover/item:text-primary transition-colors"
                  />
                  <span className="font-medium">Upload Files</span>
                </DropdownMenuItem>
                {attachments.length > 0 && (
                  <DropdownMenuItem
                    onSelect={() => handleAttachmentType("none")}
                    variant="destructive"
                    className="rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 mt-1 border-t border-border/50 pt-2"
                  >
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      className="size-4 mr-2.5"
                    />
                    <span className="font-medium">Clear All</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {addingUrl && (
            <UrlInput
              value={pendingUrl}
              onChange={setPendingUrl}
              onAdd={handleAddUrl}
              onClose={() => {
                setAddingUrl(false);
                setPendingUrl("");
              }}
              disabled={disabled}
            />
          )}

          <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={cn(
                  "hover:scale-110 transition-all duration-200 size-10 group",
                  getAttachmentButtonStyle(channel),
                )}
                disabled={disabled}
              >
                <Smile className="size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-0"
              align="start"
              sideOffset={8}
            >
              <EmojiPicker
                height={450}
                width={400}
                onEmojiClick={(emojiData) => {
                  handleEmojiSelect(emojiData.emoji);
                }}
              />
            </PopoverContent>
          </Popover>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <Input
                id="message"
                type="text"
                placeholder={placeholder}
                className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-base placeholder:text-muted-foreground/60"
                {...field}
                ref={(e) => {
                  field.ref(e);
                  inputRef.current = e;
                }}
                disabled={disabled}
              />
            )}
          />
          <Button
            type="submit"
            size="icon"
            className={cn(
              "size-10 rounded-full shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100 disabled:opacity-50",
              getSendButtonStyle(channel),
            )}
            disabled={disabled || !form.watch("message")?.trim()}
          >
            <SendIcon className="size-[18px]" />
          </Button>
        </form>
      </div>
    </Form>
  );
}
