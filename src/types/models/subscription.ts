import { TDocument, TSubscriptionPlan } from "../common";

export type TSubscription = TDocument & {
  name: TSubscriptionPlan;
  description?: string;
  price_monthly_cents: number;
  price_yearly_cents: number;
  token_limit: number;
  agent_limit: number;
  features: string[];
  is_active: boolean;
};
