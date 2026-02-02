import { FileText, Globe, Lock, Sparkles, Zap } from "lucide-react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type GuestLoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const GuestLoginDialog = ({
  open,
  onOpenChange,
}: GuestLoginDialogProps) => {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Sign In Required
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            To unlock the full potential of your AI agent, please sign in to
            your account. This will enable you to:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
            <div className="p-1.5 rounded-md bg-gray-500/10 mt-0.5">
              <Globe className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Connect Communication Channels
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Link WhatsApp, Telegram, Instagram, and more to your agent
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
            <div className="p-1.5 rounded-md bg-gray-500/10 mt-0.5">
              <Zap className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Integrate Powerful Tools</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect third-party integrations and APIs to extend your agent's
                capabilities
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
            <div className="p-1.5 rounded-md bg-gray-500/10 mt-0.5">
              <FileText className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Upload Training Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add files, text, and websites to train your agent with custom
                knowledge
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                New to LinkAI?
              </span>{" "}
              Create a free account in seconds and start building your AI agent
              right away.
            </p>
          </div>
        </div>

        <DialogFooter className=" w-full flex items-center justify-between gap-2">
          <div>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto cursor-pointer"
            >
              Maybe Later
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2 ">
            <Button
              onClick={() => {
                onOpenChange(false);
                router.push("/login");
              }}
              variant="outline"
              className="flex-1 cursor-pointer"
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                router.push("/create-account");
              }}
              className="flex-1 cursor-pointer"
            >
              Sign Up
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
