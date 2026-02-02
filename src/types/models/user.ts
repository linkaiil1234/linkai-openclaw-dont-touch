import {
  TDocument,
  TAuthType,
  TSubscriptionPlan,
  TSubscriptionStatus,
} from "../common";
import { TSubscription } from "./subscription";

export type TProfile = {
  language: string;
  subscription?: TSubscription["_id"] | null;
  subscription_plan: TSubscriptionPlan;
  subscription_status: TSubscriptionStatus;
  tokens_used: number;
  token_limit: number;
  agent_limit: number;
};

export type TAddress = {
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  tax_id?: string;
};

export type TUser = TDocument & {
  name: string;
  email: string;
  avatar?: string;
  firebase_uid: string;
  auth_type: TAuthType;
  email_verified: boolean;
  is_deleted: boolean;
  phone?: string;
  bio?: string;
  address?: TAddress;
};
