"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { TSubmitChatPayload } from "@/types/common";

type TPendingUserMessage = TSubmitChatPayload;
type TChatContextType = {
  pendingUserMessage: TPendingUserMessage | null;
  setPendingUserMessage: Dispatch<SetStateAction<TPendingUserMessage | null>>;
};

const ChatContext = createContext<TChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [pendingUserMessage, setPendingUserMessage] =
    useState<TPendingUserMessage | null>(null);

  return (
    <ChatContext.Provider
      value={{
        pendingUserMessage,
        setPendingUserMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
