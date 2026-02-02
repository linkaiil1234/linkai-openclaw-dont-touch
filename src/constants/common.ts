import { TInboxMessage } from "@/types/models/inbox-message";

export const SITE_CONFIG = {
  name: "LinkAiil",
  url: "https://linkaiil.com",
  description: "The AI for modern applications.",
  baseLinks: {
    home: "/",
    about: "/about",
    changelog: "/changelog",
    pricing: "/pricing",
    imprint: "/imprint",
    privacy: "/privacy",
    terms: "/terms",
  },
};

export type TSiteConfig = typeof SITE_CONFIG;

export const AUTH_TYPES = [
  "google",
  "microsoft",
  "email_password",
  "anonymous",
] as const;

export const FIREBASE_ERROR_CODES = [
  "auth/invalid-credential",
  "auth/email-already-in-use",
  "auth/weak-password",
  "auth/user-not-found",
  "auth/wrong-password",
  "auth/invalid-email",
  "auth/user-disabled",
  "auth/too-many-requests",
  "auth/operation-not-allowed",
  "auth/network-request-failed",
  "auth/invalid-verification-code",
  "auth/invalid-verification-id",
  "auth/invalid-action-code",
  "auth/expired-action-code",
  "auth/user-mismatch",
];

export type TFirebaseErrorCodes = (typeof FIREBASE_ERROR_CODES)[number];

export const FIREBASE_ERROR_CODES_MESSAGES: Record<
  TFirebaseErrorCodes,
  string
> = {
  "auth/invalid-credential": "Invalid email or password",
  "auth/email-already-in-use": "Email already in use. Try login using Google",
  "auth/weak-password": "Password is too weak",
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Wrong password",
  "auth/invalid-email": "Invalid email",
  "auth/user-disabled": "User disabled",
  "auth/too-many-requests": "Too many requests. Please try again later.",
  "auth/operation-not-allowed": "Operation not allowed",
  "auth/network-request-failed": "Network request failed",
  "auth/invalid-verification-code": "Invalid verification code",
  "auth/invalid-verification-id": "Invalid verification ID",
  "auth/invalid-action-code":
    "Invalid or expired reset code. Please request a new password reset.",
  "auth/expired-action-code":
    "Password reset code has expired. Please request a new one.",
  "auth/user-mismatch":
    "The provided credentials do not correspond to the previously signed in user.",
};

export const AUTH_ACTION_STATUSES = ["verifying", "success", "error"] as const;

export const SUBSCRIPTION_PLANS = [
  "free",
  "standard",
  "pro",
  "enterprise",
] as const;

export const SUBSCRIPTION_STATUSES = [
  "active",
  "canceled",
  "past_due",
  "unpaid",
  "trialing",
] as const;

export const AGENT_STATUSES = ["active", "inactive", "archived"] as const;

export const CONVERSATION_STATUSES = ["active", "archived", "deleted"] as const;

export const MESSAGE_ROLES = ["user", "assistant", "system"] as const;

export const USAGE_ACTION_TYPES = [
  "message",
  "agent_creation",
  "conversation",
  "api_call",
] as const;

export const PROCESSING_STATUSES = [
  "unprocessed",
  "processing",
  "processed",
  "failed",
] as const;

export const PROVIDER_OPTIONS = [
  {
    icon: "https://img.logo.dev/whatsapp.com",
    label: "WhatsApp",
  },
  {
    icon: "https://img.logo.dev/facebook.com",
    label: "Facebook",
  },
  {
    icon: "https://img.logo.dev/telegram.org",
    label: "Telegram",
  },

  {
    icon: "https://img.logo.dev/instagram.com",
    label: "Instagram",
  },
  {
    icon: "https://img.logo.dev/x.com",
    label: "Twitter",
  },
  {
    icon: "https://img.logo.dev/gmail.con",
    label: "Mail",
  },
] as const;

export const INBOX_MESSAGE_ROLE = ["user", "assistant"] as const;

export const LANGUAGE_OPTIONS = [
  {
    value: "english",
    label: "English",
  },
  {
    value: "hindi",
    label: "Hindi",
  },
  {
    value: "urdu",
    label: "Urdu",
  },
  {
    value: "arabic",
    label: "Arabic",
  },
  {
    value: "israeli",
    label: "Israeli",
  },
  {
    value: "spanish",
    label: "Spanish",
  },
  {
    value: "french",
    label: "French",
  },
  {
    value: "german",
    label: "German",
  },
  {
    value: "italian",
    label: "Italian",
  },
  {
    value: "portuguese",
    label: "Portuguese",
  },
  {
    value: "russian",
    label: "Russian",
  },
  {
    value: "japanese",
    label: "Japanese",
  },
  {
    value: "chinese",
    label: "Chinese",
  },
  {
    value: "korean",
    label: "Korean",
  },
] as const;

