import { api } from "@/lib/api";
import { TApiPromise, TQueryOpts, TMutationOpts } from "@/types/api";
import { useQuery, useMutation } from "@tanstack/react-query";

type TGetMCPAuthUrlPayload = {
  tool_id: string;
  agent_id: string;
};

type TGetMCPAuthUrlResponse = {
  auth_url: string;
};

const getMCPAuthUrl = (
  payload: TGetMCPAuthUrlPayload,
): TApiPromise<TGetMCPAuthUrlResponse> => {
  return api.post(`/mcp/auth-url`, payload);
};

export const useGetMCPAuthUrl = (
  payload: TGetMCPAuthUrlPayload,
  options?: TQueryOpts<TGetMCPAuthUrlResponse>,
) => {
  return useQuery({
    queryKey: ["useGetMCPAuthUrl"],
    queryFn: () => getMCPAuthUrl(payload),
    ...options,
  });
};

export type TDeleteMCPQueryParams = {
  agent_id: string;
  tool_id: string;
};

type TDeleteMCPResponse = {
  message: string;
};

const deleteMCP = (
  params: TDeleteMCPQueryParams,
): TApiPromise<TDeleteMCPResponse> => {
  return api.delete(`/mcp`, {
    params,
  });
};

export const useDeleteMCP = (
  options?: TMutationOpts<TDeleteMCPQueryParams, TDeleteMCPResponse>,
) => {
  return useMutation({
    mutationKey: ["useDeleteMCP"],
    mutationFn: (params: TDeleteMCPQueryParams) => deleteMCP(params),
    ...options,
  });
};
