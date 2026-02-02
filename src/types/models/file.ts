import { TDocument } from "../common";
import { TAgent } from "./agent";
import { TAsset } from "./asset";
import { TUser } from "./user";

export type TFile<
  TFileAgent = TAgent["_id"],
  TFileAsset = TAsset["_id"],
> = TDocument & {
  user: TUser["_id"];
  agent: TFileAgent;
  asset: TFileAsset;
};