export const CATEGORY_OPTIONS = [
  {
    value: "customer_support",
    label: "Customer support",
  },
  {
    value: "sales",
    label: "Sales",
  },
  {
    value: "hr",
    label: "HR",
  },
  {
    value: "analytics",
    label: "Analytics",
  },
  {
    value: "operations",
    label: "Operations",
  },
] as const;

export const TONE_OPTIONS = [
  {
    value: "friendly",
    label: "Friendly",
  },
  {
    value: "professional",
    label: "Professional",
  },
  {
    value: "playful",
    label: "Playful",
  },
  {
    value: "direct",
    label: "Direct",
  },
  {
    value: "empathetic",
    label: "Empathetic",
  },
];

// Enhanced static demo conversation data
export const demoMessages: TInboxMessage[] = [
  {
    _id: "msg_001",
    message:
      "Hello! I'm your AI agent training assistant. I'm here to help you configure and train your agent with the right knowledge and capabilities.",
    content:
      "Hello! I'm your AI agent training assistant. I'm here to help you configure and train your agent with the right knowledge and capabilities.",
    sender: "agent",
    role: "assistant",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    _id: "msg_002",
    message:
      "Hi! I want to train my agent to handle customer support inquiries better. What's the best way to start?",
    content:
      "Hi! I want to train my agent to handle customer support inquiries better. What's the best way to start?",
    sender: "user",
    role: "user",
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
  },
  {
    _id: "msg_003",
    message:
      "Great question! To train your agent for customer support, you should:\n\n1. Upload relevant documentation (FAQs, product guides, policies)\n2. Connect to your existing support channels (WhatsApp, Facebook, etc.)\n3. Integrate with your knowledge base tools (Notion, Google Sheets)\n4. Define the tone and personality for responses\n\nWould you like me to guide you through any of these steps?",
    content:
      "Great question! To train your agent for customer support, you should:\n\n1. Upload relevant documentation (FAQs, product guides, policies)\n2. Connect to your existing support channels (WhatsApp, Facebook, etc.)\n3. Integrate with your knowledge base tools (Notion, Google Sheets)\n4. Define the tone and personality for responses\n\nWould you like me to guide you through any of these steps?",
    sender: "agent",
    role: "assistant",
    createdAt: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
  },
  {
    _id: "msg_004",
    message:
      "Yes! Let's start with uploading documentation. What formats do you support?",
    content:
      "Yes! Let's start with uploading documentation. What formats do you support?",
    sender: "user",
    role: "user",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    _id: "msg_005",
    message:
      "I support multiple formats:\n\n📄 PDF files - Perfect for manuals and guides\n🔗 URLs - I can crawl and learn from your website pages\n📊 Spreadsheets - CSV, Excel files with structured data\n📝 Text documents - Plain text, Markdown, Word docs\n\nYou can drag and drop files here or use the attachment button to upload. I'll process them and extract the key information for training.",
    content:
      "I support multiple formats:\n\n📄 PDF files - Perfect for manuals and guides\n🔗 URLs - I can crawl and learn from your website pages\n📊 Spreadsheets - CSV, Excel files with structured data\n📝 Text documents - Plain text, Markdown, Word docs\n\nYou can drag and drop files here or use the attachment button to upload. I'll process them and extract the key information for training.",
    sender: "agent",
    role: "assistant",
    createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
  },
  {
    _id: "msg_006",
    message:
      "That's helpful! Can you also integrate with our existing tools like Notion and Slack?",
    content:
      "That's helpful! Can you also integrate with our existing tools like Notion and Slack?",
    sender: "user",
    role: "user",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    _id: "msg_007",
    message:
      "Absolutely! I can integrate with 20+ popular tools. Check out the 'Channels' and 'Tools' sections on the left sidebar.\n\n🔧 For Notion: I can access your workspace, read documentation, and even update pages\n💬 For Slack: I can monitor channels, respond to messages, and send notifications\n\nJust click the '+' button next to any tool to connect. The integration takes less than a minute!",
    content:
      "Absolutely! I can integrate with 20+ popular tools. Check out the 'Channels' and 'Tools' sections on the left sidebar.\n\n🔧 For Notion: I can access your workspace, read documentation, and even update pages\n💬 For Slack: I can monitor channels, respond to messages, and send notifications\n\nJust click the '+' button next to any tool to connect. The integration takes less than a minute!",
    sender: "agent",
    role: "assistant",
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
  },
  {
    _id: "msg_008",
    message:
      "Perfect! One more thing - how do I customize the agent's personality and tone?",
    content:
      "Perfect! One more thing - how do I customize the agent's personality and tone?",
    sender: "user",
    role: "user",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    _id: "msg_009",
    message:
      "Great question! You can customize this in the agent settings. You have several options:\n\n✨ Tone Options:\n- Friendly & Casual\n- Professional & Formal  \n- Technical & Precise\n- Empathetic & Supportive\n\n🌍 Language Support:\n- English, Spanish, French, German, and 50+ more\n\n📝 Custom System Prompts:\n- Define specific behaviors and response patterns\n- Add domain-specific knowledge\n- Set boundaries and guidelines\n\nWould you like me to help you configure these settings?",
    content:
      "Great question! You can customize this in the agent settings. You have several options:\n\n✨ Tone Options:\n- Friendly & Casual\n- Professional & Formal  \n- Technical & Precise\n- Empathetic & Supportive\n\n🌍 Language Support:\n- English, Spanish, French, German, and 50+ more\n\n📝 Custom System Prompts:\n- Define specific behaviors and response patterns\n- Add domain-specific knowledge\n- Set boundaries and guidelines\n\nWould you like me to help you configure these settings?",
    sender: "agent",
    role: "assistant",
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    _id: "msg_010",
    message:
      "Yes, let's set the tone to 'Friendly & Professional' and add English as the primary language.",
    content:
      "Yes, let's set the tone to 'Friendly & Professional' and add English as the primary language.",
    sender: "user",
    role: "user",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    _id: "msg_011",
    message:
      "✅ Configuration updated successfully!\n\n📋 Current Settings:\n• Tone: Friendly & Professional\n• Language: English\n• Response Style: Balanced (not too casual, not too formal)\n\nYour agent is now ready to start training! You can:\n1. Upload training documents\n2. Connect integrations\n3. Start a test conversation\n\nWhat would you like to do next?",
    content:
      "✅ Configuration updated successfully!\n\n📋 Current Settings:\n• Tone: Friendly & Professional\n• Language: English\n• Response Style: Balanced (not too casual, not too formal)\n\nYour agent is now ready to start training! You can:\n1. Upload training documents\n2. Connect integrations\n3. Start a test conversation\n\nWhat would you like to do next?",
    sender: "agent",
    role: "assistant",
    createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
  },
];

