"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RefreshCw, 
  Settings,
  XCircle,
  Clock
} from "lucide-react";
import { useQueryCreditTransactions } from "../../api";
import { cn } from "@/lib/utils";
import { CreditTransactionListSkeleton } from "../skeletons";

const TRANSACTION_ICONS = {
  purchase: ArrowDownCircle,
  usage: ArrowUpCircle,
  refund: RefreshCw,
  adjustment: Settings,
  expiration: XCircle,
};

const TRANSACTION_COLORS = {
  purchase: "text-green-500",
  usage: "text-red-500",
  refund: "text-blue-500",
  adjustment: "text-yellow-500",
  expiration: "text-gray-500",
};

interface CreditTransactionListProps {
  limit?: number;
  showLoadMore?: boolean;
  className?: string;
}

export const CreditTransactionList = ({ 
  limit = 10, 
  showLoadMore = true,
  className 
}: CreditTransactionListProps) => {
  const [offset, setOffset] = React.useState(0);
  const { data: transactions, isLoading } = useQueryCreditTransactions({ 
    limit, 
    offset 
  });

  if (isLoading) {
    return <CreditTransactionListSkeleton />;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Recent credit transactions and usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {transactions?.map((transaction) => {
              const Icon = TRANSACTION_ICONS[transaction.type];
              const colorClass = TRANSACTION_COLORS[transaction.type];
              const isPositive = transaction.amount > 0;

              return (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-0.5", colorClass)}>
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {transaction.description || `${transaction.type} transaction`}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold",
                      isPositive ? "text-green-600" : "text-red-600"
                    )}>
                      {isPositive ? "+" : ""}{transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Balance: {transaction.balanceAfter.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {showLoadMore && transactions && transactions.length === limit && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(offset + limit)}
              >
                Load More
              </Button>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};



