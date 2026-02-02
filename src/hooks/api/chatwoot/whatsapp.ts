import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TApiPromise, TMutationOpts } from "@/types/api";

export type TCompleteWhatsAppSetupData = {
  code: string;
  phone_number_id: string;
  waba_id: string;
  business_id: string;
  agent_id: string;
};

export type TCompleteWhatsAppSetupResponse = {
  inbox_id: number;
  phone_number: string;
  verified_name: string;
};

const completeWhatsAppSetup = (
  data: TCompleteWhatsAppSetupData,
): TApiPromise<TCompleteWhatsAppSetupResponse> => {
  return api.post("/chatwoot/whatsapp/complete-setup", data);
};

/**
 * Completes WhatsApp setup after embedded signup
 * This endpoint exchanges the OAuth code for a token and creates the Chatwoot inbox
 */
export const useCompleteWhatsAppSetup = (
  options?: TMutationOpts<
    TCompleteWhatsAppSetupData,
    TCompleteWhatsAppSetupResponse
  >,
) => {
  return useMutation({
    mutationKey: ["useCompleteWhatsAppSetup"],
    mutationFn: (data: TCompleteWhatsAppSetupData) =>
      completeWhatsAppSetup(data),
    ...options,
  });
};
