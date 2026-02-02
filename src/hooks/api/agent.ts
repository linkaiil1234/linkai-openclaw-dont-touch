import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
  TApiPromise,
  TApiSuccess,
  TMutationOpts,
  TQueryOpts,
} from "@/types/api";
import {
  TAgent,
  TAgentPopulated,
  TAgentWithPartialConfig,
} from "@/types/models/agent";

// Agent Types
export type TGetAllAgentsQParams = Partial<TAgent>;

export type TCreateAgentPayload = Pick<TAgent, "name"> &
  Partial<Pick<TAgent, "description"> & { website?: string }>;

export type TUpdateAgentPayload = Partial<
  Pick<
    TAgent,
    | "_id"
    | "name"
    | "description"
    | "status"
    | "system_prompt"
    | "language"
    | "tone"
    | "category"
    | "deployment_url"
    | "config"
    | "behavior"
  >
>;

export type TDeleteAgentPayload = Pick<TAgent, "_id">;

// Agent Services
const getAllAgents = (
  params: TGetAllAgentsQParams,
): TApiPromise<TAgentWithPartialConfig[]> => {
  return api.get("/agent", { params });
};

const getAgentById = (id: string): TApiPromise<TAgentPopulated> => {
  return api.get(`/agent/${id}`);
};

const createAgent = (data: TCreateAgentPayload): TApiPromise<TAgent> => {
  return api.post("/agent", data);
};

const updateAgent = ({ _id, ...payload }: TUpdateAgentPayload): TApiPromise => {
  console.log("[updateAgent] payload:", _id, payload);
  return api.put(`/agent/${_id}`, payload);
};

const deleteAgent = ({ _id }: TDeleteAgentPayload): TApiPromise => {
  return api.delete(`/agent/${_id}`);
};

// Agent Hooks
export const useGetAllAgents = (
  params: TGetAllAgentsQParams = {},
  options?: TQueryOpts<TAgentWithPartialConfig[]>,
) => {
  return useQuery({
    ...options,
    queryKey: ["useGetAllAgents", params],
    queryFn: () =>
      getAllAgents(params) as Promise<TApiSuccess<TAgentWithPartialConfig[]>>,
  });
};

export const useGetAgentById = (
  id: string,
  options?: TQueryOpts<TAgentPopulated>,
) => {
  return useQuery({
    ...options,
    queryKey: ["useGetAgentById", id],
    queryFn: () => getAgentById(id) as Promise<TApiSuccess<TAgentPopulated>>,
    enabled: !!id,
  });
};

export const useCreateAgent = (
  options?: TMutationOpts<TCreateAgentPayload, TAgent>,
) => {
  return useMutation({
    mutationKey: ["useCreateAgent"],
    mutationFn: createAgent as (
      data: TCreateAgentPayload,
    ) => Promise<TApiSuccess<TAgent>>,
    ...options,
  });
};

export const useUpdateAgent = (
  options?: TMutationOpts<TUpdateAgentPayload>,
) => {
  return useMutation({
    mutationKey: ["useUpdateAgent"],
    mutationFn: updateAgent as (
      data: TUpdateAgentPayload,
    ) => Promise<TApiSuccess<undefined>>,
    ...options,
  });
};

export const useDeleteAgent = (
  options?: TMutationOpts<TDeleteAgentPayload, void>,
) => {
  return useMutation({
    mutationKey: ["useDeleteAgent"],
    mutationFn: deleteAgent as (
      data: TDeleteAgentPayload,
    ) => Promise<TApiSuccess<undefined>>,
    ...options,
  });
};
