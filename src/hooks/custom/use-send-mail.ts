import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";

type SendAgentCreationEmailParams = {
  agentName: string;
  agentId: string;
};

export const useSendMail = () => {
  const [isSending, setIsSending] = useState(false);

  const sendAgentCreationEmail = async (
    params: SendAgentCreationEmailParams,
  ) => {
    setIsSending(true);
    try {
      await api.post("/mail/agent-creation", {
        agentName: params.agentName,
        agentId: params.agentId,
      });

      console.log(
        "[useSendMail] Agent creation email sent successfully",
        params,
      );
      return { success: true };
    } catch (error) {
      console.error("[useSendMail] Error sending email:", error);
      // Don't show error toast to user as email is a background feature
      // Just log it for debugging purposes
      return { success: false, error };
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendAgentCreationEmail,
    isSending,
  };
};
