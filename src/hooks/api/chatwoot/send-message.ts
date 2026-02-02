import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts } from "@/types/api";

type TSendMessageData = {
  conversation_id: number;
  content: string;
};

const sendMessage = (data: TSendMessageData): TApiPromise => {
  return api.post(`/chatwoot/conversation/${data.conversation_id}/messages`, {
    conversation_id: data.conversation_id,
    content: data.content,
  });
};

export const useSendMessage = (options?: TMutationOpts<TSendMessageData>) => {
  return useMutation({
    mutationKey: ["useSendMessage"],
    mutationFn: (data) => sendMessage(data),
    ...options,
  });
};

type TToggleAgentData = {
  conversation_id: string;
  is_agent_active: boolean;
};

const toggleAgent = (data: TToggleAgentData): TApiPromise => {
  return api.post(`/conversation/${data.conversation_id}/toggle-agent`, {
    is_agent_active: data.is_agent_active,
  });
};

export const useToggleAgent = (options?: TMutationOpts<TToggleAgentData>) => {
  return useMutation({
    mutationKey: ["useToggleAgent"],
    mutationFn: (data) => toggleAgent(data),
    ...options,
  });
};
