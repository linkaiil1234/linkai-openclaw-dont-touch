"use client";

import React from "react";
import { buildWhatsAppOAuthUrl } from "@/lib/meta/oauth";

type Props = {
  userId: string;
  agentId: string;
  returnTo?: string | null;
  className?: string;
};

export const WAConnectButton = ({
  userId,
  agentId,
  returnTo = "/dashboard",
  className,
}: Props) => {
  const handleClick = () => {
    const url = buildWhatsAppOAuthUrl({ userId, agentId, returnTo });

    window.location.href = url;
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ??
        "rounded-md bg-green-600 text-white px-4 py-2 hover:bg-green-700"
      }
    >
      Connect WhatsApp
    </button>
  );
};
