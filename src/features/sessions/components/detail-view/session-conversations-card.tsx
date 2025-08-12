import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { ConversationListItem } from "@/features/conversations/components";
import { ConversationGetMany } from "@/features/conversations/types";

interface SessionConversationsCardProps {
  conversations: ConversationGetMany;
  onCreateConversation: () => void;
  onDeleteConversation?: (conversation: ConversationGetMany[number]) => void;
  deletingConversationId?: string;
  onViewConversation?: (conversation: ConversationGetMany[number]) => void;
}



export const SessionConversationsCard = ({ 
  conversations, 
  onCreateConversation,
  onDeleteConversation,
  deletingConversationId,
  onViewConversation,
}: SessionConversationsCardProps) => {
  

  return (
    <Card className="matrix-card h-[calc(100vh-12rem)] sm:h-[70vh] min-h-[420px] flex flex-col">
      <CardHeader className="pb-4 px-0 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <CardTitle className="text-lg font-bold quantrix-gradient matrix-text-glow">
            Conversations
          </CardTitle>
        </div>  
        <CardDescription>
          Conversations within this session
        </CardDescription>
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
              className="matrix-glow bg-primary hover:bg-primary/90 text-black"
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
            
            <Button 
              onClick={onCreateConversation}
              variant="outline"
              size="sm"
              className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary"
            >
              <Plus className="w-3 h-3 mr-2" />
              Add Conversation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};