import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { useState, useMemo } from "react";
import { TChatwootInbox } from "@/hooks/api/chatwoot/inbox";

interface ChannelMetadataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelName: string;
  channelIcon?: React.ReactNode;
  inboxes?: TChatwootInbox[];
  channelType: "telegram" | "whatsapp" | "webwidget" | null;
  onDisconnect?: () => void;
}

export const ChannelMetadataDialog = ({
  open,
  onOpenChange,
  channelName,
  channelIcon,
  inboxes,
  channelType,
  onDisconnect,
}: ChannelMetadataDialogProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Find the correct inbox based on channel type
  const channelMetadata = useMemo(() => {
    if (!inboxes || !channelType) return null;

    const inbox = inboxes.find((inbox) => {
      return inbox.channel_metadata?.[channelType] !== undefined;
    });

    return inbox?.channel_metadata;
  }, [inboxes, channelType]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderMetadata = () => {
    if (!channelMetadata || !channelType) {
      return (
        <div className="text-sm text-muted-foreground text-center py-8">
          No metadata available for this channel
        </div>
      );
    }

    if (channelType === "telegram" && channelMetadata.telegram) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Bot Token</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted/50 rounded-md px-3 py-2 text-sm font-mono break-all">
                {channelMetadata.telegram.bot_token}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  handleCopy(
                    channelMetadata.telegram!.bot_token,
                    "telegram-token",
                  )
                }
              >
                <HugeiconsIcon
                  icon={
                    copiedField === "telegram-token" ? Tick01Icon : Copy01Icon
                  }
                  className="size-4"
                />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (channelType === "webwidget" && channelMetadata.webwidget) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Widget Script</label>
            <div className="flex items-start gap-2">
              <div className="flex-1 bg-muted/50 rounded-md px-3 py-2 text-xs font-mono overflow-x-auto max-h-[300px]">
                <pre className="whitespace-pre-wrap wrap-break-word">
                  {channelMetadata.webwidget.script}
                </pre>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  handleCopy(
                    channelMetadata.webwidget!.script,
                    "webwidget-script",
                  )
                }
              >
                <HugeiconsIcon
                  icon={
                    copiedField === "webwidget-script" ? Tick01Icon : Copy01Icon
                  }
                  className="size-4"
                />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (channelType === "whatsapp" && channelMetadata.whatsapp) {
      return (
        <div className="space-y-4">
          {channelMetadata.whatsapp.phone_number_id && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number ID</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/50 rounded-md px-3 py-2 text-sm font-mono">
                  {channelMetadata.whatsapp.phone_number_id}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    handleCopy(
                      channelMetadata.whatsapp!.phone_number_id!,
                      "phone-number-id",
                    )
                  }
                >
                  <HugeiconsIcon
                    icon={
                      copiedField === "phone-number-id"
                        ? Tick01Icon
                        : Copy01Icon
                    }
                    className="size-4"
                  />
                </Button>
              </div>
            </div>
          )}
          {channelMetadata.whatsapp.waba_id && (
            <div className="space-y-2">
              <label className="text-sm font-medium">WABA ID</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/50 rounded-md px-3 py-2 text-sm font-mono">
                  {channelMetadata.whatsapp.waba_id}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    handleCopy(channelMetadata.whatsapp!.waba_id!, "waba-id")
                  }
                >
                  <HugeiconsIcon
                    icon={copiedField === "waba-id" ? Tick01Icon : Copy01Icon}
                    className="size-4"
                  />
                </Button>
              </div>
            </div>
          )}
          {channelMetadata.whatsapp.business_id && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Business ID</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/50 rounded-md px-3 py-2 text-sm font-mono">
                  {channelMetadata.whatsapp.business_id}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    handleCopy(
                      channelMetadata.whatsapp!.business_id!,
                      "business-id",
                    )
                  }
                >
                  <HugeiconsIcon
                    icon={
                      copiedField === "business-id" ? Tick01Icon : Copy01Icon
                    }
                    className="size-4"
                  />
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {channelIcon && <div className="size-6">{channelIcon}</div>}
            <span>{channelName} Configuration</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">{renderMetadata()}</div>
        {onDisconnect && (
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                onDisconnect();
                onOpenChange(false);
              }}
            >
              Disconnect Channel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
