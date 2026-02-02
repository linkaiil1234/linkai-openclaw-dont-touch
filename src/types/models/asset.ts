import { TDocument, TProcessingStatus } from "../common";

export const ASSET_TYPES = ["file", "website", "text"] as const;
export type TAssetType = (typeof ASSET_TYPES)[number];

export type TAsset = TDocument & {
  type: TAssetType;
  user: string;
  url: string;
  gcp_path?: string;
  name?: string;
  mime_type?: string;
  size_bytes?: number;
  processing_status: TProcessingStatus;
};
