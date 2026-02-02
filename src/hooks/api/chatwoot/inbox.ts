import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts, TQueryOpts } from "@/types/api";

export type TWebWidgetInboxData = {
  name: string;
  channel: {
    website_url?: string;
    welcome_title?: string;
    welcome_tagline?: string;
    widget_color?: string;
  };
  agent_id: string;
};

export type TWebWidgetInboxResponse = {
  id: number;
  name: string;
  avatar_url: string;
  channel_id: number;
  channel_type: string;
  web_widget_script: string;
  website_token: string;
  website_url: string;
  welcome_title: string;
  welcome_tagline: string;
  widget_color: string;
  [key: string]: any;
};

const createWebWidgetInbox = (
  data: TWebWidgetInboxData,
): TApiPromise<TWebWidgetInboxResponse> => {
  return api.post("/chatwoot/inbox/web-widget", {
    agent_id: data.agent_id,
    name: data.name,
    channel: {
      type: "web_widget",
      ...data.channel,
    },
  });
};

export const useCreateWebWidgetInbox = (
  options?: TMutationOpts<TWebWidgetInboxData, TWebWidgetInboxResponse>,
) => {
  return useMutation({
    mutationKey: ["useCreateWebWidgetInbox"],
    mutationFn: (data: TWebWidgetInboxData) => createWebWidgetInbox(data),
    ...options,
  });
};

export const useRemoveWebWidgetInbox = () => {
  return;
};

export type TCreateTelegramInboxData = {
  agent_id: string;
  bot_token: string;
  channel: {
    bot_token: string;
  };
};

const createTelegramInbox = (data: TCreateTelegramInboxData): TApiPromise => {
  return api.post("/chatwoot/inbox/telegram", {
    agent_id: data.agent_id,
    channel: {
      type: "telegram",
      bot_token: data.channel.bot_token,
    },
  });
};

export const useCreateTelegramInbox = (
  options?: TMutationOpts<TCreateTelegramInboxData>,
) => {
  return useMutation({
    mutationKey: ["useCreateTelegramInbox"],
    mutationFn: (data: TCreateTelegramInboxData) => createTelegramInbox(data),
    ...options,
  });
};

export const useRemoveTelegramInbox = () => {
  return;
};

type TGetAllInboxesResult = unknown[];

const getAllInboxes = (): TApiPromise<TGetAllInboxesResult> => {
  return api.get("/chatwoot/inbox");
};

export const useGetAllInboxes = (
  options?: TQueryOpts<TGetAllInboxesResult>,
) => {
  return useQuery({
    queryKey: ["useGetAllInboxes"],
    queryFn: () => getAllInboxes(),
    ...options,
  });
};

export type TChatwootInbox = {
  _id: string;
  chatwoot: {
    inbox_id: number;
    user_id: string;
    access_token: string;
  };
  agent: string;
  is_playground?: boolean;
  channel_metadata?: {
    telegram?: {
      bot_token: string;
    };
    whatsapp?: {
      phone_number_id?: string;
      waba_id?: string;
      business_id?: string;
    };
    webwidget?: {
      script: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

const getInboxByAgent = (agentId: string): TApiPromise<TChatwootInbox[]> => {
  return api.get(`/chatwoot/inbox/agent/${agentId}`);
};

export const useGetInboxByAgent = (
  agentId: string,
  options?: TQueryOpts<TChatwootInbox[]>,
) => {
  return useQuery({
    queryKey: ["useGetInboxByAgent", agentId],
    queryFn: () => getInboxByAgent(agentId),
    enabled: !!agentId,
    ...options,
  });
};
