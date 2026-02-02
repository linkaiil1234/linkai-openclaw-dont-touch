import type {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { TPaginationResponse } from "./pagination";

export type TApiPromise<TData = undefined> = Promise<
  TApiSuccess<TData> | TApiError
>;

export type TApiSuccess<TData = undefined> = {
  message: string;
  data?: TData;
  pagination?: TPaginationResponse;
};

export type TApiError = {
  message: string;
  status_code: number;
  stack?: string;
  validation_error?: {
    fields: string[];
    details: {
      field: string;
      message: string;
      code: string;
    }[];
  };
};

export type TQueryOpts<TResponse = undefined> = Omit<
  UseQueryOptions<TApiSuccess<TResponse>, TApiError>,
  "queryKey" | "queryFn"
>;

export type TMutationOpts<TVariables = void, TResponse = undefined> = Omit<
  UseMutationOptions<TApiSuccess<TResponse>, TApiError, TVariables>,
  "mutationKey" | "mutationFn"
>;

export type TInfiniteQueryOpts<TResponse = undefined> = Omit<
  UseInfiniteQueryOptions<
    TApiSuccess<TResponse>,
    TApiError,
    InfiniteData<TApiSuccess<TResponse>>
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;
