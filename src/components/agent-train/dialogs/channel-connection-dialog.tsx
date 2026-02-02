import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { IoLogoWhatsapp } from "react-icons/io";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import LinkAILogo from "@/assets/images/linkai_favicon.jpeg";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

interface ChannelConnectionDialogProps {
  open: boolean;
  source?: string;
  onOpenChange: (open: boolean) => void;
  clickedTool: {
    _id: string;
    name: string;
    icon?: React.ReactNode;
    icon_url?: string;
    color: string;
  } | null;
  channelDialogStep: string;
  setChannelDialogStep: (step: string) => void;
  selectedChannelType: "web-widget" | "telegram" | "whatsapp" | null;
  botToken: string;
  setBotToken: (token: string) => void;
  isCreatingInbox: boolean;
  agent: {
    _id: string;
    name?: string;
    avatar?: string;
  } | null;
  agentEmail: string;
  onCreateInbox: () => void;
  onClose: () => void;
  // Optional props for agent selection (used in inbox page)
  showAgentSelector?: boolean;
  agents?: Array<{
    _id: string;
    name?: string;
    avatar?: string;
  }>;
  selectedAgentId?: string;
  onAgentSelect?: (agentId: string) => void;
  isLoadingAgents?: boolean;
  // Web widget configuration props
  websiteUrl: string;
  setWebsiteUrl: (url: string) => void;
  welcomeTitle: string;
  setWelcomeTitle: (title: string) => void;
  // Web widget response data
  webWidgetData?: {
    web_widget_script: string;
    website_token: string;
    website_url: string;
  } | null;
}

