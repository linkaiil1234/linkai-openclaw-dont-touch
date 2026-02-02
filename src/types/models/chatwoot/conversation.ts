// Chatwoot Conversation Types

export type TChatwootConversationStatus =
  | "open"
  | "resolved"
  | "pending"
  | "snoozed";
export type TChatwootAssigneeType = "me" | "unassigned" | "all" | "assigned";
export type TMessageType = 0 | 1 | 2; // 0: incoming, 1: outgoing, 2: activity
export type TMessageStatus = "sent" | "delivered" | "read" | "failed";
export type TContentType =
  | "text"
  | "input_text"
  | "input_textarea"
  | "input_email"
  | "input_select"
  | "cards"
  | "form"
  | "article"
  | "incoming_email"
  | "input_csat"
  | "sticker";
export type TSenderType = "User" | "Contact" | "AgentBot";
export type TAvailabilityStatus = "online" | "offline" | "busy";

// Contact types
export type TContactAdditionalAttributes = {
  username?: string | null;
  language_code?: string;
  avatar_url_hash?: string;
  last_avatar_sync_at?: string;
  social_telegram_user_id?: number;
  social_telegram_user_name?: string | null;
} & Record<string, unknown>;

export type TChatwootContact = {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  thumbnail: string;
  additional_attributes: TContactAdditionalAttributes;
  custom_attributes: Record<string, unknown>;
  identifier: string | null;
  blocked: boolean;
  availability_status: TAvailabilityStatus;
  created_at: number;
  last_activity_at: number;
};

// Sender in message
export type TMessageSender = {
  id: number;
  name: string;
  available_name: string;
  avatar_url: string;
  type: string;
  availability_status: TAvailabilityStatus;
  thumbnail: string;
};

// Contact inbox within conversation context
export type TContactInbox = {
  source_id: string;
};

// Conversation context within message
export type TMessageConversationContext = {
  assignee_id: number | null;
  unread_count: number;
  last_activity_at: number;
  contact_inbox: TContactInbox;
};

// Message type
export type TChatwootMessage = {
  id: number;
  content: string;
  account_id: number;
  inbox_id: number;
  conversation_id: number;
  message_type: TMessageType;
  created_at: number;
  updated_at: string;
  private: boolean;
  status: TMessageStatus;
  source_id: string | null;
  content_type: TContentType;
  content_attributes: Record<string, unknown>;
  sender_type: TSenderType;
  sender_id: number;
  external_source_ids: Record<string, unknown>;
  additional_attributes: Record<string, unknown>;
  processed_message_content: string;
  sentiment: Record<string, unknown>;
  conversation: TMessageConversationContext;
  sender: TMessageSender;
};

// Browser info for web widget conversations
export type TBrowserInfo = {
  device_name: string;
  browser_name: string;
  platform_name: string;
  browser_version: string;
  platform_version: string;
};

// Additional attributes for conversations
export type TConversationAdditionalAttributes = {
  chat_id?: number;
  business_connection_id?: number | null;
  browser?: TBrowserInfo;
  referer?: string;
  initiated_at?: {
    timestamp: string;
  };
  browser_language?: string;
} & Record<string, unknown>;

// Conversation meta
export type TConversationMeta = {
  sender: TChatwootContact;
  channel: string;
  hmac_verified: boolean;
};

// Main conversation type
export type TChatwootConversation = {
  id: number;
  account_id: number;
  inbox_id: number;
  status: TChatwootConversationStatus;
  timestamp: number;
  contact_last_seen_at: number;
  agent_last_seen_at: number;
  assignee_last_seen_at: number;
  unread_count: number;
  additional_attributes: TConversationAdditionalAttributes;
  custom_attributes: Record<string, unknown>;
  can_reply: boolean;
  uuid: string;
  messages: TChatwootMessage[];
  meta: TConversationMeta;
  labels: string[];
  muted: boolean;
  snoozed_until: number | null;
  created_at: number;
  updated_at: number;
  first_reply_created_at: number | null;
  last_non_activity_message: TChatwootMessage | null;
  last_activity_at: number;
  priority: string | null;
  waiting_since: number;
  sla_policy_id: number | null;
};

// List meta
export type TChatwootConversationListMeta = {
  mine_count: number;
  unassigned_count: number;
  assigned_count: number;
  all_count: number;
};

// List data
export type TChatwootConversationListData = {
  meta: TChatwootConversationListMeta;
  payload: TChatwootConversation[];
};
