"use client";

import { LoaderIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { CallConnect } from "./call-connect";

interface CallProviderProps {
  conversationId: string;
  conversationName: string;
}

export const CallProvider = ({ conversationId, conversationName }: CallProviderProps) => {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center matrix-bg">
        <LoaderIcon className="size-8 animate-spin text-primary matrix-text-glow" />
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
