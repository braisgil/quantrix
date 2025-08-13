import { ChatProvider } from "@/features/chat/components/chat-provider";

interface SessionChatCardProps {
  sessionId: string;
  sessionName: string;
  onStartChat: () => void;
  disabled?: boolean;
  disabledMessage?: string;
}

export const SessionChatCard = ({ sessionId, sessionName, onStartChat, disabled, disabledMessage }: SessionChatCardProps) => {
  // onStartChat callback preserved for API consistency
  // Currently integrated directly with ChatProvider, but callback available for future enhancements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _onStartChat = onStartChat; // Preserved for API consistency
  
  return <ChatProvider channelId={sessionId} channelName={sessionName} disabled={disabled} disabledMessage={disabledMessage} />;
};