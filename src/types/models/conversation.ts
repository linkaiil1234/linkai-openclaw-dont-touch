import { TConversationStatus, TDocument } from "../common";
import { TAgent } from "./agent";
import { TChannel } from "./channel";
import { TUser } from "./user";

export type TOldConversation = TDocument & {
  user: TUser["_id"];
  agent: TAgent["_id"];
  conversation_id: string;
  title?: string;
  channel: TChannel["_id"];
  status: TConversationStatus;
  message_count: number;
};

export type TConversation = TDocument & {
  user: TUser["_id"];
  agent: TAgent["_id"];
  chatwoot: {
    conversation_id: number;
    inbox_id: number;
  };
  is_agent_active: boolean;
  is_playground: boolean;
};
