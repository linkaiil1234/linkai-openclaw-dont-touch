import { api } from "@/lib/api";
import { TApiPromise, TQueryOpts, TMutationOpts } from "@/types/api";
import { TClient } from "@/types/models/client";
import { useQuery, useMutation } from "@tanstack/react-query";

type TCreateClientData = {
  name: string;
  email?: string;
  phone?: string;
  thumbnail?: string;
};

type TUpdateClientQParams = {
  client_id: string;
  data: TClient;
};

type TDeleteClientQParams = {
  client_id: string;
};
export type TGetClientByIdQParams = Pick<TClient, "_id">;

const getAllClients = (): TApiPromise<TClient[]> => {
  return api.get("/crm/client");
};

export const useGetAllClients = (options?: TQueryOpts<TClient[]>) => {
  return useQuery({
    queryKey: ["useGetAllClients"],
    queryFn: () => getAllClients(),
    ...options,
  });
};

const getClientById = (params: TGetClientByIdQParams): TApiPromise<TClient> => {
  return api.get(`/crm/client/${params._id}`);
};
export const useGetClientById = (
  params: TGetClientByIdQParams,
  options?: TQueryOpts<TClient>,
) => {
  return useQuery({
    queryKey: ["useGetClientById", params],
    queryFn: () => getClientById(params),
    enabled: !!params._id,
    ...options,
  });
};

const getAllClientsSynced = (): TApiPromise<TClient[]> => {
  return api.post("/crm/client/sync");
};

export const useGetAllClientsSynced = (
  options?: TMutationOpts<void, TClient[]>,
) => {
  return useMutation({
    mutationKey: ["useGetAllClientsSynced"],
    mutationFn: () => getAllClientsSynced(),
    ...options,
  });
};

const createClient = (data: TCreateClientData): TApiPromise<TClient> => {
  return api.post("/crm/client", data);
};

export const useCreateClient = (
  options?: TMutationOpts<TCreateClientData, TClient>,
) => {
  return useMutation({
    mutationKey: ["useCreateClient"],
    mutationFn: (data: TCreateClientData) => createClient(data),
    ...options,
  });
};

const deleteClient = (params: TDeleteClientQParams): TApiPromise<void> => {
  return api.delete(`/crm/client/${params.client_id}`);
};

export const useDeleteClient = (
  options?: TMutationOpts<TDeleteClientQParams, void>,
) => {
  return useMutation({
    mutationKey: ["useDeleteClient"],
    mutationFn: (params: TDeleteClientQParams) => deleteClient(params),
    ...options,
  });
};

const updateClient = (params: TUpdateClientQParams): TApiPromise<TClient> => {
  return api.put(`/crm/client/${params.client_id}`, params.data);
};

export const useUpdateClient = (
  options?: TMutationOpts<TUpdateClientQParams, TClient>,
) => {
  return useMutation({
    mutationKey: ["useUpdateClient"],
    mutationFn: (params: TUpdateClientQParams) => updateClient(params),
    ...options,
  });
};
