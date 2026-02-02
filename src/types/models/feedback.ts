import { TDocument } from "../common";
import { TAgent } from "./agent";
import { TOldConversation } from "./conversation";
import { TMessage } from "./message";
import { TUser } from "./user";

export type TFeedback = TDocument & {
  user: TUser["_id"];
  agent: TAgent["_id"];
  conversation: TOldConversation["_id"];
  message?: TMessage["_id"];
  rating: number;
  comment?: string;
};
