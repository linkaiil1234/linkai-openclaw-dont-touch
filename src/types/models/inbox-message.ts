import { INBOX_MESSAGE_ROLE } from "@/constants/common";

export type TInboxMessage = {
  _id: string;
  message: string;
  content: string;
  attachments?: string[];
  sender: string;
  role: TInboxMessageRole;
  createdAt: string;
  updatedAt: string;
};

export type TInboxMessageRole = (typeof INBOX_MESSAGE_ROLE)[number];
