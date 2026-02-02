import {
  TChatwootAssigneeType,
  TChatwootConversationStatus,
} from "@/types/models/chatwoot/conversation";

export type TGetAllConversationsQParams = {
  assignee_type?: TChatwootAssigneeType;
  status?: TChatwootConversationStatus;
  page?: number;
  inbox_id?: number;
  team_id?: number;
  labels?: string[];
};