export const ChannelConnectionDialog = ({
  open,
  source,
  onOpenChange,
  clickedTool,
  channelDialogStep,
  setChannelDialogStep,
  selectedChannelType,
  botToken,
  setBotToken,
  isCreatingInbox,
  agent,
  agentEmail,
  onCreateInbox,
  onClose,
  showAgentSelector = false,
  agents = [],
  selectedAgentId = "",
  onAgentSelect = () => {},
  isLoadingAgents = false,
  websiteUrl,
  setWebsiteUrl,
  welcomeTitle,
  setWelcomeTitle,
  webWidgetData,
}: ChannelConnectionDialogProps) => {
  if (!clickedTool) return null;

  // Check if agent is required but not selected (only for inbox source)
  const isAgentRequired = source === "inbox" && !selectedAgentId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            {clickedTool.icon_url ? (
              <Image
                src={clickedTool.icon_url}
                alt={clickedTool.name}
                width={24}
                height={24}
                className="object-contain"
              />
            ) : (
              <span style={{ color: clickedTool.color }}>
                {clickedTool.icon}
              </span>
            )}
            Connect {clickedTool.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Create a channel to start receiving messages through{" "}
            {clickedTool.name}
          </p>
        </DialogHeader>

        <Stepper value={channelDialogStep} onValueChange={setChannelDialogStep}>
          <StepperList className="mb-8">
            <StepperItem value="step-2">
              <StepperTrigger>
                <StepperIndicator />
                <div className="flex flex-col items-start">
                  <StepperTitle className="font-semibold">
                    Configuration
                  </StepperTitle>
                  <StepperDescription className="text-xs">
                    Configure your Channel
                  </StepperDescription>
                </div>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            <StepperItem value="step-3">
              <StepperTrigger>
                <StepperIndicator />
                <div className="flex flex-col items-start">
                  <StepperTitle className="font-semibold">
                    Complete
                  </StepperTitle>
                  <StepperDescription className="text-xs">
                    Channel created
                  </StepperDescription>
                </div>
              </StepperTrigger>
            </StepperItem>
          </StepperList>

          <div className="mt-2">
            <StepperContent value="step-2">
              <div className="space-y-6">
                {selectedChannelType === "whatsapp" ? (
                  <div className="space-y-5">
                    <div className="space-y-4 p-6 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <IoLogoWhatsapp className="w-7 h-7 text-green-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-semibold text-green-900">
                            Connect Your WhatsApp Business Account
                          </h3>
                          <p className="text-sm text-green-700 leading-relaxed">
                            You&apos;ll be redirected to Facebook to authorize
                            your WhatsApp Business account. Make sure you have:
                          </p>
                          <ul className="text-sm text-green-700 space-y-1 ml-4 list-disc">
                            <li>A Facebook Business account</li>
                            <li>
                              A WhatsApp Business account linked to your
                              Facebook
                            </li>
                            <li>
                              Admin access to your WhatsApp Business account
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                          <HugeiconsIcon
                            icon={InformationCircleIcon}
                            className="w-4 h-4 text-blue-600"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900">
                            What happens next?
                          </p>
                          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            After authorization, your WhatsApp inbox will be
                            automatically created and ready to receive messages.
                            You&apos;ll be redirected back to your inbox.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {selectedChannelType === "telegram" && (
                      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <Label
                          htmlFor="bot-token"
                          className="text-sm font-semibold text-gray-900"
                        >
                          Bot Token
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="bot-token"
                          placeholder="Enter your Telegram bot token"
                          value={botToken}
                          onChange={(e) => setBotToken(e.target.value)}
                          className="h-11 bg-white"
                        />
                        <p className="text-xs text-blue-700">
                          Get your bot token from{" "}
                          <a
                            href="https://t.me/botfather"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-medium hover:text-blue-800"
                          >
                            @BotFather
                          </a>{" "}
                          on Telegram
                        </p>
                      </div>
                    )}
                    {selectedChannelType === "web-widget" && (
                      <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="space-y-3">
                          <div>
                            <Label
                              htmlFor="website-url"
                              className="text-sm font-semibold text-gray-900"
                            >
                              Website URL
                              <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                              id="website-url"
                              placeholder="https://yourwebsite.com"
                              value={websiteUrl}
                              onChange={(e) => setWebsiteUrl(e.target.value)}
                              className="h-11 bg-white mt-2"
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor="welcome-title"
                              className="text-sm font-semibold text-gray-900"
                            >
                              Welcome Title
                            </Label>
                            <Input
                              id="welcome-title"
                              placeholder="Welcome to our chat!"
                              value={welcomeTitle}
                              onChange={(e) => setWelcomeTitle(e.target.value)}
                              className="h-11 bg-white mt-2"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-purple-700">
                          Configure your web widget. This widget can be embedded
                          on your website.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Agent Selection or Display */}
                <div className="space-y-3 p-4 bg-linear-to-br from-blue-50/50 to-purple-50/50 rounded-lg border border-blue-100">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {showAgentSelector ? (
                      <>
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Select Agent
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Assigned Agent
                      </>
                    )}
                    {showAgentSelector && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>

                  {showAgentSelector ? (
                    <div className="space-y-3">
                      <Select
                        value={selectedAgentId}
                        onValueChange={onAgentSelect}
                        disabled={isLoadingAgents}
                      >
                        <SelectTrigger className="h-12 bg-white border-blue-200 hover:border-blue-300 transition-colors">
                          <SelectValue placeholder="Choose an agent to connect this channel" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {isLoadingAgents ? (
                            <SelectItem value="loading" disabled>
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-blue-600" />
                                <span>Loading agents...</span>
                              </div>
                            </SelectItem>
                          ) : agents.length === 0 ? (
                            <SelectItem value="no-agents" disabled>
                              <div className="flex items-center gap-2 text-gray-500">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                                <span>No agents available</span>
                              </div>
                            </SelectItem>
                          ) : (
                            agents.map((agentOption) => (
                              <SelectItem
                                key={agentOption._id}
                                value={agentOption._id}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-3 py-1">
                                  <div className="relative size-8 rounded-full overflow-hidden shrink-0 ring-2 ring-gray-200">
                                    <Image
                                      src={agentOption.avatar || LinkAILogo}
                                      alt={agentOption.name || "AI Agent"}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                      {agentOption.name || "AI Agent"}
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>

                      {selectedAgentId && agent && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="relative size-10 rounded-full ring-2 ring-blue-400 overflow-hidden shrink-0">
                            <Image
                              src={agent.avatar || LinkAILogo}
                              alt={agent.name || "AI Agent"}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {agent.name || "AI Agent"}
                            </p>
                            <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                              Selected & Ready
                            </p>
                          </div>
                        </div>
                      )}

                      {!selectedAgentId && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <HugeiconsIcon
                            icon={InformationCircleIcon}
                            className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
                          />
                          <p className="text-xs text-amber-700 leading-relaxed">
                            Please select an agent from the dropdown above to
                            connect this channel. The agent will handle all
                            conversations from this channel.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="relative size-10 rounded-full ring-2 ring-primary/30 overflow-hidden shrink-0">
                        <Image
                          src={agent?.avatar || LinkAILogo}
                          alt={agent?.name || "AI Agent"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {agent?.name || "AI Agent"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {agentEmail}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        Auto-assigned
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="min-w-24"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onCreateInbox}
                    disabled={
                      isAgentRequired ||
                      (selectedChannelType === "telegram" && !botToken) ||
                      (selectedChannelType === "web-widget" && !websiteUrl)
                    }
                    className="min-w-32 cursor-pointer"
                  >
                    {selectedChannelType === "whatsapp"
                      ? "Connect with WhatsApp"
                      : selectedChannelType === "web-widget"
                        ? "Create Web Channel"
                        : "Create Channel"}
                  </Button>
                </div>
              </div>
            </StepperContent>

            <StepperContent value="step-3">
              <div className="space-y-6">
                {isCreatingInbox ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100" />
                      </div>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-gray-900">
                      {selectedChannelType === "whatsapp"
                        ? "Redirecting to WhatsApp..."
                        : "Creating your channel..."}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedChannelType === "whatsapp"
                        ? "Please wait while we redirect you to Facebook for authorization"
                        : "This will only take a moment"}
                    </p>
                  </div>
                ) : selectedChannelType === "web-widget" && webWidgetData ? (
                  <div className="flex flex-col py-6 space-y-6">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
                          <svg
                            className="h-16 w-16 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="absolute -top-1 -right-1">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="mt-6 text-2xl font-bold text-gray-900">
                        Web Channel Created!
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground text-center">
                        Copy and paste this code into your website
                      </p>
                    </div>

                    {/* Website Token */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-900">
                        Website Token
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={webWidgetData.website_token}
                          readOnly
                          className="bg-gray-50 font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              webWidgetData.website_token,
                            );
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Website URL */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-900">
                        Website URL
                      </Label>
                      <Input
                        value={webWidgetData.website_url}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>

                    {/* Web Widget Script */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-900">
                        Installation Script
                      </Label>
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                          {webWidgetData.web_widget_script}
                        </pre>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              webWidgetData.web_widget_script,
                            );
                          }}
                        >
                          Copy Script
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <p className="text-xs text-purple-700 leading-relaxed">
                        <strong>Instructions:</strong> Add the installation
                        script to your website's HTML, preferably before the
                        closing &lt;/body&gt; tag. The widget will appear
                        automatically on your website.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
                        <svg
                          className="h-16 w-16 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-gray-900">
                      Channel Created Successfully!
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
                      Your{" "}
                      {selectedChannelType === "telegram"
                        ? "Telegram"
                        : selectedChannelType === "whatsapp"
                          ? "WhatsApp"
                          : "Web Widget"}{" "}
                      channel has been created and is ready to receive messages.
                    </p>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 w-full max-w-md">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                          <svg
                            className="w-4 h-4 text-blue-600"
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
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900">
                            Next Steps
                          </p>
                          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            {selectedChannelType === "telegram"
                              ? "Your Telegram bot is now active. Share your bot link with customers to start conversations."
                              : selectedChannelType === "whatsapp"
                                ? "Your WhatsApp Business account is now connected. Start receiving messages from your customers through WhatsApp."
                                : "Configure your web widget settings and install the script on your website to start engaging with visitors."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isCreatingInbox && (
                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={onClose} className="min-w-32">
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </StepperContent>
          </div>
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};
