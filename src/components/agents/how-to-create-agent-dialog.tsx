import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface HowToCreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HowToCreateAgentDialog({
  open,
  onOpenChange,
}: HowToCreateAgentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            How to Create Your AI Agent
          </DialogTitle>
          <DialogDescription>
            Follow these simple steps to set up your intelligent assistant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="shrink-0">
              <Badge
                variant="default"
                className="h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold"
              >
                1
              </Badge>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Click the Create Agent Button
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start by clicking the <strong>"+ Create New Agent"</strong>{" "}
                button in the top right corner. This will open the agent
                creation form where you can define your AI assistant's purpose.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="shrink-0">
              <Badge
                variant="default"
                className="h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold"
              >
                2
              </Badge>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Configure Your Agent
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Give your agent a <strong>name</strong> and write a clear{" "}
                <strong>description</strong> of its role. For example: "Customer
                Support Agent" or "Sales Assistant". You can also attach
                <strong>channels and tools</strong> to your agent to make it
                more capable.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="shrink-0">
              <Badge
                variant="default"
                className="h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold"
              >
                3
              </Badge>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Train and Deploy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once created, navigate to the <strong>Train</strong> tab to add
                knowledge to your agent. Upload files, add text content, or
                scrape websites to give your agent the information it needs.
                Once you're satisfied with the agent, you can deploy it to your
                desired channels and tools.
              </p>
            </div>
          </div>

          {/* Tip Section */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Pro Tip
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                  Start with a simple agent to test the flow. You can always
                  edit and enhance it later with more training data and advanced
                  features!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
