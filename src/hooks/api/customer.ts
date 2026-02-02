import { api } from "@/lib/api";
import { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import { TCustomer } from "@/types/models/customer";
import { useMutation, useQuery } from "@tanstack/react-query";

export type TGetCustomerByIdQParams = Pick<TCustomer, "contact_id">;
export type TDeleteCustomerQParams = Pick<TCustomer, "contact_id">;

export type TCreateCustomerQBody = {
  inbox_id: string; // required, will be converted to number on backend
  name?: string; // optional, min 1 char
  email?: string; // optional, valid email
  phone?: string; // optional, E.164 format (+1234567890)
  avatar?: File; // optional, valid URL for avatar
};

const getAllCustomers = (): TApiPromise<TCustomer[]> => {
  return api.get("/chatwoot/customers");
};

export const useGetAllCustomers = (options?: TQueryOpts<TCustomer[]>) => {
  return useQuery({
    queryKey: ["useGetAllCustomers"],
    queryFn: () => getAllCustomers(),
    ...options,
  });
};

const deleteCustomer = (
  params: TDeleteCustomerQParams,
): TApiPromise<undefined> => {
  return api.delete(`/chatwoot/customers/${params.contact_id}`);
};

export const useDeleteCustomer = (
  params: TDeleteCustomerQParams,
  options?: TMutationOpts<TDeleteCustomerQParams>,
) => {
  return useMutation({
    mutationKey: ["useDeleteCustomer", params],
    mutationFn: (payload: TDeleteCustomerQParams) => deleteCustomer(payload),
    ...options,
  });
};

const createCustomer = (
  params: TCreateCustomerQBody,
): TApiPromise<TCustomer> => {
  return api.post("/chatwoot/customers", params);
};

export const useCreateCustomer = (
  options?: TMutationOpts<TCreateCustomerQBody, TCustomer>,
) => {
  return useMutation({
    mutationKey: ["useCreateCustomer"],
    mutationFn: (payload: TCreateCustomerQBody) => createCustomer(payload),
    ...options,
  });
};
