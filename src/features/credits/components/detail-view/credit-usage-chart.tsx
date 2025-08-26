"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Brain, Video, MessageSquare, Mic } from "lucide-react";
import { useQueryCreditUsageStats } from "../../api";

const SERVICE_ICONS = {
  openai_gpt4o: Brain,
  openai_gpt4o_mini: Brain,
  stream_video_call: Video,
  stream_chat_message: MessageSquare,
  stream_transcription: Mic,
};

const SERVICE_NAMES = {
  openai_gpt4o: "GPT-4o",
  openai_gpt4o_mini: "GPT-4o Mini",
  stream_video_call: "Video Calls",
  stream_chat_message: "Chat Messages",
  stream_transcription: "Transcriptions",
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export const CreditUsageChart = () => {
  const [period, setPeriod] = React.useState<"day" | "week" | "month" | "all">("week");
  const { data: stats, isLoading } = useQueryCreditUsageStats(period);

  if (isLoading) {
    return <CreditUsageChartSkeleton />;
  }

  const chartData = stats?.byService.map((item) => ({
    name: SERVICE_NAMES[item.service as keyof typeof SERVICE_NAMES] || item.service,
    credits: item.totalCost,
    count: item.count,
  })) || [];

  const pieData = stats?.byService.map((item, index) => ({
    name: SERVICE_NAMES[item.service as keyof typeof SERVICE_NAMES] || item.service,
    value: item.totalCost,
    color: COLORS[index % COLORS.length],
  })) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>
              Credit consumption by service
            </CardDescription>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList>
              <TabsTrigger value="day">24h</TabsTrigger>
              <TabsTrigger value="week">7d</TabsTrigger>
              <TabsTrigger value="month">30d</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">
              {stats?.totalCost.toFixed(2) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">
              Total credits used
            </p>
          </div>
          <Badge variant="secondary">
            {period === "day" ? "Last 24 hours" : 
             period === "week" ? "Last 7 days" : 
             period === "month" ? "Last 30 days" : 
             "All Time"}
          </Badge>
        </div>

        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="credits" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="pie" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          {stats?.byService.map((item) => {
            const Icon = SERVICE_ICONS[item.service as keyof typeof SERVICE_ICONS] || Brain;
            return (
              <div key={item.service} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-background">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {SERVICE_NAMES[item.service as keyof typeof SERVICE_NAMES] || item.service}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.count} operations
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {item.totalCost.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    credits
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const CreditUsageChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-[300px] w-full" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

