'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConversationGetOne } from '../../types';

interface ConversationSummaryCardProps {
  conversation: ConversationGetOne;
}

export const ConversationSummaryCard: React.FC<ConversationSummaryCardProps> = ({ conversation }) => {
  const hasTranscript = !!conversation.transcriptUrl;
  const hasRecording = !!conversation.recordingUrl;
  const hasSummary = !!conversation.summary;

  return (
    <Card className="matrix-card border-primary/20 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold matrix-text-glow">
          Summary & Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        {hasSummary ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Summary</h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {conversation.summary}
            </p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No summary available for this conversation.
          </div>
        )}

        {/* Resources */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Resources</h4>
          <div className="flex flex-wrap gap-2">
            {hasTranscript && (
              <Button
                size="sm"
                variant="view"
                onClick={() => conversation.transcriptUrl && window.open(conversation.transcriptUrl, '_blank')}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Transcript
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
            {hasRecording && (
              <Button
                size="sm"
                variant="call"
                onClick={() => conversation.recordingUrl && window.open(conversation.recordingUrl, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Recording
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
            {!hasTranscript && !hasRecording && (
              <span className="text-sm text-muted-foreground">
                No resources available for this conversation.
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 