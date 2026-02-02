import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts } from "@/types/api";

// Embedding Types
export type TCreateTextEmbeddingPayload = {
  text: string;
  agent_id?: string;
};

export type TEmbedding = {
  _id: string;
  type: "file" | "text" | "website";
  embedding: number[];
  chunk_index?: number;
  content?: string;
  file?: string;
  url?: string;
  title?: string;
  agent?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
};

export type TCreateTextEmbeddingResponse = {
  count: number;
  embeddings: TEmbedding[];
};

// Embedding Services
const createTextEmbedding = (
  payload: TCreateTextEmbeddingPayload,
): TApiPromise<TCreateTextEmbeddingResponse> => {
  return api.post("/embedding/text", payload);
};

// Embedding Hooks
export const useCreateTextEmbedding = (
  options?: TMutationOpts<
    TCreateTextEmbeddingPayload,
    TCreateTextEmbeddingResponse
  >,
) => {
  return useMutation({
    mutationKey: ["useCreateTextEmbedding"],
    mutationFn: createTextEmbedding,
    ...options,
  });
};
