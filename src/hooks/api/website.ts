import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import { TAgent } from "@/types/models/agent";
import { TPaginationQParams, TPaginationResponse } from "@/types/pagination";
import { TAsset } from "@/types/models/asset";
import { TWebsite } from "@/types/models/website";

type TGetAllWebsitesQParams = {
  agent_id: TAgent["_id"];
  populate?: string;
} & TPaginationQParams;

type TGetAllWebsitesByAgentIdResponse = TWebsite<
  Pick<TAgent, "_id" | "name">,
  TAsset
>[] &
  TPaginationResponse;

type TDeleteWebsiteByIdPayload = { website_id: TWebsite["_id"] };

const getAllWebsitesByAgentId = (
  params: TGetAllWebsitesQParams,
): TApiPromise<TGetAllWebsitesByAgentIdResponse> => {
  return api.get("/website", { params });
};

const deleteWebsiteById = (params: TDeleteWebsiteByIdPayload): TApiPromise => {
  return api.delete(`/website/${params.website_id}`);
};

export const useGetAllWebsitesByAgentId = (
  params: TGetAllWebsitesQParams,
  options?: TQueryOpts<TGetAllWebsitesByAgentIdResponse>,
) => {
  return useQuery({
    queryKey: ["useGetAllWebsitesByAgentId", params],
    queryFn: () => getAllWebsitesByAgentId(params),
    ...options,
  });
};

export const useDeleteWebsiteById = (
  options?: TMutationOpts<TDeleteWebsiteByIdPayload, void>,
) => {
  return useMutation({
    mutationKey: ["useDeleteWebsiteById"],
    mutationFn: (payload: TDeleteWebsiteByIdPayload) =>
      deleteWebsiteById(payload),
    ...options,
  });
};
