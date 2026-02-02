import { TAgentStatus, TDocument } from "../common";
import { TChannel } from "./channel";
import { TTool } from "./tool";
import { TUser } from "./user";

export type TAgent = TDocument & {
  user: TUser["_id"];
  avatar?: string;
  name: string;
  description?: string;
  system_prompt?: string;
  language?: string;
  tone?: string;
  category?: string;
  status: TAgentStatus;
  deployment_url?: string;
  setup_step: number;
  config: TAgentConfig;
  behavior: TAgentBehavior;
};

export type TAgentConfig = {
  channels: TChannel["_id"][];
  tools: TTool["_id"][];
};

// Type for agent with partially populated config (used when fetching all agents)
export type TAgentWithPartialConfig = Omit<TAgent, "config"> & {
  config: {
    channels: Array<Pick<TChannel, "_id" | "name">>;
    tools: Array<Pick<TTool, "_id" | "name">>;
  };
};

// Type for agent with populated config (used when fetching by ID)
export type TAgentPopulated = Omit<TAgent, "config"> & {
  config: {
    channels: TChannel[];
    tools: TTool[];
  };
};

export type TAgentBehavior = {
  agent_calls_you?: string;
  message_length?: TMessageLength;
  creativity?: number;
  approved_emojis?: string[];
  blocked_words?: string[];
};
export type TMessageLength = (typeof MESSAGE_LENGTHS)[number];
export const MESSAGE_LENGTHS = ["short", "medium", "long"] as const;
