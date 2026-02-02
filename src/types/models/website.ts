import { TDocument } from "../common";
import { TAgent } from "./agent";
import { TAsset } from "./asset";

export type TWebsite<
  TWebsiteAgent = TAgent["_id"],
  TWebsiteAsset = TAsset["_id"],
> = TDocument & {
  urls: string;
  agent: TWebsiteAgent;
  asset: TWebsiteAsset;
};
