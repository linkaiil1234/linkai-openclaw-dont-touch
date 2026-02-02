import { useMutation } from "@tanstack/react-query";
import { getIdToken } from "firebase/auth";

import { env } from "@/constants/env";
import { auth } from "@/services/firebase";
import type { TApiSuccess, TMutationOpts } from "@/types/api";
import { TConversationStatus } from "@/types/common";

export type TSendMessagePayload = {
  conversation_id: string;
  user_message: string;
  agent_id: string;
  channel_id: string;
};

export type TMessageEvent = {
  conversation_id: string;
  role: "user" | "agent";
  content: string;
};

export type TStatusEvent = {
  conversation_id: string;
  status: TConversationStatus | "processing" | "completed";
};

export type TSendMessageCallbacks = {
  onStatus?: (event: TStatusEvent) => void;
  onMessage?: (event: TMessageEvent) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
};

const sendMessage = async (
  payload: TSendMessagePayload,
  callbacks?: TSendMessageCallbacks,
): Promise<TApiSuccess<void>> => {
  const idToken = auth.currentUser ? await getIdToken(auth.currentUser) : null;

  if (!idToken) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${env.apiUrl}/conversation/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Failed to send message",
      status_code: response.status,
    }));
    throw new Error(errorData.message || "Failed to send message");
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let currentEventType: string | null = null;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Process any remaining buffer
        if (buffer.trim()) {
          const lines = buffer.split("\n");
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEventType = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr) {
                try {
                  const data = JSON.parse(dataStr);
                  if (currentEventType === "status" || "status" in data) {
                    callbacks?.onStatus?.(data as TStatusEvent);
                  } else if (
                    currentEventType === "message" ||
                    ("role" in data && "content" in data)
                  ) {
                    callbacks?.onMessage?.(data as TMessageEvent);
                  }
                } catch (parseError) {
                  console.error(
                    "[sendMessage] Failed to parse SSE data:",
                    parseError,
                  );
                }
              }
            }
          }
        }
        callbacks?.onComplete?.();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEventType = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          const dataStr = line.slice(6).trim();
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);

            // Use event type if available, otherwise infer from data structure
            if (currentEventType === "status" || "status" in data) {
              callbacks?.onStatus?.(data as TStatusEvent);
            } else if (
              currentEventType === "message" ||
              ("role" in data && "content" in data)
            ) {
              callbacks?.onMessage?.(data as TMessageEvent);
            }
          } catch (parseError) {
            console.error(
              "[sendMessage] Failed to parse SSE data:",
              parseError,
            );
          }

          // Reset event type after processing data (blank line follows)
          currentEventType = null;
        } else if (line.trim() === "") {
          // Blank line indicates end of event block
          currentEventType = null;
        }
      }
    }

    return {
      message: "Message sent successfully",
      data: undefined,
    };
  } catch (error) {
    callbacks?.onError?.(
      error instanceof Error ? error : new Error(String(error)),
    );
    throw error;
  } finally {
    reader.releaseLock();
  }
};

export type TUseSendMessageOptions = Omit<
  TMutationOpts<TSendMessagePayload, void>,
  "mutationFn"
> & {
  callbacks?: TSendMessageCallbacks;
};

export const useSendMessage = (options?: TUseSendMessageOptions) => {
  const { callbacks, ...mutationOptions } = options || {};

  return useMutation({
    mutationKey: ["useSendMessage"],
    mutationFn: (payload: TSendMessagePayload) =>
      sendMessage(payload, callbacks),
    ...mutationOptions,
  });
};
