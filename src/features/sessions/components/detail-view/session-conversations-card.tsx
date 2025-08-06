import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Calendar, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import type { ConversationStatus } from "@/features/conversations/types";

interface Conversation {
  id: string;
  name: string;
  status: ConversationStatus;
  scheduledDateTime: Date | null;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
}

interface SessionConversationsCardProps {
  conversations: Conversation[];
  onCreateConversation: () => void;
}

export const SessionConversationsCard = ({ 
  conversations, 
  onCreateConversation 
}: SessionConversationsCardProps) => {
  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "completed":
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      case "processing":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  return (
    <Card className="matrix-card border-primary/20 backdrop-blur-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="w-4 h-4 text-primary" />
            Conversations
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {conversations.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
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
              <Link key={conversation.id} href={`/conversations/${conversation.id}`}>
                <div className="group p-4 rounded-lg border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                        <MessageSquare className="w-4 h-4 text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                            {conversation.name}
                          </h4>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(conversation.status)}`}>
                            {conversation.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {conversation.scheduledDateTime && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(conversation.scheduledDateTime), "MMM d, yyyy")}</span>
                            </div>
                          )}
                          
                          {conversation.scheduledDateTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{format(new Date(conversation.scheduledDateTime), "h:mm a")}</span>
                            </div>
                          )}
                          
                          {!conversation.scheduledDateTime && (
                            <span>Created {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
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