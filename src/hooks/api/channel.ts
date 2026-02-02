import { api } from "@/lib/api";
import { TApiPromise, TQueryOpts } from "@/types/api";
import { TChannel } from "@/types/models/channel";
import { useQuery } from "@tanstack/react-query";

export type TGetChannelsQParams = Partial<TChannel>;

const getAllChannels = (
  params: TGetChannelsQParams = {},
): TApiPromise<TChannel[]> => {
  return api.get("/channel", { params });
};

const getChannelById = (id: string): TApiPromise<TChannel> => {
  return api.get(`/channel/${id}`);
};

export const useGetAllChannels = (
  params: TGetChannelsQParams = {},
  options?: TQueryOpts<TChannel[]>,
) => {
  return useQuery({
    queryKey: ["useGetAllChannels", params],
    queryFn: () => getAllChannels(params),
    ...options,
  });
};

export const useGetChannelById = (
  id: string,
  options?: TQueryOpts<TChannel>,
) => {
  return useQuery({
    queryKey: ["useGetChannelById", id],
    queryFn: () => getChannelById(id),
    ...options,
  });
};