export const telegramMessages: TInboxMessage[] = [
  {
    _id: "tg-1",
    role: "assistant",
    message:
      "Hello! 👋 Welcome to our Telegram support. How can I help you today?",
    attachments: [],
    createdAt: "2025-12-13T14:15:00.000Z",
    updatedAt: "2025-12-13T14:15:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "tg-2",
    role: "user",
    message: "Hi! I need help with my order status.",
    attachments: [],
    createdAt: "2025-12-13T14:16:00.000Z",
    updatedAt: "2025-12-13T14:16:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "tg-3",
    role: "assistant",
    message:
      "Sure! I'd be happy to help you check your order status. Can you please provide your order number?",
    attachments: [],
    createdAt: "2025-12-13T14:17:00.000Z",
    updatedAt: "2025-12-13T14:17:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "tg-4",
    role: "user",
    message: "My order number is #12345",
    attachments: [],
    createdAt: "2025-12-13T14:18:00.000Z",
    updatedAt: "2025-12-13T14:18:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "tg-5",
    role: "assistant",
    message:
      "Great! I found your order. It's currently being processed and will be shipped within 2-3 business days. You'll receive a tracking number via email once it ships. 📦",
    attachments: [],
    createdAt: "2025-12-13T14:19:00.000Z",
    updatedAt: "2025-12-13T14:19:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "tg-6",
    role: "user",
    message: "Perfect! Thanks for the quick response! 🚀",
    attachments: [],
    createdAt: "2025-12-13T14:20:00.000Z",
    updatedAt: "2025-12-13T14:20:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "tg-7",
    role: "assistant",
    message:
      "You're welcome! If you have any other questions, feel free to ask. Have a great day! 😊",
    attachments: [],
    createdAt: "2025-12-13T14:21:00.000Z",
    updatedAt: "2025-12-13T14:21:00.000Z",
    content: "",
    sender: "",
  },
];

