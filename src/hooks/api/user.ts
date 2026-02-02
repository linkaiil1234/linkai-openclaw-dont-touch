import { api } from "@/lib/api";
import { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import { TUser } from "@/types/models/user";
import { useMutation, useQuery } from "@tanstack/react-query";

export type TUpdateUserPayload = Pick<
  TUser,
  "name" | "avatar" | "phone" | "bio" | "address"
>;

export type TUpdateUserQParams = Pick<TUser, "_id">;

type TUpdateUserParams = TUpdateUserQParams & { payload: TUpdateUserPayload };

export type TGetUserQParams = Pick<TUser, "_id">;

const updateUser = (params: TUpdateUserParams): TApiPromise => {
  return api.put(`/user/${params._id}`, params.payload);
};

export const useUpdateUser = (
  options?: TMutationOpts<TUpdateUserParams, void>,
) => {
  return useMutation({
    mutationKey: ["useUpdateUser"],
    mutationFn: updateUser,
    ...options,
  });
};

const getUser = (params: TGetUserQParams): TApiPromise<TUser> => {
  return api.get(`/user/${params._id}`);
};

export const useGetUser = (
  params: TGetUserQParams,
  options?: TQueryOpts<TUser>,
) => {
  return useQuery({
    queryKey: ["useGetUser", params._id],
    queryFn: () => getUser(params),
    ...options,
  });
};
