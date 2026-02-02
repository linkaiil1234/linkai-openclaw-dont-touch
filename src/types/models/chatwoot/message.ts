// Chatwoot Message Types

export type TChatwootMessageType =
  | "incoming"
  | "outgoing"
  | "activity"
  | "template";

export type TChatwootMessageContentType =
  | "text"
  | "input_text"
  | "input_textarea"
  | "input_email"
  | "input_select"
  | "cards"
  | "form"
  | "article"
  | "incoming_email"
  | "input_csat";

export type TChatwootMessageStatus =
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "progress";

export type TChatwootAttachment = {
  id: number;
  message_id: number;
  file_type: "image" | "audio" | "video" | "file" | "location" | "fallback";
  account_id: number;
  extension: string | null;
  data_url: string;
  thumb_url: string | null;
  file_size: number;
  width: number | null;
  height: number | null;
  coordinates_lat: number | null;
  coordinates_long: number | null;
  created_at: string;
};

export type TChatwootMessageSender = {
  id: number;
  name: string;
  email: string | null;
  type: "contact" | "user";
  thumbnail: string;
  custom_attributes: Record<string, unknown>;
  additional_attributes: Record<string, unknown>;
  availability_status: string | null;
};

export type TChatwootMessage = {
  id: number;
  content: string;
  content_type: TChatwootMessageContentType;
  content_attributes: Record<string, unknown>;
  message_type: TChatwootMessageType;
  created_at: number;
  private: boolean;
  attachment: TChatwootAttachment | null;
  attachments: TChatwootAttachment[];
  sender: TChatwootMessageSender | null;
  conversation_id: number;
  inbox_id: number;
  account_id: number;
  source_id: string | null;
  status: TChatwootMessageStatus;
  external_source_ids: Record<string, unknown>;
};

export type TChatwootMessageListMeta = {
  mine_count: number;
  unassigned_count: number;
};

export type TChatwootMessageListData = {
  meta: TChatwootMessageListMeta;
  payload: TChatwootMessage[];
};

// Conversation Messages Response Type

export type TBrowserInfo = {
  device_name: string;
  browser_name: string;
  platform_name: string;
  browser_version: string;
  platform_version: string;
};

export type TInitiatedAt = {
  timestamp: string;
};

export type TAdditionalAttributes = {
  browser?: TBrowserInfo;
  referer?: string;
  initiated_at?: TInitiatedAt;
  browser_language?: string;
  [key: string]: unknown;
};

export type TContact = {
  additional_attributes: Record<string, unknown>;
  custom_attributes: Record<string, unknown>;
  email: string | null;
  id: number;
  identifier: string | null;
  name: string;
  phone_number: string | null;
  thumbnail: string;
  blocked: boolean;
  type: "contact";
};

export type TConversationMeta = {
  labels: string[];
  additional_attributes: TAdditionalAttributes;
  contact: TContact;
  agent_last_seen_at: string;
  assignee_last_seen_at: string | null;
};

export type TMessageSender = {
  additional_attributes: Record<string, unknown>;
  custom_attributes: Record<string, unknown>;
  email: string | null;
  id: number;
  identifier: string | null;
  name: string;
  phone_number: string | null;
  thumbnail: string;
  blocked: boolean;
  type: "contact";
};

export type TContentAttributes = {
  in_reply_to?: string | null;
  [key: string]: unknown;
};

export type TMessageType = 0 | 1 | 2 | 3;

export type TContentType =
  | "text"
  | "input_email"
  | "input_text"
  | "input_select"
  | "cards"
  | "form"
  | "article"
  | "incoming_email"
  | "input_csat";

export type TMessageStatus = "sent" | "delivered" | "read" | "failed";

export type TMessageAttachment = {
  id: number;
  message_id: number;
  file_type: "image" | "audio" | "video" | "file" | "location" | "fallback";
  account_id: number;
  extension: string | null;
  data_url: string;
  thumb_url: string | null;
  file_size: number;
  width: number | null;
  height: number | null;
};

export type TMessage = {
  id: number;
  content: string | null;
  inbox_id: number;
  conversation_id: number;
  message_type: TMessageType;
  content_type: TContentType;
  status: TMessageStatus;
  content_attributes: TContentAttributes;
  created_at: number;
  private: boolean;
  source_id: string | null;
  sender?: TMessageSender;
  attachments?: TMessageAttachment[];
};

export type TConversationMessagesResult = {
  meta: TConversationMeta;
  payload: TMessage[];
};
