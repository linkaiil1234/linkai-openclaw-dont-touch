import { TDocument } from "../common";
import { TAgent } from "./agent";
import { TUser } from "./user";

export type TApiKey = TDocument & {
  user: TUser["_id"];
  agent?: TAgent["_id"];
  key_hash: string;
  name: string;
  permissions: string[];
  last_used_at?: Date;
  expires_at?: Date;
  is_active: boolean;
};
