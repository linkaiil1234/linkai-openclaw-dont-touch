import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { AVAILABLE_CHANNELS } from "@/constants/agent-onboarding-modal";

interface DisconnectChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: {
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color: string;
  } | null;
  onConfirmDisconnect: () => void;
  onCancel: () => void;
}

export const DisconnectChannelDialog = ({
  open,
  onOpenChange,
  channel,
  onConfirmDisconnect,
  onCancel,
}: DisconnectChannelDialogProps) => {
  if (!channel) return null;

  const selectedChannelObject = AVAILABLE_CHANNELS.find(
    (c) => c.id === channel._id,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent enableDialogClose className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Disconnect {channel.name}?
          </DialogTitle>
          <DialogDescription className="pt-3">
            Are you sure you want to disconnect <strong>{channel.name}</strong>{" "}
            from this agent? This will remove the inbox and stop receiving
            messages through this channel.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mt-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <HugeiconsIcon
                icon={InformationCircleIcon}
                className="w-4 h-4 text-amber-600"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Warning</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                All existing conversations will be preserved, but new messages
                won&apos;t be received until reconnected.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className=" cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDisconnect}
            className="gap-2 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
            Disconnect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
