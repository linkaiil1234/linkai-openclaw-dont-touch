import { CHANNELS } from "@/constants/common";
import { TDocument } from "../common";

export type TChannel = TDocument & {
  name?: string;
  icon?: string;
  type: TChannelType;
};

export type TChannelType = (typeof CHANNEL_TYPES)[number];
export type TChannelName = (typeof CHANNELS)[number];

export const CHANNEL_TYPES = ["whatsapp", "telegram", "email", "sms"] as const;
