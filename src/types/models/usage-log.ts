import { TDocument, TUsageActionType } from "../common";
import { TAgent } from "./agent";
import { TOldConversation } from "./conversation";
import { TUser } from "./user";

export type TUsageLog = TDocument & {
  user: TUser["_id"];
  agent?: TAgent["_id"];
  conversation?: TOldConversation["_id"];

  action_type: TUsageActionType;
  tokens_used: number;
  cost_cents: number;
};
