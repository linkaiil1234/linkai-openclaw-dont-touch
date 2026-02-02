import { TDocument } from "../common";
import { TAgent } from "./agent";
import { TAsset } from "./asset";
import { TUser } from "./user";

export type TText<
  TTextAgent = TAgent["_id"],
  TTextAsset = TAsset["_id"],
> = TDocument & {
  content: string;
  user: TUser["_id"];
  agent: TTextAgent;
  asset: TTextAsset;
};
