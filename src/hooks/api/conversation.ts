import { api } from "@/lib/api";
import { TApiPromise, TQueryOpts } from "@/types/api";
import { TConversation } from "@/types/models/conversation";
import { useQuery } from "@tanstack/react-query";

type TGetPlaygroundConversationQParams = {
  agent_id: string;
};

const getPlaygroundConversation = (
  params: TGetPlaygroundConversationQParams,
): TApiPromise<TConversation> => {
  return api.get("/conversation/playground", { params });
};

export const useGetPlaygroundConversation = (
  params: TGetPlaygroundConversationQParams,
  options?: TQueryOpts<TConversation>,
) => {
  return useQuery({
    queryKey: ["useGetPlaygroundConversation", params.agent_id],
    queryFn: () => getPlaygroundConversation(params),
    ...options,
  });
};

const getConversationByChatwootId = (
  chatwoot_conversation_id: string,
): TApiPromise<TConversation> => {
  return api.get(`/conversation/chatwoot/${chatwoot_conversation_id}`);
};

export const useGetConversationByChatwootId = (
  chatwoot_conversation_id: string,
  options?: TQueryOpts<TConversation>,
) => {
  return useQuery({
    queryKey: ["useGetConversationByChatwootId", chatwoot_conversation_id],
    queryFn: () => getConversationByChatwootId(chatwoot_conversation_id),
    ...options,
  });
};

// import { useMutation, useQuery } from "@tanstack/react-query";

// import { api } from "@/lib/api";
// import type { TApiPromise, TQueryOpts, TMutationOpts } from "@/types/api";
// import type { TChatwootConversationListData } from "@/types/models/chatwoot/conversation";
// import type { TGetAllConversationsQParams } from "./chatwoot/types";
// import { TMessage } from "@/types/models/message";

// // Alias for consistency with existing code
// type TGetConversationsQParams = TGetAllConversationsQParams;

// export type TCreateConversationPayload = {
//   agent_id: string;
//   channel_id: string;
//   conversation_id: string;
// };

// export type TGetConversationByIdParams = {
//   conversation_id: string;
// };

// export type TConversationData = {
//   _id: string;
//   conversation_id: string;
//   agent_id: string;
//   channel_id: string;
//   messages: TMessage[];
//   createdAt: string;
//   updatedAt: string;
// };

// const getConversations = (
//   params: TGetConversationsQParams = {}
// ): TApiPromise<TChatwootConversationListData> => {
//   return api.get("/chatwoot/conversations", { params });
// };

// export const useGetConversations = (
//   params: TGetConversationsQParams,
//   options?: TQueryOpts<TChatwootConversationListData>
// ) => {
//   return useQuery({
//     queryKey: ["useGetConversations", params],
//     queryFn: () => getConversations(params),
//     ...options,
//   });
// };

// // Create conversation API call
// const createConversation = (
//   payload: TCreateConversationPayload
// ): TApiPromise<TConversationData> => {
//   return api.post("/conversations", payload);
// };

// // Create conversation mutation hook
// export const useCreateConversation = (
//   options?: TMutationOpts<TCreateConversationPayload, TConversationData>
// ) => {
//   return useMutation({
//     mutationKey: ["useCreateConversation"],
//     mutationFn: createConversation,
//     ...options,
//   });
// };

// // Get conversation by ID API call
// const getConversationById = (
//   params: TGetConversationByIdParams
// ): TApiPromise<TConversationData> => {
//   return api.get(`/conversations/${params.conversation_id}`);
// };

// // Get conversation by ID query hook
// export const useGetConversationById = (
//   params: TGetConversationByIdParams,
//   options?: TQueryOpts<TConversationData>
// ) => {
//   return useQuery({
//     queryKey: ["useGetConversationById", params.conversation_id],
//     queryFn: () => getConversationById(params),
//     ...options,
//   });
// };
