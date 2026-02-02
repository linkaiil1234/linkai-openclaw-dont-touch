import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import { TAgent } from "@/types/models/agent";
import { TPaginationQParams, TPaginationResponse } from "@/types/pagination";
import { TAsset } from "@/types/models/asset";
import { TText } from "@/types/models/text";

type TGetAllTextsQParams = {
  agent_id: TAgent["_id"];
  populate?: string;
} & TPaginationQParams;

type TGetAllTextsByAgentIdResponse = TText<
  Pick<TAgent, "_id" | "name">,
  TAsset
>[] &
  TPaginationResponse;

type TDeleteTextByIdPayload = { text_id: TText["_id"] };

const getAllTextsByAgentId = (
  params: TGetAllTextsQParams,
): TApiPromise<TGetAllTextsByAgentIdResponse> => {
  return api.get("/text", { params });
};

const deleteTextById = (params: TDeleteTextByIdPayload): TApiPromise => {
  return api.delete(`/text/${params.text_id}`);
};

export const useGetAllTextsByAgentId = (
  params: TGetAllTextsQParams,
  options?: TQueryOpts<TGetAllTextsByAgentIdResponse>,
) => {
  return useQuery({
    queryKey: ["useGetAllTextsByAgentId", params],
    queryFn: () => getAllTextsByAgentId(params),
    ...options,
  });
};

export const useDeleteTextById = (
  options?: TMutationOpts<TDeleteTextByIdPayload, void>,
) => {
  return useMutation({
    mutationKey: ["useDeleteTextById"],
    mutationFn: (payload: TDeleteTextByIdPayload) => deleteTextById(payload),
    ...options,
  });
};
