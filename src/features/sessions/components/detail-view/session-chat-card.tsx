import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Mic } from "lucide-react";

interface SessionChatCardProps {
  sessionId: string;
  onStartChat: () => void;
}

export const SessionChatCard = ({ sessionId, onStartChat }: SessionChatCardProps) => {
  return (
    <Card className="matrix-card border-primary/20 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="w-4 h-4 text-primary" />
          Chat Interface
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center matrix-border">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <h3 className="text-sm font-semibold mb-2">Live Chat Coming Soon</h3>
          
          <p className="text-xs text-muted-foreground mb-6 max-w-sm">
            Direct chat interface with your AI companion will be available here. Start conversations or engage in real-time dialogue.
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={onStartChat}
              size="sm"
              variant="outline"
              className="matrix-glow matrix-border"
              disabled
            >
              <Send className="w-3 h-3 mr-2" />
              Text Chat
            </Button>
            <Button 
              onClick={onStartChat}
              size="sm"
              variant="outline"
              className="matrix-glow matrix-border"
              disabled
            >
              <Mic className="w-3 h-3 mr-2" />
              Voice Chat
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Placeholder - Implementation in progress
          </p>
        </div>
      </CardContent>
    </Card>
  );
};