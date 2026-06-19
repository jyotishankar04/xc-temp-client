"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, Bell, CheckCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notificationsApi } from "@/lib/api";

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} hr ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function DashboardNotificationsPage() {
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: ["notifications", "page"],
    queryFn: async () => {
      const res = await notificationsApi.list(50);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch notifications");
      }
      return res.data ?? [];
    },
  });

  const markRead = async (id: string) => {
    await notificationsApi.markRead(id);
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  if (notificationsQuery.isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const items = notificationsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review incident, RCA, and rollback alerts in one place.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Bell className="size-3.5" />
          {items.filter((item) => !item.read).length} unread
        </Badge>
      </div>

      {items.length ? (
        <div className="grid gap-4">
          {items.map((notification) => (
            <Card key={notification.id} className={!notification.read ? "border-primary/30" : ""}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">{notification.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="uppercase text-[11px]">
                    {notification.type}
                  </Badge>
                  {!notification.read && (
                    <Button size="sm" variant="secondary" onClick={() => void markRead(notification.id)}>
                      <CheckCheck className="mr-1.5 size-3.5" />
                      Mark read
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <Link href={notification.href} className="hover:text-foreground hover:underline">
                  Open details
                </Link>
                <span>{formatRelativeTime(notification.createdAt)}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No notifications yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
