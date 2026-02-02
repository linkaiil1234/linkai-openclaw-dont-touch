import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
  TApiPromise,
  TApiSuccess,
  TMutationOpts,
  TQueryOpts,
} from "@/types/api";

export type TAgentEditConversation = {
  _id: string;
  user: string;
  agent: string;
  role: "user" | "agent";
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type TGetAllAgentEditConversationsParams = {
  agent_id: string;
};

export type TEditAgentWithAIPayload = {
  agent_id: string;
  message: string;
};

// Agent Edit Conversation Services
const getAllAgentEditConversations = (
  params: TGetAllAgentEditConversationsParams,
): TApiPromise<TAgentEditConversation[]> => {
  return api.get("/agent/edit-conversations", { params });
};

// Agent Edit Conversation Hooks
export const useGetAllAgentEditConversations = (
  params: TGetAllAgentEditConversationsParams,
  options?: TQueryOpts<TAgentEditConversation[]>,
) => {
  return useQuery({
    ...options,
    queryKey: ["useGetAllAgentEditConversations", params.agent_id],
    queryFn: () =>
      getAllAgentEditConversations(params) as Promise<
        TApiSuccess<TAgentEditConversation[]>
      >,
    // Combine both enabled conditions
    enabled: (options?.enabled ?? true) && !!params.agent_id,
  });
};
