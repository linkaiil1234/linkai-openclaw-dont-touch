import { TDocument } from "../common";
import { TAgent } from "./agent";
import { TUser } from "./user";

export type TWebhook = TDocument & {
  user: TUser["_id"];
  agent: TAgent["_id"];
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
};
