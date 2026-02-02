"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface InboxContextType {
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  openConversation: (id: string) => void;
  contactIdToOpen: string | null;
  setContactIdToOpen: (id: string | null) => void;
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [contactIdToOpen, setContactIdToOpen] = useState<string | null>(null);

  const openConversation = useCallback((id: string) => {
    // This can be either a conversation ID or contact ID
    // We'll use contactIdToOpen to find the conversation
    setContactIdToOpen(id);
  }, []);

  return (
    <InboxContext.Provider
      value={{
        selectedConversationId,
        setSelectedConversationId,
        openConversation,
        contactIdToOpen,
        setContactIdToOpen,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (context === undefined) {
    throw new Error("useInbox must be used within an InboxProvider");
  }
  return context;
}
