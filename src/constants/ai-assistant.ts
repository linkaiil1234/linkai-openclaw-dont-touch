import {
  Analytics01Icon,
  ChatBotFreeIcons,
  File01FreeIcons,
  FlowConnectionFreeIcons,
  FlowCircleFreeIcons,
  Home01FreeIcons,
  MessageMultiple01FreeIcons,
  UserMultipleIcon,
  Settings01Icon,
  CustomerSupportIcon,
  InformationCircleIcon,
  BookOpen01Icon,
  Search01Icon,
  Upload01Icon,
  Folder01Icon,
  LockIcon,
  ApiIcon,
  WebhookIcon,
  ChartHistogramIcon,
  FileDownloadIcon,
  UserAdd01Icon,
  FilterIcon,
  UserIcon,
  ZapIcon,
  TaskAdd01Icon,
  CreditCardIcon,
  DashboardCircleIcon,
} from "@hugeicons/core-free-icons";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface PageContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  helpOptions: Array<{ title: string; description: string; icon: any }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quickLinks: Array<{ name: string; path: string; icon: any }>;
  responses: string[];
}

// Context-aware data based on current page
export const PAGE_CONTEXTS: Record<string, PageContext> = {
  "/dashboard": {
    helpOptions: [
      {
        title: "Get Tutorial for Dashboard",
        description:
          "Interactive guide to navigate and understand your dashboard",
        icon: BookOpen01Icon,
      },
      {
        title: "Dashboard Overview",
        description: "Learn how to read your dashboard metrics",
        icon: DashboardCircleIcon,
      },
      {
        title: "Customize Widgets",
        description: "Personalize your dashboard layout",
        icon: Settings01Icon,
      },
      {
        title: "Export Reports",
        description: "Download your analytics data",
        icon: FileDownloadIcon,
      },
    ],
    quickLinks: [
      { name: "Analytics", path: "/insights-analytics", icon: Analytics01Icon },
      { name: "Customers", path: "/customers", icon: UserMultipleIcon },
      { name: "Agents", path: "/agents", icon: ChatBotFreeIcons },
      { name: "Settings", path: "/settings", icon: Settings01Icon },
    ],
    responses: [
      "Your dashboard shows real-time metrics and analytics. Would you like me to explain any specific widget?",
      "You can customize your dashboard by dragging and dropping widgets. Try clicking on the settings icon!",
      "The dashboard provides an overview of your key performance indicators. Need help understanding any metric?",
      "I can help you navigate through your dashboard data. What specific information are you looking for?",
    ],
  },
  "/customers": {
    helpOptions: [
      {
        title: "Get Tutorial for Customers",
        description: "Learn how to manage and organize your customer database",
        icon: BookOpen01Icon,
      },
      {
        title: "Add New Customer",
        description: "Create and manage customer profiles",
        icon: UserAdd01Icon,
      },
      {
        title: "Customer Segments",
        description: "Organize customers into groups",
        icon: FilterIcon,
      },
      {
        title: "Import/Export",
        description: "Bulk manage customer data",
        icon: FileDownloadIcon,
      },
    ],
    quickLinks: [
      { name: "Dashboard", path: "/dashboard", icon: Home01FreeIcons },
      { name: "Inbox", path: "/inbox", icon: MessageMultiple01FreeIcons },
      { name: "Agents", path: "/agents", icon: ChatBotFreeIcons },
      { name: "Analytics", path: "/insights-analytics", icon: Analytics01Icon },
    ],
    responses: [
      "You can add new customers by clicking the 'Add Customer' button in the top right corner.",
      "To manage customer segments, use the filter options and create custom groups based on criteria.",
      "Customer profiles contain contact information, interaction history, and custom fields you can configure.",
      "Would you like help searching for a specific customer or understanding the customer table?",
    ],
  },
  "/agents": {
    helpOptions: [
      {
        title: "Get Tutorial for Agents",
        description:
          "Step-by-step guide to create and configure your AI agents",
        icon: BookOpen01Icon,
      },
      {
        title: "Create AI Agent",
        description: "Set up a new conversational agent",
        icon: ChatBotFreeIcons,
      },
      {
        title: "Agent Training",
        description: "Improve agent responses and knowledge",
        icon: BookOpen01Icon,
      },
      {
        title: "Deploy Agent",
        description: "Publish your agent to channels",
        icon: FlowCircleFreeIcons,
      },
    ],
    quickLinks: [
      { name: "Dashboard", path: "/dashboard", icon: Home01FreeIcons },
      {
        name: "Integrations",
        path: "/integrations",
        icon: FlowCircleFreeIcons,
      },
      { name: "Inbox", path: "/inbox", icon: MessageMultiple01FreeIcons },
      { name: "Actions", path: "/actions", icon: FlowConnectionFreeIcons },
    ],
    responses: [
      "AI agents can be configured with custom knowledge bases and conversation flows. Need help setting one up?",
      "You can train your agents by adding FAQs, documents, and example conversations.",
      "Each agent can be deployed to multiple channels like web chat, WhatsApp, or Slack.",
      "Would you like assistance with agent configuration or testing your agent?",
    ],
  },
  "/inbox": {
    helpOptions: [
      {
        title: "Get Tutorial for Inbox",
        description: "Master conversation management and messaging features",
        icon: BookOpen01Icon,
      },
      {
        title: "Managing Conversations",
        description: "Handle customer messages efficiently",
        icon: MessageMultiple01FreeIcons,
      },
      {
        title: "Assign to Agents",
        description: "Route conversations to team members",
        icon: UserMultipleIcon,
      },
      {
        title: "Quick Replies",
        description: "Use templates for faster responses",
        icon: ZapIcon,
      },
    ],
    quickLinks: [
      { name: "Customers", path: "/customers", icon: UserMultipleIcon },
      { name: "Agents", path: "/agents", icon: ChatBotFreeIcons },
      { name: "Dashboard", path: "/dashboard", icon: Home01FreeIcons },
      { name: "Settings", path: "/settings", icon: Settings01Icon },
    ],
    responses: [
      "Your inbox shows all active conversations. You can filter by status, agent, or channel.",
      "To respond to a message, click on the conversation and type your reply in the input field.",
      "You can assign conversations to specific team members using the assignment dropdown.",
      "Quick replies help you respond faster. Set them up in Settings > Templates.",
    ],
  },
  "/settings": {
    helpOptions: [
      {
        title: "Get Tutorial for Settings",
        description: "Navigate account settings and configuration options",
        icon: BookOpen01Icon,
      },
      {
        title: "Account Settings",
        description: "Manage your profile and preferences",
        icon: UserIcon,
      },
      {
        title: "Team Management",
        description: "Add and manage team members",
        icon: UserMultipleIcon,
      },
      {
        title: "Billing & Plans",
        description: "Manage subscription and payments",
        icon: CreditCardIcon,
      },
    ],
    quickLinks: [
      { name: "Dashboard", path: "/dashboard", icon: Home01FreeIcons },
      { name: "Subscription", path: "/subcription", icon: CreditCardIcon },
      {
        name: "Integrations",
        path: "/integrations",
        icon: FlowCircleFreeIcons,
      },
      { name: "Agents", path: "/agents", icon: ChatBotFreeIcons },
    ],
    responses: [
      "In settings, you can customize your account, manage team members, and configure preferences.",
      "To change your notification settings, go to the Notifications tab in settings.",
      "You can manage your subscription and billing information in the Billing section.",
      "Need help with a specific setting? Let me know which section you're looking at!",
    ],
  },
  "/integrations": {
    helpOptions: [
      {
        title: "Get Tutorial for Integrations",
        description: "Learn how to connect and manage third-party integrations",
        icon: BookOpen01Icon,
      },
      {
        title: "Connect Apps",
        description: "Integrate with third-party services",
        icon: FlowCircleFreeIcons,
      },
      {
        title: "API Access",
        description: "Use our REST API for custom integrations",
        icon: ApiIcon,
      },
      {
        title: "Webhooks",
        description: "Set up real-time event notifications",
        icon: WebhookIcon,
      },
    ],
    quickLinks: [
      { name: "Dashboard", path: "/dashboard", icon: Home01FreeIcons },
      { name: "Agents", path: "/agents", icon: ChatBotFreeIcons },
      { name: "Settings", path: "/settings", icon: Settings01Icon },
      { name: "Actions", path: "/actions", icon: FlowConnectionFreeIcons },
    ],
    responses: [
      "Integrations allow you to connect with popular platforms like Slack, WhatsApp, and CRM systems.",
      "Each integration has its own setup guide. Click on an integration to see the connection steps.",
      "You can manage API keys and webhooks in the integrations settings.",
      "Need help connecting a specific platform? I can guide you through the process!",
    ],
  },
  "/insights-analytics": {
    helpOptions: [
      {
        title: "Get Tutorial for Analytics",
        description:
          "Explore analytics features and understand your data insights",
        icon: BookOpen01Icon,
      },
      {
        title: "Reports Overview",
        description: "Understanding your analytics data",
        icon: Analytics01Icon,
      },
      {
        title: "Custom Reports",
        description: "Create personalized analytics views",
        icon: ChartHistogramIcon,
      },
      {
        title: "Data Export",
        description: "Download analytics for external use",
        icon: FileDownloadIcon,
      },
    ],
    quickLinks: [
      { name: "Dashboard", path: "/dashboard", icon: Home01FreeIcons },
      { name: "Customers", path: "/customers", icon: UserMultipleIcon },
      { name: "Agents", path: "/agents", icon: ChatBotFreeIcons },
      { name: "Inbox", path: "/inbox", icon: MessageMultiple01FreeIcons },
    ],
    responses: [
      "Analytics provide insights into conversation trends, agent performance, and customer satisfaction.",
      "You can filter reports by date range, agent, or customer segment to drill down into specific data.",
      "The analytics dashboard updates in real-time as new conversations occur.",
      "Would you like help interpreting any specific metric or creating a custom report?",
    ],
  },
  "/actions": {
    helpOptions: [
      {
        title: "Get Tutorial for Actions",
        description: "Master workflow automation and action triggers",
        icon: BookOpen01Icon,
      },
      {
        title: "Create Workflow",
        description: "Automate tasks and processes",
        icon: FlowConnectionFreeIcons,
      },
      {
        title: "Action Triggers",
        description: "Set up conditions for automation",
        icon: ZapIcon,
      },
      {
        title: "Action History",
        description: "View executed automation logs",
        icon: TaskAdd01Icon,
      },
    ],
    quickLinks: [
      { name: "Agents", path: "/agents", icon: ChatBotFreeIcons },
      {
        name: "Integrations",
        path: "/integrations",
        icon: FlowCircleFreeIcons,
      },
      { name: "Dashboard", path: "/dashboard", icon: Home01FreeIcons },
      { name: "Settings", path: "/settings", icon: Settings01Icon },
    ],
    responses: [
      "Actions help you automate repetitive tasks based on specific triggers and conditions.",
      "You can create workflows that trigger when certain events occur, like new messages or customer tags.",
      "Actions can integrate with external services to update CRMs, send notifications, or create tasks.",
      "Need help setting up an automation workflow? I can walk you through it!",
    ],
  },
  "/files": {
    helpOptions: [
      {
        title: "Get Tutorial for Files",
        description:
          "Learn file management, organization, and sharing features",
        icon: BookOpen01Icon,
      },
      {
        title: "Upload Files",
        description: "Add documents and media to your library",
        icon: Upload01Icon,
      },
      {
        title: "Organize Files",
        description: "Create folders and manage storage",
        icon: Folder01Icon,
      },
      {
        title: "Share & Permissions",
        description: "Control file access for team members",
        icon: LockIcon,
      },
    ],
    quickLinks: [
      { name: "Dashboard", path: "/dashboard", icon: Home01FreeIcons },
      { name: "Customers", path: "/customers", icon: UserMultipleIcon },
      { name: "Agents", path: "/agents", icon: ChatBotFreeIcons },
      { name: "Settings", path: "/settings", icon: Settings01Icon },
    ],
    responses: [
      "You can upload files by dragging and dropping them or using the upload button.",
      "Files can be organized into folders and tagged for easy searching.",
      "Uploaded files can be used in agent knowledge bases or shared with customers.",
      "Need help finding a specific file or managing your storage?",
    ],
  },
};

