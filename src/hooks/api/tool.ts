import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TTool } from "@/types/models/tool";
import { TApiPromise, TQueryOpts } from "@/types/api";
import { TAgent } from "@/types/models/agent";

export type TGetToolsQParams = Partial<TTool>;

export type TGetAllToolsWithAgentQParams = Partial<
  TTool & Pick<TAgent, "_id" | "name" | "description" | "avatar">
>;

const getAllTools = (params: TGetToolsQParams): TApiPromise<TTool[]> => {
  return api.get("/tool", { params });
};

export const useGetAllTools = (
  params: TGetToolsQParams = {},
  options?: TQueryOpts<TTool[]>,
) => {
  return useQuery({
    queryKey: ["useGetAllTools", params],
    queryFn: () => getAllTools(params),
    ...options,
  });
};

const getAllToolsWithAgent = (): TApiPromise<
  TGetAllToolsWithAgentQParams[]
> => {
  return api.get(`/tool/with-agents`);
};

export const useGetAllToolsWithAgent = (
  options?: TQueryOpts<TGetAllToolsWithAgentQParams[]>,
) => {
  return useQuery({
    queryKey: ["useGetAllToolsWithAgent"],
    queryFn: () => getAllToolsWithAgent(),
    ...options,
  });
};
