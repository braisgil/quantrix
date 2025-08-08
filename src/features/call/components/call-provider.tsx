"use client";


import { authClient } from "@/lib/auth-client";
import { CallConnect } from "./call-connect";
import type { CallProviderProps } from "../types";

export const CallProvider = ({ conversationId, conversationName }: CallProviderProps) => {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="min-h-screen matrix-bg matrix-section flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <CallConnect
      conversationId={conversationId}
      conversationName={conversationName}
      userId={data.user.id}
      userName={data.user.name}
    />
  );
};
