import type { TourStep } from "@/components/tour/product-tour";

export interface PageTourConfig {
  pageName: string;
  steps: TourStep[];
}

export const tourConfigs: Record<string, PageTourConfig> = {
  agents: {
    pageName: "Agents",
    steps: [
      {
        target: "#create-agent-card",
        title: "Welcome to LinkAI Agents! 🤖",
        content:
          "Start by creating your first AI agent. Click this card to configure an agent that can handle customer interactions across multiple channels.",
        placement: "bottom",
        spotlightPadding: 16,
      },
      {
        target: "#sidebar-inbox",
        title: "Manage Conversations 💬",
        content:
          "Access all your customer conversations in the Inbox. Review, respond, and manage interactions seamlessly.",
        placement: "bottom",
        spotlightPadding: 3,
      },
      {
        target: "#sidebar-customers",
        title: "Customer Management 👥",
        content:
          "View and manage all your customers in one place. Track customer interactions, history, and engagement patterns.",
        placement: "bottom",
        spotlightPadding: 10,
      },
      {
        target: "#sidebar-integrations",
        title: "Connect Integrations 🔌",
        content:
          "Integrate your AI agents with various channels and platforms. Connect WhatsApp, Email, Telegram, and more.",
        placement: "bottom",
        spotlightPadding: 10,
      },
      {
        target: "#sidebar-settings",
        title: "Profile & Settings ⚙️",
        content:
          "Access your profile settings, manage your account preferences, and log out from here. Keep your account secure and personalized.",
        placement: "top-right-corner",
        spotlightPadding: 10,
      },
    ],
  },
  inbox: {
    pageName: "Inbox",
    steps: [
      {
        target: ".chat-boxes-sidebar",
        title: "Welcome to Your Inbox! 💬",
        content:
          "This is your central hub for all customer conversations. Here you'll see conversations from WhatsApp, Telegram, Email, Instagram, SMS, and more - all in one place.",
        placement: "right",
        spotlightPadding: 12,
      },
      {
        target: ".inbox-search-bar-wrapper",
        title: "Search Conversations 🔍",
        content:
          "Quickly find any conversation by typing the customer's name or email. The search updates in real-time as you type, making it easy to locate specific conversations.",
        placement: "bottom",
        spotlightPadding: 8,
      },
      {
        target: ".refresh-conversations-button",
        title: "Sync Conversations 🔄",
        content:
          "Click this button to manually refresh and sync all conversations. Use it if you're expecting new messages or want to ensure you have the latest updates.",
        placement: "bottom",
        spotlightPadding: 8,
      },
      {
        target: ".add-new-channel-button",
        title: "Add New Channel ➕",
        content:
          "Connect new communication channels to your inbox. Add WhatsApp, Telegram, Instagram, Email, SMS, or Web Widget to expand where your customers can reach you.",
        placement: "bottom",
        spotlightPadding: 8,
      },
      {
        target: ".conversation-list",
        title: "Your Conversations List 📋",
        content:
          "Each conversation card shows the customer's name, last message preview, timestamp, and channel badge. Green dots indicate unread messages. Click any conversation to open it.",
        placement: "right",
        spotlightPadding: 12,
      },
      {
        target: ".message-list-section",
        title: "Chat & Manage Messages 💬",
        content:
          "View complete conversation threads here. Your AI agents automatically respond to customers, but you can take control anytime by sending a manual message or toggling the agent on/off.",
        placement: "left",
        spotlightPadding: 12,
      },
    ],
  },
  customers: {
    pageName: "Customers",
    steps: [
      {
        target: ".customers-table",
        title: "Customer Management 👥",
        content:
          "View all your customers in one organized table. See their contact info, channels, status, and interaction history at a glance.",
        placement: "top",
        spotlightPadding: 12,
      },
      {
        target: ".customer-search-bar",
        title: "Search & Filter",
        content:
          "Quickly find customers by name or email. Use the sort options to organize your customer list by different criteria.",
        placement: "bottom",
        spotlightPadding: 8,
      },
      {
        target: ".customer-channels-column",
        title: "Multi-Channel Presence",
        content:
          "See which channels each customer is connected through - WhatsApp, Email, Telegram, SMS, and more. One customer can be reached across multiple platforms.",
        placement: "left",
        spotlightPadding: 8,
      },
    ],
  },
  integrations: {
    pageName: "Integrations",
    steps: [
      {
        target: ".integration-categories",
        title: "Integration Categories 🔌",
        content:
          "Browse integrations by category - Communication, Project Management, Productivity, and more. Find the perfect tools to enhance your AI agents.",
        placement: "right",
        spotlightPadding: 12,
      },
      {
        target: ".integration-search",
        title: "Search Integrations",
        content:
          "Looking for something specific? Use the search to quickly find integrations by name or description.",
        placement: "bottom",
        spotlightPadding: 8,
      },
    ],
  },
  // dashboard: {
  //   pageName: "Dashboard",
  //   steps: [
  //     {
  //       target: "#sidebar-dashboard",
  //       title: "Dashboard Overview 📊",
  //       content:
  //         "View your analytics, conversations, and performance metrics all in one place. Track your agent's success here!",
  //       placement: "right",
  //       spotlightPadding: 10,
  //     },
  //     {
  //       target: "#sidebar-inbox",
  //       title: "Manage Conversations 💬",
  //       content:
  //         "Access all your customer conversations in the Inbox. Review, respond, and manage interactions seamlessly.",
  //       placement: "right",
  //       spotlightPadding: 10,
  //     },
  //     {
  //       target: "#sidebar-customers",
  //       title: "Customer Management 👥",
  //       content:
  //         "View and manage all your customers in one place. Track customer interactions, history, and engagement patterns.",
  //       placement: "right",
  //       spotlightPadding: 10,
  //     },
  //     {
  //       target: "#sidebar-integrations",
  //       title: "Connect Integrations 🔌",
  //       content:
  //         "Integrate your AI agents with various channels and platforms. Connect WhatsApp, Email, Telegram, and more.",
  //       placement: "right",
  //       spotlightPadding: 10,
  //     },
  //     {
  //       target: "#sidebar-settings",
  //       title: "Profile & Settings ⚙️",
  //       content:
  //         "Access your profile, manage account settings, and log out from here. Click on your avatar to see more options.",
  //       placement: "right",
  //       spotlightPadding: 10,
  //     },
  //   ],
  // },
  agentTrain: {
    pageName: "Agent Training",
    steps: [
      {
        target: ".edit-ai-agent",
        title: "Edit AI Agent 🤖",
        content:
          "Edit the agent's behavior, preferences, and more. Make changes to the agent's personality, tone, and style of the agent's responses. You can also set the agent's preferences for different channels.",
        placement: "top",
        spotlightPadding: 12,
        requiredTab: "edit",
      },
      {
        target: ".behavior-section",
        title: "Set Agent Behavior 🤖",
        content:
          "Set the behavior of your agent. This includes the personality, tone, and style of the agent's responses. You can also set the agent's preferences for different channels.",
        placement: "right",
        spotlightPadding: 12,
        requiredTab: "settings",
      },
      {
        target: ".channels-section",
        title: "Connect Communication Channels 📱",
        content:
          "Integrate your agent with popular messaging platforms like WhatsApp, Facebook Messenger, Telegram, Instagram, Email, and SMS. Your agent can interact with customers across all these channels simultaneously.",
        placement: "right",
        spotlightPadding: 12,
        requiredTab: "settings",
      },
      {
        target: ".tools-section",
        title: "Supercharge with Tools & Integrations 🔧",
        content:
          "Connect powerful tools and services to extend your agent's capabilities. Integrate with CRMs, databases, APIs, and third-party services to automate workflows and provide richer interactions.",
        placement: "right",
        spotlightPadding: 12,
        requiredTab: "settings",
      },
      {
        target: ".knowledge-base-section",
        title: "Build Your Knowledge Base 📚",
        content:
          "Upload files, add text snippets, or crawl websites to train your agent. The more quality data you provide, the smarter your agent becomes. Supports PDFs, documents, text files, and web pages.",
        placement: "right",
        spotlightPadding: 12,
        requiredTab: "settings",
      },
      {
        target: ".agent-details-section",
        title: "Agent Details 🤖",
        content:
          "View and edit the agent's details, name, description, and status. You can also set the agent's preferences for different channels.",
        placement: "right",
        spotlightPadding: 12,
        requiredTab: "settings",
      },
      {
        target: ".chat-playground-section",
        title: "Test & Train in Real-Time 💬",
        content:
          "This is your agent training playground! Chat with your agent to test its responses, identify areas for improvement, and see how it handles different scenarios. Every conversation helps your agent learn and improve.",
        placement: "left",
        spotlightPadding: 12,
      },
      {
        target: ".preview-chat-toggle",
        title: "Preview Chat 💬",
        content:
          "Toggle between preview and full chat mode to see how your agent would respond in a real conversation.",
        placement: "left-chat-preview-toggle",
        spotlightPadding: 12,
      },
    ],
  },
};
