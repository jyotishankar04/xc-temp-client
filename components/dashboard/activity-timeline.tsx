"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, CheckCircle, AlertTriangle, Zap } from "lucide-react";

type ActivityItem = {
  id: string;
  time: string;
  message: string;
  type: "ai" | "action" | "alert" | "system";
};

const activities: ActivityItem[] = [
  {
    id: "1",
    time: "10:46",
    message: "Recovery recommendation generated",
    type: "ai",
  },
  {
    id: "2",
    time: "10:45",
    message: "AI analysis completed (confidence: 72%)",
    type: "ai",
  },
  {
    id: "3",
    time: "10:44",
    message: "Failure grouped into Case #142",
    type: "action",
  },
  {
    id: "4",
    time: "10:43",
    message: "Spike in error rate detected",
    type: "alert",
  },
  {
    id: "5",
    time: "10:42",
    message: "Error spike detected in payments-service",
    type: "alert",
  },
  {
    id: "6",
    time: "10:40",
    message: "Recovery action executed: Auto-restart",
    type: "action",
  },
  {
    id: "7",
    time: "10:38",
    message: "Service health restored: api-gateway",
    type: "system",
  },
  {
    id: "8",
    time: "10:35",
    message: "Case #141 marked as resolved",
    type: "action",
  },
];

const typeConfig: Record<
  ActivityItem["type"],
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  ai: {
    icon: <Bot className="size-3.5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
  action: {
    icon: <Zap className="size-3.5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  alert: {
    icon: <AlertTriangle className="size-3.5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  system: {
    icon: <CheckCircle className="size-3.5" />,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
};

export function ActivityTimeline() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          <div className="flex flex-col">
            {activities.map((activity, index) => {
              const config = typeConfig[activity.type];
              const isLast = index === activities.length - 1;
              return (
                <div key={activity.id} className="flex items-start gap-3 px-6 py-2.5 hover:bg-muted/50 transition-colors">
                  <div
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                      config.bgColor,
                      config.color
                    )}
                  >
                    {config.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <p className="text-sm leading-snug">{activity.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
