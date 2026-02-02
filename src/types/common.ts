import {
  AGENT_STATUSES,
  AUTH_TYPES,
  CONVERSATION_STATUSES,
  MESSAGE_ROLES,
  PROCESSING_STATUSES,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUSES,
  USAGE_ACTION_TYPES,
} from "@/constants/common";

export type TDocument = {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type TSubmitChatPayload = {
  conversation_id: string;
  user_message: string;
  files: File[];
};

export type TAuthType = (typeof AUTH_TYPES)[number];

export type TSubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export type TSubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export type TAgentStatus = (typeof AGENT_STATUSES)[number];

export type TConversationStatus = (typeof CONVERSATION_STATUSES)[number];

export type TMessageRole = (typeof MESSAGE_ROLES)[number];

export type TUsageActionType = (typeof USAGE_ACTION_TYPES)[number];

export type TProcessingStatus = (typeof PROCESSING_STATUSES)[number];