export const initialMessages: TInboxMessage[] = [
  {
    _id: "seed-1",
    role: "assistant",
    message:
      "Hi Emily! Yes, the shipment has been processed, and we expect it to arrive at your warehouse by Friday. I'll send you the tracking details shortly.",
    attachments: [],
    createdAt: "2025-01-25T11:20:00.000Z",
    updatedAt: "2025-01-25T11:20:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-2",
    role: "user",
    message:
      "That's great news! Also, I wanted to discuss the next batch. Can we secure more Air Max and Jordans for the next order? The demand has been really high.",
    attachments: ["Shoe1.src", "Shoe2.src"],
    createdAt: "2025-01-25T11:21:00.000Z",
    updatedAt: "2025-01-25T11:21:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-3",
    role: "assistant",
    message:
      "Thanks for sharing the sales data! We can allocate more units for you. Would you like to keep the same pricing and order volume, or do you need adjustments?",
    attachments: [],
    createdAt: "2025-01-25T11:22:00.000Z",
    updatedAt: "2025-01-25T11:22:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-4",
    role: "user",
    message:
      "Let's increase the Jordan 1 order by 20% since they're selling out fast. Also, do you have any updates on the custom branding options we discussed last time?",
    attachments: [],
    createdAt: "2025-01-25T11:27:00.000Z",
    updatedAt: "2025-01-25T11:27:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-5",
    role: "assistant",
    message:
      "Will do! We're thrilled to keep growing together. Let's make this a big success.",
    attachments: [],
    createdAt: "2025-01-25T11:31:00.000Z",
    updatedAt: "2025-01-25T11:31:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-6",
    role: "assistant",
    message:
      "Regarding the custom branding: I have samples ready. They look fantastic! I've attached photos of the branded shoe boxes and the custom hang tags. Which option do you prefer for the first run?",
    attachments: ["BrandingSample1.src", "BrandingSample2.src"],
    createdAt: "2025-01-25T11:45:00.000Z",
    updatedAt: "2025-01-25T11:45:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-7",
    role: "user",
    message:
      "Wow, the shoe boxes look really professional! Let's go with the matte finish (Sample 1). Can we confirm the lead time for this customized batch?",
    attachments: [],
    createdAt: "2025-01-25T11:50:00.000Z",
    updatedAt: "2025-01-25T11:50:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-8",
    role: "assistant",
    message:
      "Excellent choice. The matte finish adds 7 days to the standard production time. So, for your increased order, the new estimated delivery will be **March 10th**. Does that work for your inventory schedule?",
    attachments: [],
    createdAt: "2025-01-25T11:55:00.000Z",
    updatedAt: "2025-01-25T11:55:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-9",
    role: "user",
    message:
      "March 10th is perfect. Speaking of inventory, I noticed a slight defect rate of 0.5% in the last shipment of Air Max 97s. Can we make sure QC is extra tight on the next one?",
    attachments: [],
    createdAt: "2025-01-25T12:05:00.000Z",
    updatedAt: "2025-01-25T12:05:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-10",
    role: "assistant",
    message:
      "Absolutely. I've flagged this with our Quality Control manager and attached a note specifically to your next order for a triple-check on the Air Max 97s. We apologize for the inconvenience.",
    attachments: [],
    createdAt: "2025-01-25T12:08:00.000Z",
    updatedAt: "2025-01-25T12:08:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-11",
    role: "user",
    message:
      "No problem at all, thanks for the quick resolution. On a different note, do you have a catalog available for the new Spring '26 lineup yet?",
    attachments: [],
    createdAt: "2025-01-26T09:15:00.000Z",
    updatedAt: "2025-01-26T09:15:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-12",
    role: "assistant",
    message:
      "Yes! The digital catalog just went live this morning. I've attached the PDF here. Take a look—there are some exciting new colorways and a brand new running shoe model.",
    attachments: ["Spring26_Catalog.pdf"],
    createdAt: "2025-01-26T09:20:00.000Z",
    updatedAt: "2025-01-26T09:20:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-13",
    role: "user",
    message:
      "Thanks! I'll review it over lunch. Can we schedule a brief 15-minute call for Tuesday at 3 PM to discuss my initial thoughts on the Spring order?",
    attachments: [],
    createdAt: "2025-01-26T09:25:00.000Z",
    updatedAt: "2025-01-26T09:25:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-14",
    role: "assistant",
    message:
      "Tuesday at 3 PM works perfectly for me. I've sent you a calendar invite. Looking forward to reviewing the new line with you!",
    attachments: [],
    createdAt: "2025-01-26T09:30:00.000Z",
    updatedAt: "2025-01-26T09:30:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "seed-15",
    role: "user",
    message: "Awesome, invite received. Talk soon!",
    attachments: [],
    createdAt: "2025-01-26T09:31:00.000Z",
    updatedAt: "2025-01-26T09:31:00.000Z",
    content: "",
    sender: "",
  },
];

