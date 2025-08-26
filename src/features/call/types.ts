// Component Props Types
export interface CallUIProps {
  conversationId: string;
  conversationName: string;
}

export interface CallProviderProps {
  conversationId: string;
  conversationName: string;
}

export interface CallConnectProps {
  conversationId: string;
  conversationName: string;
  userId: string;
  userName: string;
}

export interface CallActiveProps {
  onLeave: () => void;
  conversationName: string;
}

export interface CallLobbyProps {
  onJoin: () => void;
}

export interface CallViewProps {
  conversationId: string;
}

// Call State Types
export type CallState = "lobby" | "call" | "ended";

// Stream Video Types
export interface StreamUser {
  id: string;
  name: string;
  role?: string;
}

// Error Types
export interface CallError extends Error {
  code?: string;
  status?: number;
}