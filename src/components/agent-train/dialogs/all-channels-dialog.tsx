import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import IntegrationsSection from "@/components/shared/integrations-section";

interface AllChannelsDialogProps {
  open: boolean;
  source?: string;
  agents?: Array<{
    _id: string;
    name: string;
    avatar?: string;
  }>;
  onOpenChange: (open: boolean) => void;
  tools: Array<{
    _id: string;
    name: string;
    icon?: React.ReactNode;
    color: string;
    description: string;
    bgGradient: string;
    isConnected: boolean;
  }>;
  onToolClick: (tool: {
    _id: string;
    name: string;
    icon?: React.ReactNode;
    color: string;
    isConnected?: boolean;
    description: string;
    bgGradient: string;
  }) => void;
}

export const AllChannelsDialog = ({
  source,
  agents,
  open,
  onOpenChange,
  tools,
  onToolClick,
}: AllChannelsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        enableDialogClose
        className="max-h-[85vh] overflow-hidden bg-white/95 backdrop-blur-2xl border border-gray-200 shadow-2xl rounded-2xl p-0 animate-in fade-in-0 zoom-in-95 duration-300"
        style={{ width: "60vw", maxWidth: "60vw" }}
      >
        <DialogHeader className="px-8 pt-8 pb-6 border-b border-gray-100 bg-linear-to-b from-gray-50/50 to-transparent">
          <DialogTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
            All Channels
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-2">
            Select a channel to connect with your agent
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto hide-scrollbar px-8 py-6 max-h-full scroll-smooth">
          <IntegrationsSection
            tools={tools
              .filter((tool) => tool.name?.toLowerCase() !== "playground")
              .map((tool) => ({
                _id: tool._id,
                name: tool.name || "Channel",
                icon: tool.icon,
                color: tool.color,
                description: tool.description || "Communication channel",
                bgGradient:
                  tool.bgGradient ||
                  `from-[${tool.color}]/20 to-[${tool.color}]/5`,
                isConnected: tool.isConnected,
              }))}
            onToolClick={(tool) =>
              onToolClick({
                _id: tool._id,
                name: tool.name,
                icon: tool.icon,
                color: tool.color,
                isConnected: tool.isConnected,
                description: tool.description,
                bgGradient: tool.bgGradient,
              })
            }
            onClose={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