export const initialAgentMessages: TInboxMessage[] = [
  {
    _id: "agent-1",
    role: "assistant",
    message:
      "Analytics Agent here. I've completed the quarterly sales analysis. The data shows a 35% increase in sneaker sales compared to Q4. Air Max and Jordan lines are driving most of the growth. Should I generate detailed customer segmentation reports?",
    // attachments: ["Q1_Sales_Report.pdf", "Growth_Metrics.xlsx"],
    createdAt: "2025-01-28T10:15:00.000Z",
    updatedAt: "2025-01-28T10:15:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "agent-2",
    role: "assistant",
    message:
      "Inventory Management Agent acknowledging. Excellent insights! Yes, please generate the segmentation reports. I'm also noticing we need to restock Jordan 1s and Air Max 97s within the next 2 weeks based on current velocity. I've attached the inventory forecast model.",
    // attachments: ["Inventory_Forecast.pdf"],
    createdAt: "2025-01-28T10:18:00.000Z",
    updatedAt: "2025-01-28T10:18:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "agent-3",
    role: "assistant",
    message:
      "Understood. I'm cross-referencing customer purchase patterns with your inventory data. I've identified 3 high-value customer segments that prefer premium lines. Recommendation: Increase premium inventory by 15% and introduce loyalty rewards for top 20% customers.",
    // attachments: ["Customer_Segments.pdf", "Loyalty_Program_Proposal.pdf"],
    createdAt: "2025-01-28T10:25:00.000Z",
    updatedAt: "2025-01-28T10:25:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "agent-4",
    role: "assistant",
    message:
      "Excellent analysis. I'll adjust the procurement schedule accordingly. I'm also implementing automated reorder triggers for items with >80% sell-through rate. This should reduce stockouts by approximately 40%. Syncing this with your customer behavior data now.",
    // attachments: ["Auto_Reorder_Config.json"],
    createdAt: "2025-01-28T10:30:00.000Z",
    updatedAt: "2025-01-28T10:30:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "agent-5",
    role: "assistant",
    message:
      "Perfect synchronization! I'm monitoring the implementation in real-time. Initial projections show this could increase revenue by 22% while reducing carrying costs by 12%. I'll send you daily performance dashboards to track the optimization progress.",
    // attachments: ["Revenue_Projections.xlsx"],
    createdAt: "2025-01-28T10:35:00.000Z",
    updatedAt: "2025-01-28T10:35:00.000Z",
    content: "",
    sender: "",
  },
  {
    _id: "agent-6",
    role: "assistant",
    message:
      "Confirmed. I've set up the automated reporting pipeline. We're now fully integrated. I'll alert you immediately if any inventory thresholds are breached or if customer behavior patterns shift significantly. System optimization complete.",
    // attachments: ["Integration_Status.pdf"],
    createdAt: "2025-01-28T10:40:00.000Z",
    updatedAt: "2025-01-28T10:40:00.000Z",
    content: "",
    sender: "",
  },
];

export const LANGUAGES = [
  "english",
  "spanish",
  "french",
  "german",
  "italian",
  "portuguese",
  "russian",
  "japanese",
  "chinese",
  "korean",
] as const;

export const TONES = [
  "friendly",
  "professional",
  "playful",
  "direct",
  "empathetic",
] as const;

export const CATEGORIES = [
  "customer_support",
  "sales",
  "hr",
  "analytics",
  "operations",
] as const;

export const CHANNELS = [
  "whatsapp",
  "telegram",
  "instagram",
  "email",
  "sms",
  "web",
  "playground",
] as const;
