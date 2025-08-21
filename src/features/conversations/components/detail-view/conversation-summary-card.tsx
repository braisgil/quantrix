'use client';

import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConversationDetail } from '../../types';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

interface ConversationSummaryCardProps {
  conversation: ConversationDetail;
}

export const ConversationSummaryCard: React.FC<ConversationSummaryCardProps> = ({ conversation }) => {
  const hasSummary = !!conversation.summary;
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = (conversation.summary || '').length > 280;

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <FileText className="w-4 h-4 text-primary" />
        <h4 className="text-lg font-bold quantrix-gradient matrix-text-glow">Summary & Resources</h4>
      </div>
      <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
        <div className="space-y-4">
          {/* Summary */}
          {hasSummary ? (
            <div>
              <div className={isExpanded ? "prose prose-sm dark:prose-invert max-w-none" : "prose prose-sm dark:prose-invert max-w-none max-h-48 overflow-hidden relative"}>
                {!isExpanded && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-primary/5 to-transparent" />
                )}
                <ReactMarkdown
                components={{
                  h1: ({ children }) => <h2 className="text-base font-semibold text-foreground mb-2">{children}</h2>,
                  h2: ({ children }) => <h3 className="text-sm font-semibold text-foreground mb-2">{children}</h3>,
                  h3: ({ children }) => <h4 className="text-sm font-semibold text-foreground mb-2">{children}</h4>,
                  p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-2">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-background/60 border border-border/50 text-xs">{children}</code>,
                  pre: ({ children }) => (
                    <pre className="p-3 rounded-lg bg-background/70 border border-border/50 overflow-auto text-xs leading-relaxed">
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noreferrer" className="text-primary underline">
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-border/60 pl-3 italic text-muted-foreground">{children}</blockquote>
                  ),
                }}
                >
                  {conversation.summary}
                </ReactMarkdown>
              </div>
              {isLong && (
                <div className="mt-2">
                  <Button size="sm" variant="ghost" className="text-primary px-0" onClick={() => setIsExpanded((v) => !v)}>
                    {isExpanded ? 'View less' : 'View more'}
                  </Button>
                </div>
              )}
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
              <span className="text-sm text-muted-foreground">No resources available for this conversation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 