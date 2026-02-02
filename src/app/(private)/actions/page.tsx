"use client";

import { useState } from "react";
import {
  Search01Icon,
  Refresh01Icon,
  User02Icon,
  Pen01Icon,
  Clock02Icon,
  AlertCircleIcon,
  MessageSecure01Icon,
  FilterIcon,
  Add01Icon,
  Tick02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { FeatureCard3D } from "@/components/shared/feature-card-3d";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  category: string;
  categoryColor: string;
}

const WORKFLOWS: Workflow[] = [
  {
    id: "smart-follow-up",
    name: "Smart Follow-up",
    description:
      "Automatically nudge customers who haven't replied within a specific time window.",
    icon: <HugeiconsIcon icon={Refresh01Icon} className="size-6" />,
    iconBgColor: "bg-blue-50 text-blue-600",
    category: "AUTOMATION",
    categoryColor: "text-blue-600",
  },
  {
    id: "human-handoff",
    name: "Human Handoff",
    description:
      "Detect negative sentiment or specific keywords and transfer the chat to a human agent.",
    icon: <HugeiconsIcon icon={User02Icon} className="size-6" />,
    iconBgColor: "bg-orange-50 text-orange-600",
    category: "ROUTING",
    categoryColor: "text-orange-600",
  },
  {
    id: "outbound-blast",
    name: "Outbound Blast",
    description:
      "Initiate a message to a segment of customers (e.g., promotional offers or announcements).",
    icon: <HugeiconsIcon icon={Pen01Icon} className="size-6" />,
    iconBgColor: "bg-green-50 text-green-600",
    category: "MARKETING",
    categoryColor: "text-green-600",
  },
  {
    id: "auto-close-inactive",
    name: "Auto-Close Inactive",
    description:
      "Automatically resolve and close conversations that have been inactive for 48 hours.",
    icon: <HugeiconsIcon icon={Clock02Icon} className="size-6" />,
    iconBgColor: "bg-gray-50 text-gray-600",
    category: "AUTOMATION",
    categoryColor: "text-blue-600",
  },
  {
    id: "sentiment-alert",
    name: "Sentiment Alert",
    description:
      "Receive an immediate notification when a customer expresses anger or frustration.",
    icon: <HugeiconsIcon icon={AlertCircleIcon} className="size-6" />,
    iconBgColor: "bg-red-50 text-red-600",
    category: "MONITORING",
    categoryColor: "text-red-600",
  },
  {
    id: "review-request",
    name: "Review Request",
    description:
      "Ask satisfied customers for a review after a ticket is successfully resolved.",
    icon: <HugeiconsIcon icon={MessageSecure01Icon} className="size-6" />,
    iconBgColor: "bg-purple-50 text-purple-600",
    category: "MARKETING",
    categoryColor: "text-green-600",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ActionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [delayTime, setDelayTime] = useState([24]);
  const [messageTemplate, setMessageTemplate] = useState(
    "Hi {{customer_name}}, just checking in to see if you still needed help with this? Let me know!",
  );
  const [enabledWorkflows, setEnabledWorkflows] = useState<
    Record<string, boolean>
  >({});

  const filteredWorkflows = WORKFLOWS.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConfigureWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedWorkflow(null);
  };

  const handleActivateWorkflow = () => {
    // Handle workflow activation logic here
    console.log(`Activating ${selectedWorkflow?.name}...`);
    console.log("Delay Time:", delayTime[0], "hours");
    console.log("Message Template:", messageTemplate);

    // Enable the workflow
    if (selectedWorkflow) {
      setEnabledWorkflows((prev) => ({
        ...prev,
        [selectedWorkflow.id]: true,
      }));
    }

    handleCloseDialog();
  };

  const handleToggleWorkflow = (workflowId: string, checked: boolean) => {
    if (checked && !enabledWorkflows[workflowId]) {
      // If trying to enable, open dialog first
      const workflow = WORKFLOWS.find((w) => w.id === workflowId);
      if (workflow) {
        handleConfigureWorkflow(workflow);
      }
    } else if (!checked) {
      // If disabling, allow directly
      setEnabledWorkflows((prev) => ({
        ...prev,
        [workflowId]: false,
      }));
    }
  };

  const insertVariable = (variable: string) => {
    setMessageTemplate((prev) => prev + ` {{${variable}}}`);
  };

  return (
    <div className="container flex flex-col h-full mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 p-6 overflow-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Actions & Workflows
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure advanced agent behaviors and logic
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <HugeiconsIcon icon={FilterIcon} className="size-4" />
                Categories
              </Button>
              <Button
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                <HugeiconsIcon icon={Add01Icon} className="size-4 mr-1" />
                Custom Workflow
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative border rounded-xl">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              placeholder="Search for workflows like 'Follow-up' or 'Handoff'..."
              className="pl-9 h-12 rounded-xl bg-background border-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Workflow Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto scrollbar-hide p-6 rounded-xl h-full"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredWorkflows.map((workflow) => (
            <motion.div key={workflow.id} variants={item}>
              <FeatureCard3D
                name={workflow.name}
                description={workflow.description}
                icon={workflow.icon}
                iconBgColor={workflow.iconBgColor}
                category={workflow.category}
                categoryColor={workflow.categoryColor}
                buttonText="Details"
                onButtonClick={() => handleConfigureWorkflow(workflow)}
                isEnabled={enabledWorkflows[workflow.id] || false}
                onToggle={(checked) =>
                  handleToggleWorkflow(workflow.id, checked)
                }
              />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              No workflows found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Workflow Configuration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className=" w-96 h-auto rounded-2xl ">
          <button
            onClick={handleCloseDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader>
            <div className="flex items-center gap-3">
              {selectedWorkflow && (
                <div
                  className={`inline-flex items-center justify-center size-12 rounded-lg ${selectedWorkflow.iconBgColor}`}
                >
                  {selectedWorkflow.icon}
                </div>
              )}
              <div>
                <DialogTitle className="text-sm font-semibold">
                  {selectedWorkflow?.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Configure Logic & Settings
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Delay Time Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Delay Time (Hours)
                </label>
                <span className="text-sm font-semibold text-blue-600">
                  {delayTime[0]}h
                </span>
              </div>
              <Slider
                value={delayTime}
                onValueChange={setDelayTime}
                max={72}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Time to wait after the last user message before sending.
              </p>
            </div>

            {/* Message Template */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Message Template
              </label>
              <Textarea
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                placeholder="Enter your message template..."
                className="min-h-[100px] resize-none text-xs"
              />
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 text-xs px-2 py-1"
                  onClick={() => insertVariable("customer_name")}
                >
                  {`{{customer_name}}`}
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 text-xs px-2 py-1"
                  onClick={() => insertVariable("agent_name")}
                >
                  {`{{agent_name}}`}
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 rounded">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleActivateWorkflow}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <HugeiconsIcon icon={Tick02Icon} className="size-4 mr-1" />
              Activate Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
