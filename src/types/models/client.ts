import { CHANNELS } from "@/constants/common";
import { TDocument } from "../common";
import { TInbox } from "./inbox";
import { TInboxMessage } from "./inbox-message";
import { TUser } from "./user";
import { TChannelName } from "./channel";

export type TClient = TDocument & {
  contact_id: number;
  platform_id: string;
  channel: TChannelName;
  name?: string;
  last_message?: TInboxMessage;
  email?: string;
  phone?: string;
  username?: string;
  thumbnail?: string;
  language?: string;
  social_profiles?: Record<string, unknown>;
  custom_attributes?: Record<string, unknown>;
  first_seen?: Date;
  last_activity?: Date;
  total_conversations?: number;
  status?: string;
  last_synced_at?: Date;
  chatwoot_updated_at?: Date;
  user: TUser["_id"];
};