// Default fallback data
export const DEFAULT_CONTEXT: PageContext = {
  helpOptions: [
    {
      title: "Getting Started",
      description: "Learn the basics and set up your account",
      icon: InformationCircleIcon,
    },
    {
      title: "Troubleshooting",
      description: "Find solutions to common issues",
      icon: Search01Icon,
    },
    {
      title: "Contact Support",
      description: "Get in touch with our support team",
      icon: CustomerSupportIcon,
    },
  ],
  quickLinks: [
    { name: "Dashboard", path: "/dashboard", icon: Home01FreeIcons },
    { name: "Customers", path: "/customers", icon: UserMultipleIcon },
    { name: "Agents", path: "/agents", icon: ChatBotFreeIcons },
    { name: "Inbox", path: "/inbox", icon: MessageMultiple01FreeIcons },
    { name: "Settings", path: "/settings", icon: Settings01Icon },
    { name: "Analytics", path: "/insights-analytics", icon: Analytics01Icon },
    { name: "Integrations", path: "/integrations", icon: FlowCircleFreeIcons },
    { name: "Files", path: "/files", icon: File01FreeIcons },
  ],
  responses: [
    "I'd be happy to help you with that! Based on your query, I suggest checking the dashboard for detailed analytics.",
    "That's a great question! You can find more information in the settings section under preferences.",
    "I understand what you're looking for. Let me guide you through the process step by step.",
    "Thanks for asking! This feature is available in the integrations tab. Would you like me to show you how?",
    "I'm here to assist! You can access that functionality through the quick actions menu.",
    "Great! I can help you with that. First, navigate to the relevant section and then...",
  ],
};
