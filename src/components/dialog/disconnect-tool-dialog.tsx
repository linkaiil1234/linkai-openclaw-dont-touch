import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

interface DisconnectToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: {
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color?: string;
  } | null;
  onConfirmDisconnect: (toolId: string, toolName: string) => void;
  isDisconnecting?: boolean;
}

export const DisconnectToolDialog = ({
  open,
  onOpenChange,
  tool,
  onConfirmDisconnect,
  isDisconnecting = false,
}: DisconnectToolDialogProps) => {
  const handleConfirm = () => {
    if (tool) {
      onConfirmDisconnect(tool._id, tool.name);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-500" />
            Disconnect {tool?.name}?
          </DialogTitle>
          <DialogDescription className="text-sm">
            This action will remove the integration from your agent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tool Display */}
          {tool && (
            <div className="rounded-lg border bg-muted/40 p-4 flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${tool.color || "#6366F1"}15`,
                  color: tool.color || "#6366F1",
                }}
              >
                {tool.icon_url ? (
                  <Image
                    src={tool.icon_url}
                    alt={tool.name}
                    width={32}
                    height={32}
                    className="size-8 object-contain"
                  />
                ) : (
                  <div className="*:size-8">{tool.icon || "🔧"}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{tool.name}</h4>
                <p className="text-xs text-muted-foreground">
                  Currently connected & active
                </p>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4">
            <h4 className="font-medium text-sm mb-2 text-amber-900 dark:text-amber-100">
              What will happen:
            </h4>
            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>
                  The agent will no longer have access to this integration
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>
                  Any workflows using this tool may not function properly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>You can reconnect this integration at any time</span>
              </li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground">
            Your {tool?.name} account credentials will remain saved and can be
            reused when reconnecting.
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDisconnecting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDisconnecting}
            className="cursor-pointer"
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect Integration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
