import { ConversationStatus } from '../types';
import type { ConversationList } from '../types';
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
    case ConversationStatus.Available:
    case ConversationStatus.Active:
      return Mic;
    case ConversationStatus.Completed:
      return CheckCircle2;
    case ConversationStatus.Scheduled:
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
    case ConversationStatus.Available:
      return 'Available';
    case ConversationStatus.Active:
      return 'Active';
    case ConversationStatus.Completed:
      return 'Completed';
    case ConversationStatus.Scheduled:
      return 'Scheduled';
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
    case ConversationStatus.Available:
    case ConversationStatus.Active:
      return 'text-green-500';
    case ConversationStatus.Completed:
      return 'text-blue-500';
    case ConversationStatus.Scheduled:
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
 * Determines the effective status to display to the user.
 * If a conversation is scheduled but can be joined now, it is treated as Available.
 */
export const getEffectiveDisplayStatus = <T extends { status: ConversationStatus | string; availableAt?: string | Date | null }>(
  conversation: T,
): ConversationStatus => {
  if (
    conversation.status === ConversationStatus.Scheduled &&
    isConversationJoinAvailable(conversation)
  ) {
    return ConversationStatus.Available;
  }
  // Normalize unknown string values to a safe default
  const statusValue = conversation.status as ConversationStatus;
  return statusValue;
};

/**
 * Returns cohesive badge classes (bg/text/border) per status, matching the app's palette.
 */
export const getConversationStatusBadgeClasses = (status: ConversationStatus): string => {
  switch (status) {
    case ConversationStatus.Available:
      return 'bg-green-500/10 text-green-700 border-green-500/30 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/30';
    case ConversationStatus.Active:
      return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30';
    case ConversationStatus.Completed:
      return 'bg-blue-500/10 text-blue-700 border-blue-500/30 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/30';
    case ConversationStatus.Scheduled:
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/30';
    case ConversationStatus.Processing:
      return 'bg-purple-500/10 text-purple-700 border-purple-500/30 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/30';
    case ConversationStatus.Cancelled:
      return 'bg-red-500/10 text-red-700 border-red-500/30 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/30';
    default:
      return 'bg-muted/50 text-muted-foreground border-border/50';
  }
};

/**
 * Formats the duration of a conversation
 */
import { formatDurationBetween } from "@/utils/duration";

export const formatConversationDuration = (startedAt: string | null, endedAt: string | null) => {
  return formatDurationBetween(startedAt, endedAt);
};

/**
 * Calculates conversation statistics for dashboard display
 */
export const calculateConversationStats = (conversations: ConversationList) => {
  const totalConversations = conversations.length;
  const activeConversations = conversations.filter(c => c.status === ConversationStatus.Active).length;
  const completedConversations = conversations.filter(c => c.status === ConversationStatus.Completed).length;
  const scheduledConversations = conversations.filter(c => c.status === ConversationStatus.Scheduled).length;
  const availableConversations = conversations.filter(c => c.status === ConversationStatus.Available).length;

  return {
    totalConversations,
    activeConversations,
    completedConversations,
    scheduledConversations,
    availableConversations,
  };
};

/**
 * Determines if a conversation can be joined at the current time.
 * - Active conversations are always joinable
 * - If a conversation has a schedule, it becomes joinable 30 minutes before the scheduled time
 * - If there is no schedule, it is joinable immediately
 */
export const isConversationJoinAvailable = <T extends { status: ConversationStatus | string; availableAt?: string | Date | null }>(
  conversation: T,
  referenceNow: Date = new Date(),
) => {
  // Never join completed/cancelled/processing conversations
  if (
    conversation.status === ConversationStatus.Completed ||
    conversation.status === ConversationStatus.Cancelled ||
    conversation.status === ConversationStatus.Processing
  ) {
    return false;
  }

  // Active and Available are always joinable
  if (conversation.status === ConversationStatus.Active) return true;
  if (conversation.status === ConversationStatus.Available) return true;

  // For Scheduled, only joinable once within availability window
  const availableAt = conversation.availableAt ? new Date(conversation.availableAt) : null;
  if (!availableAt) return false;
  return referenceNow.getTime() >= availableAt.getTime();
};

/**
 * Returns a human label for an upcoming conversation's availability:
 * - "Available" if it can be joined now
 * - "Scheduled" if it is not yet within the 30-minute window
 */
export const getUpcomingAvailabilityLabel = <T extends { status: ConversationStatus | string }>(
  conversation: T,
) => {
  if (conversation.status !== ConversationStatus.Scheduled) return '';
  return isConversationJoinAvailable(conversation) ? 'Available' : 'Scheduled';
};
