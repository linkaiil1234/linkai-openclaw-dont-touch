import { PROVIDER_OPTIONS } from "@/constants/common";

export type TInbox = {
  _id: string;
  providers: TProviders[];
  createdAt: Date;
  updatedAt: Date;
};

type TProviders = (typeof PROVIDER_OPTIONS)[number];
