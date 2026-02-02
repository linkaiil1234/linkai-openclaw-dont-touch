import { TDocument } from "../common";

export type TTool = TDocument & {
  name: string;
  icon_url?: string;
  category?: string;
  is_authenticated?: boolean;
  mcp_url?: string | null;
};
