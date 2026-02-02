import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import { TAsset } from "@/types/models/asset";

// Asset Types
export type TGetAllAssetsQParams = {
  page?: number;
  limit?: number;
  type?: "file" | "website" | "text";
};

export type TCreateFileAssetPayload = {
  file: File;
  onProgress?: (progress: number) => void;
  agent_id: string;
};

export type TCreateTextAssetPayload = {
  text: string;
  agent_id: string;
};

export type TCreateWebsiteAssetPayload = {
  urls: string[];
  agent_id: string;
};

export type TGetCrawlMapPayload = {
  url: string;
};

export type TCrawlMapResponse = {
  links: string[];
};

export type TDeleteAssetPayload = { asset_id: TAsset["_id"] };

// Asset Services
const getAllAssets = (params: TGetAllAssetsQParams): TApiPromise<TAsset[]> => {
  return api.get("/assets", { params });
};

const getAssetById = (id: string): TApiPromise<TAsset> => {
  return api.get(`/assets/${id}`);
};

const createFileAsset = ({
  file,
  onProgress,
  agent_id,
}: TCreateFileAssetPayload): TApiPromise<TAsset> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("agent_id", agent_id);

  return api.post("/assets/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress(progress);
      }
    },
  });
};

const createTextAsset = (
  payload: TCreateTextAssetPayload,
): TApiPromise<TAsset> => {
  return api.post("/assets/text", payload);
};

const createWebsiteAsset = (
  payload: TCreateWebsiteAssetPayload,
): TApiPromise<TAsset> => {
  return api.post("/assets/website", payload);
};

const getCrawlMap = (
  payload: TGetCrawlMapPayload,
): TApiPromise<TCrawlMapResponse> => {
  return api.post("/assets/website/crawl-map", payload);
};

const deleteAssetById = (params: TDeleteAssetPayload): TApiPromise => {
  return api.delete(`/assets/${params.asset_id}`);
};

// Asset Hooks
export const useGetAllAssets = (
  params: TGetAllAssetsQParams = {},
  options?: TQueryOpts<TAsset[]>,
) => {
  return useQuery({
    queryKey: ["useGetAllAssets", params],
    queryFn: () => getAllAssets(params),
    ...options,
  });
};

export const useGetAssetById = (id: string, options?: TQueryOpts<TAsset>) => {
  return useQuery({
    queryKey: ["useGetAssetById", id],
    queryFn: () => getAssetById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateFileAsset = (
  options?: TMutationOpts<TCreateFileAssetPayload, TAsset>,
) => {
  return useMutation({
    mutationKey: ["useCreateFileAsset"],
    mutationFn: createFileAsset,
    ...options,
  });
};

export const useCreateTextAsset = (
  options?: TMutationOpts<TCreateTextAssetPayload, TAsset>,
) => {
  return useMutation({
    mutationKey: ["useCreateTextAsset"],
    mutationFn: createTextAsset,
    ...options,
  });
};

export const useCreateWebsiteAsset = (
  options?: TMutationOpts<TCreateWebsiteAssetPayload, TAsset>,
) => {
  return useMutation({
    mutationKey: ["useCreateWebsiteAsset"],
    mutationFn: createWebsiteAsset,
    ...options,
  });
};

export const useGetCrawlMap = (
  options?: TMutationOpts<TGetCrawlMapPayload, TCrawlMapResponse>,
) => {
  return useMutation({
    mutationKey: ["useGetCrawlMap"],
    mutationFn: getCrawlMap,
    ...options,
  });
};
