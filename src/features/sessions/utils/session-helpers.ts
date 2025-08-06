import { SessionStatus } from "../types";

export const getSessionStatusColor = (status: SessionStatus) => {
  switch (status) {
    case SessionStatus.Active:
      return "bg-primary/10 text-primary border-primary/30";
    case SessionStatus.Archived:
      return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    case SessionStatus.Completed:
      return "bg-green-500/10 text-green-500 border-green-500/30";
    default:
      return "bg-primary/10 text-primary border-primary/30";
  }
};

export const getSessionStatusLabel = (status: SessionStatus) => {
  switch (status) {
    case SessionStatus.Active:
      return "Active";
    case SessionStatus.Archived:
      return "Archived";
    case SessionStatus.Completed:
      return "Completed";
    default:
      return status;
  }
};

export const formatSessionName = (name: string, maxLength: number = 50) => {
  if (name.length <= maxLength) return name;
  return `${name.substring(0, maxLength)}...`;
};

export const canCreateConversation = (status: SessionStatus) => {
  return status === SessionStatus.Active;
};

export const canEditSession = (status: SessionStatus) => {
  return status === SessionStatus.Active;
};

export const canArchiveSession = (status: SessionStatus) => {
  return status === SessionStatus.Active || status === SessionStatus.Completed;
};

export const canCompleteSession = (status: SessionStatus) => {
  return status === SessionStatus.Active;
};