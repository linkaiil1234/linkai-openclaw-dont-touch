import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import type { TChatwootConversationListData } from "@/types/models/chatwoot/conversation";

type TGetAllConversationsQParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  inbox_id?: string;
  assignee_type?: "all" | "unassigned";
};

const getAllConversations = (
  params: TGetAllConversationsQParams = {},
): TApiPromise<TChatwootConversationListData> => {
  return api.get("/chatwoot/conversation", { params });
};

export const useGetAllConversations = (
  params: TGetAllConversationsQParams = {},
  options?: TQueryOpts<TChatwootConversationListData>,
) => {
  return useQuery({
    queryKey: ["useGetAllConversations", params],
    queryFn: () => getAllConversations(params),
    ...options,
  });
};

const markConversationAsRead = (conversation_id: string): TApiPromise => {
  return api.post(`/chatwoot/conversation/${conversation_id}/mark-read`);
};

export const useMarkConversationAsRead = (
  options?: TMutationOpts<{ conversation_id: string }>,
) => {
  return useMutation({
    mutationKey: ["useMarkConversationAsRead"],
    mutationFn: (data: { conversation_id: string }) =>
      markConversationAsRead(data.conversation_id),
    ...options,
  });
};
