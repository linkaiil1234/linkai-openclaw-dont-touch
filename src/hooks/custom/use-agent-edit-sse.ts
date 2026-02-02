import { useCallback, useRef, useState } from "react";
import { getIdToken } from "firebase/auth";

import { env } from "@/constants/env";
import { auth } from "@/services/firebase";

export type SSEMessage = {
  type:
    | "connection_established"
    | "message_chunk"
    | "message_complete"
    | "error";
  content?: string;
  error?: string;
  timestamp?: number;
};

type UseAgentEditSSEParams = {
  onChunk?: (content: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: string) => void;
};

export const useAgentEditSSE = ({
  onChunk,
  onComplete,
  onError,
}: UseAgentEditSSEParams = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (agent_id: string, message: string) => {
      setIsLoading(true);
      setError(null);
      setStreamingContent("");

      try {
        const idToken = auth.currentUser
          ? await getIdToken(auth.currentUser)
          : null;

        if (!idToken) {
          throw new Error("Authentication required");
        }

        // Create abort controller for cancellation
        abortControllerRef.current = new AbortController();

        const response = await fetch(`${env.apiUrl}/agent/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ agent_id, message }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`,
          );
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data: SSEMessage = JSON.parse(line.slice(6));

                if (data.type === "message_chunk" && data.content) {
                  fullContent += data.content;
                  setStreamingContent((prev) => prev + data.content);
                  onChunk?.(data.content);
                } else if (data.type === "message_complete") {
                  if (data.content) {
                    fullContent = data.content;
                    setStreamingContent(data.content);
                  }
                  onComplete?.(fullContent);
                  setIsLoading(false);
                } else if (data.type === "error") {
                  const errorMsg = data.error || "Unknown error occurred";
                  setError(errorMsg);
                  onError?.(errorMsg);
                  setIsLoading(false);
                }
              } catch (parseError) {
                console.error("Failed to parse SSE message:", parseError);
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          console.log("Request aborted");
        } else {
          const errorMsg = err instanceof Error ? err.message : "Unknown error";
          setError(errorMsg);
          onError?.(errorMsg);
        }
        setIsLoading(false);
      }
    },
    [onChunk, onComplete, onError],
  );

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    setStreamingContent("");
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    sendMessage,
    cancel,
    reset,
    isLoading,
    error,
    streamingContent,
  };
};
