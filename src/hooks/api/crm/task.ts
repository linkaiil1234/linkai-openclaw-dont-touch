import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";
import type { TPaginationQParams } from "@/types/pagination";
import type { TTask } from "@/types/models/task";
import type { TClient } from "@/types/models/client";

// Task Types
export type TCreateTaskByClientIdPayload = {
  title: string;
  description?: string;
  is_completed?: boolean;
};

export type TCreateTaskByClientIdParams = {
  client_id: TClient["_id"];
};

export type TCreateTaskPayload = TCreateTaskByClientIdPayload &
  TCreateTaskByClientIdParams;

export type TGetAllTasksQParams = TPaginationQParams;

export type TGetTasksByClientIdQParams = {
  client_id: TClient["_id"];
} & TPaginationQParams;

export type TUpdateTaskPayload = {
  _id: TTask["_id"];
  description?: string;
  is_completed?: boolean;
};

export type TDeleteTaskPayload = {
  _id: TTask["_id"];
};

// Task Services
const createTaskByClientId = ({
  client_id,
  ...body
}: TCreateTaskPayload): TApiPromise<TTask> => {
  return api.post(`/crm/task/${client_id}`, {
    title: body.title,
    description: body.description,
    is_completed: body.is_completed,
  });
};

const getAllTasks = (params?: TGetAllTasksQParams): TApiPromise<TTask[]> => {
  return api.get("/crm/task", { params });
};

const getTasksByClientId = ({
  client_id,
  ...params
}: TGetTasksByClientIdQParams): TApiPromise<TTask[]> => {
  return api.get(`/crm/task/${client_id}`, { params });
};

const updateTask = ({ _id, ...data }: TUpdateTaskPayload): TApiPromise => {
  return api.put(`/crm/task/${_id}`, data);
};

const deleteTask = ({ _id }: TDeleteTaskPayload): TApiPromise => {
  return api.delete(`/crm/task/${_id}`);
};

// Task Hooks
export const useCreateTask = (
  options?: TMutationOpts<TCreateTaskPayload, TTask>,
) => {
  return useMutation({
    mutationKey: ["useCreateTask"],
    mutationFn: createTaskByClientId,
    ...options,
  });
};

export const useGetAllTasks = (
  params?: TGetAllTasksQParams,
  options?: TQueryOpts<TTask[]>,
) => {
  return useQuery({
    queryKey: ["useGetAllTasks", params],
    queryFn: () => getAllTasks(params),
    ...options,
  });
};

export const useGetTasksByClientId = (
  params: TGetTasksByClientIdQParams,
  options?: TQueryOpts<TTask[]>,
) => {
  return useQuery({
    queryKey: ["useGetTasksByClientId", params],
    queryFn: () => getTasksByClientId(params),
    enabled: !!params.client_id,
    ...options,
  });
};

export const useUpdateTask = (options?: TMutationOpts<TUpdateTaskPayload>) => {
  return useMutation({
    mutationKey: ["useUpdateTask"],
    mutationFn: updateTask,
    ...options,
  });
};

export const useDeleteTask = (
  options?: TMutationOpts<TDeleteTaskPayload, void>,
) => {
  return useMutation({
    mutationKey: ["useDeleteTask"],
    mutationFn: deleteTask,
    ...options,
  });
};
