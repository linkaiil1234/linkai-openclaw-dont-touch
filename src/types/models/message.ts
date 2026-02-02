import { TDocument, TMessageRole } from "../common";
import { TOldConversation } from "./conversation";

export type TMessage = TDocument & {
  conversation: TOldConversation["conversation_id"];
  role: TMessageRole;
  content: string;
};
