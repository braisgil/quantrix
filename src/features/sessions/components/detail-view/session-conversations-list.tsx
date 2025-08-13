import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Plus } from "lucide-react";
import { ConversationListItem } from "@/features/conversations/components";
import { ConversationGetMany } from "@/features/conversations/types";
import { Badge } from "@/components/ui/badge";

interface SessionConversationsListProps {
  conversations: ConversationGetMany;
  onCreateConversation: () => void;
  onDeleteConversation?: (conversation: ConversationGetMany[number]) => void;
  deletingConversationId?: string;
  onViewConversation?: (conversation: ConversationGetMany[number]) => void;
}



export const SessionConversationsList = ({ 
  conversations, 
  onCreateConversation,
  onDeleteConversation,
  deletingConversationId,
  onViewConversation,
}: SessionConversationsListProps) => {
  

  return (
    <div className={`flex flex-col ${conversations.length > 1 ? "h-[calc(100vh-12rem)] sm:h-[70vh] min-h-[420px]" : ""}`}>
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Phone className="w-4 h-4 text-primary" />
          <CardTitle className="text-lg font-bold quantrix-gradient matrix-text-glow">
            Conversations
          </CardTitle>
        </div>  
        <CardDescription>
          Conversations within this session
        </CardDescription>
        <div className="mt-2 gap-2 text-xs">
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30 dark:text-yellow-400 dark:bg-yellow-500/10">
            Scheduled: Not joinable until 30 min before scheduled time
          </Badge>
        </div>
        {conversations.length > 0 && (
          <Button 
            onClick={onCreateConversation}
            className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold matrix-glow w-full"
          >
            <Plus className="w-3 h-3 mr-2" />
            Add Conversation
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-0 flex-1 min-h-0 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center matrix-border">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
            
            <h3 className="text-sm font-semibold mb-2">No Conversations Yet</h3>
            
            <p className="text-xs text-muted-foreground mb-4 max-w-sm">
              Start creating conversations within this session to organize your AI interactions.
            </p>
            
            <Button 
              onClick={onCreateConversation}
              size="sm"
              className="matrix-glow bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-3 h-3 mr-2" />
              Create First Conversation
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                onViewConversation={onViewConversation || (() => {})}
                onDelete={onDeleteConversation}
                isDeleting={deletingConversationId === conversation.id}
              />
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
};