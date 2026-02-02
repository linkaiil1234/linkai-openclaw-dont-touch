import { TDocument } from "../common";
import { TUser } from "./user";

export type TWaAsset = TDocument & {
  user: TUser["_id"];
  business_id: string;
  waba_id: string;
  app_id: string;

  access_token: string;
  token_expires_at?: Date | null;

  verify_token: string;
  webhook_subscribed: boolean;

  name?: string;
  connected_at: Date;
};
