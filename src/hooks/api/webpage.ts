import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import { TProcessingStatus } from "@/types/common";

// Webpage Types
export type TWebpage = {
  _id: string;
  url: string;
  title?: string;
  processing_status: TProcessingStatus;
  crawl?: boolean;
  user: string;
  agent?: string;
  createdAt: string;
  updatedAt: string;
};

export type TGetAllWebpagesQParams = {
  page?: number;
  limit?: number;
};

export type TCreateWebpagePayload = {
  url: string;
  crawl?: boolean;
  agent_id?: string;
};

export type TDeleteWebpagePayload = Pick<TWebpage, "_id">;

// Webpage Services
const getAllWebpages = (
  params: TGetAllWebpagesQParams,
): TApiPromise<TWebpage[]> => {
  return api.get("/webpage", { params });
};

const createWebpage = (
  payload: TCreateWebpagePayload,
): TApiPromise<TWebpage> => {
  return api.post("/webpage", payload);
};

const deleteWebpage = ({ _id }: TDeleteWebpagePayload): TApiPromise => {
  return api.delete(`/webpage/${_id}`);
};

// Webpage Hooks
export const useGetAllWebpages = (
  params: TGetAllWebpagesQParams = {},
  options?: TQueryOpts<TWebpage[]>,
) => {
  return useQuery({
    queryKey: ["useGetAllWebpages", params],
    queryFn: () => getAllWebpages(params),
    ...options,
  });
};

export const useCreateWebpage = (
  options?: TMutationOpts<TCreateWebpagePayload, TWebpage>,
) => {
  return useMutation({
    mutationKey: ["useCreateWebpage"],
    mutationFn: createWebpage,
    ...options,
  });
};

export const useDeleteWebpage = (
  options?: TMutationOpts<TDeleteWebpagePayload, void>,
) => {
  return useMutation({
    mutationKey: ["useDeleteWebpage"],
    mutationFn: deleteWebpage,
    ...options,
  });
};
