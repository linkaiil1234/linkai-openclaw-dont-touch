import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TQueryOpts } from "@/types/api";
import { TConversationMessagesResult } from "@/types/models/chatwoot/message";

const getAllConversationMessages = (
  conversation_id: string,
): TApiPromise<TConversationMessagesResult> => {
  return api.get(`/chatwoot/conversation/${conversation_id}/messages`);
};

export const useGetAllConversationMessages = (
  conversation_id: string,
  options?: TQueryOpts<TConversationMessagesResult>,
) => {
  return useQuery({
    queryKey: ["useGetAllConversationMessages", conversation_id],
    queryFn: () => getAllConversationMessages(conversation_id),
    enabled: !!conversation_id,
    ...options,
  });
};
