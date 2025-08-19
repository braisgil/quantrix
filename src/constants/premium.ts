export const MAX_FREE_AGENTS = 1;
export const MAX_FREE_SESSIONS = 1;
export const MAX_FREE_CONVERSATIONS = 3;

// Two premium kinds with different usage limits
export const PREMIUM_TIERS = {
  innerCircle: { agents: 3, sessions: 3, conversations: 9 },
  social: { agents: 10, sessions: 10, conversations: 30 },
} as const;


