import { AUTH_ACTION_STATUSES } from "@/constants/common";
import { TAuthType } from "./common";
import { TUser } from "./models/user";

export type TLoginResponse = Omit<TUser, "is_deleted">;

export type TSignupRequiredResponse = {
  needs_signup: true;
  email: string;
  name?: string;
  auth_type: TAuthType;
  email_verified: boolean;
};

export type TAuthActionStatus = (typeof AUTH_ACTION_STATUSES)[number];
