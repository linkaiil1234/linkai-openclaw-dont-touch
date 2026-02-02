import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts } from "@/types/api";

export type TInitiateWhatsAppSignupData = {
  agent_id: string;
};

export type TInitiateWhatsAppSignupResponse = {
  signup_url: string;
};

const initiateWhatsAppSignup = (
  data: TInitiateWhatsAppSignupData,
): TApiPromise<TInitiateWhatsAppSignupResponse> => {
  return api.post("/meta/whatsapp/initiate-signup", {
    agent_id: data.agent_id,
  });
};

export const useInitiateWhatsAppSignup = (
  options?: TMutationOpts<
    TInitiateWhatsAppSignupData,
    TInitiateWhatsAppSignupResponse
  >,
) => {
  return useMutation({
    mutationKey: ["useInitiateWhatsAppSignup"],
    mutationFn: (data: TInitiateWhatsAppSignupData) =>
      initiateWhatsAppSignup(data),
    ...options,
  });
};
