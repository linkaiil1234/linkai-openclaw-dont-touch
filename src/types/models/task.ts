import { TDocument } from "@/types/common";

import { TClient } from "./client";
import { TUser } from "./user";

export type TTask = TDocument & {
  client: TClient["_id"];
  user: TUser["_id"];
  title: string;
  description?: string;
  is_completed?: boolean;
};
