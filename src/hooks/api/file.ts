import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import { TFile } from "@/types/models/file";
import { TAgent } from "@/types/models/agent";
import { TPaginationQParams, TPaginationResponse } from "@/types/pagination";
import { TAsset } from "@/types/models/asset";

type TGetAllFilesQParams = {
  agent_id: TAgent["_id"];
  populate?: string;
} & TPaginationQParams;

type TGetAllFilesByAgentIdResponse = TFile<
  Pick<TAgent, "_id" | "name">,
  TAsset
>[] &
  TPaginationResponse;

type TDeleteFileByIdPayload = { file_id: TFile["_id"] };

const getAllFilesByAgentId = (
  params: TGetAllFilesQParams,
): TApiPromise<TGetAllFilesByAgentIdResponse> => {
  return api.get("/file", { params });
};

const deleteFileById = (params: TDeleteFileByIdPayload): TApiPromise => {
  return api.delete(`/file/${params.file_id}`);
};

export const useGetAllFilesByAgentId = (
  params: TGetAllFilesQParams,
  options?: TQueryOpts<TGetAllFilesByAgentIdResponse>,
) => {
  return useQuery({
    queryKey: ["useGetAllFilesByAgentId", params],
    queryFn: () => getAllFilesByAgentId(params),
    ...options,
  });
};

export const useDeleteFileById = (
  options?: TMutationOpts<TDeleteFileByIdPayload, void>,
) => {
  return useMutation({
    mutationKey: ["useDeleteFileById"],
    mutationFn: (payload: TDeleteFileByIdPayload) => deleteFileById(payload),
    ...options,
  });
};
