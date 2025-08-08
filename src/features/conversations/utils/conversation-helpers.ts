import { ConversationStatus } from '../types';
import type { ConversationGetMany } from '../types';
import {
  CheckCircle2,
  Clock,
  Mic,
  Cog,
  XCircle,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';

/**
 * Gets the appropriate icon for a conversation based on its status
 */
export const getConversationIcon = (status: ConversationStatus): LucideIcon => {
  switch (status) {
    case ConversationStatus.Active:
      return Mic;
    case ConversationStatus.Completed:
      return CheckCircle2;
    case ConversationStatus.Upcoming:
      return Clock;
    case ConversationStatus.Processing:
      return Cog;
    case ConversationStatus.Cancelled:
      return XCircle;
    default:
      return MessageSquare;
  }
};

/**
 * Gets a human-readable status label for a conversation
 */
export const getConversationStatusLabel = (status: ConversationStatus) => {
  switch (status) {
    case ConversationStatus.Active:
      return 'Active';
    case ConversationStatus.Completed:
      return 'Completed';
    case ConversationStatus.Upcoming:
      return 'Upcoming';
    case ConversationStatus.Processing:
      return 'Processing';
    case ConversationStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

/**
 * Gets the status color class for styling
 */
export const getConversationStatusColor = (status: ConversationStatus) => {
  switch (status) {
    case ConversationStatus.Active:
      return 'text-green-500';
    case ConversationStatus.Completed:
      return 'text-blue-500';
    case ConversationStatus.Upcoming:
      return 'text-yellow-500';
    case ConversationStatus.Processing:
      return 'text-purple-500';
    case ConversationStatus.Cancelled:
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Formats the duration of a conversation
 */
export const formatConversationDuration = (startedAt: string | null, endedAt: string | null) => {
  if (!startedAt) return 'Not started';
  if (!endedAt) return 'In progress';
  
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  const durationMs = end.getTime() - start.getTime();
  const minutes = Math.floor(durationMs / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

/**
 * Calculates conversation statistics for dashboard display
 */
export const calculateConversationStats = (conversations: ConversationGetMany) => {
  const totalConversations = conversations.length;
  const activeConversations = conversations.filter(c => c.status === ConversationStatus.Active).length;
  const completedConversations = conversations.filter(c => c.status === ConversationStatus.Completed).length;
  const upcomingConversations = conversations.filter(c => c.status === ConversationStatus.Upcoming).length;

  return {
    totalConversations,
    activeConversations,
    completedConversations,
    upcomingConversations,
  };
};
