import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Loader } from "lucide-react";

interface ToolConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: {
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color: string;
    category?: string;
  } | null;
  agentId: string;
  agentName?: string;
  onConnect: () => void;
  onConnectLoading: boolean;
}

// Helper function to determine icon background color based on category
const getIconBgColor = (category?: string): string => {
  if (!category) return "bg-gray-50 text-gray-600";

  const categoryLower = category.toLowerCase();

  if (categoryLower.includes("communication")) {
    return "bg-blue-50 text-blue-600";
  } else if (categoryLower.includes("productivity")) {
    return "bg-purple-50 text-purple-600";
  } else if (
    categoryLower.includes("project") ||
    categoryLower.includes("management")
  ) {
    return "bg-indigo-50 text-indigo-600";
  } else if (categoryLower.includes("marketing")) {
    return "bg-yellow-50 text-yellow-600";
  }

  return "bg-gray-50 text-gray-600";
};

export const ToolConnectionDialog = ({
  open,
  onOpenChange,
  tool,
  agentId,
  agentName,
  onConnect,
  onConnectLoading,
}: ToolConnectionDialogProps) => {
  if (!tool) return null;

  const category = tool.category || "Tools";
  const iconBgColor = getIconBgColor(category);
  const description = `Connect ${tool.name} to enhance your agent's capabilities.`;

  const handleCloseDialog = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`inline-flex items-center justify-center size-12 rounded-lg ${iconBgColor}`}
            >
              {tool.icon_url ? (
                <Image
                  src={tool.icon_url}
                  alt={`${tool.name} logo`}
                  width={24}
                  height={24}
                  className="size-6"
                />
              ) : (
                <span style={{ color: tool.color }} className="text-2xl">
                  {tool.icon}
                </span>
              )}
            </div>
            <div>
              <DialogTitle className="text-xl">{tool.name}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">{category}</p>
            </div>
          </div>
          <DialogDescription className="text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="agent-select" className="text-sm font-medium">
              Select Agent
            </Label>
            <Select value={agentId} disabled>
              <SelectTrigger id="agent-select" className="w-full">
                <SelectValue placeholder="Choose an agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={agentId}>
                  {agentName || "Selected Agent"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border bg-muted/40 p-4">
            <h4 className="font-medium text-sm mb-2">What you&apos;ll need:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>An active {tool.name} account with admin access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Permission to authorize third-party applications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>A few minutes to complete the setup process</span>
              </li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground">
            By connecting, you agree to allow access to your {tool.name}{" "}
            account. You can revoke access at any time from your settings.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={onConnect}
            className="cursor-pointer"
            disabled={onConnectLoading}
          >
            {onConnectLoading ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span className="ml-2">Connecting...</span>
              </>
            ) : (
              "Connect Integration"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
