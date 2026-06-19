"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { appConfig } from "@/lib/config/app";
import { useCurrentOrg } from "./use-orgs";

export function useNotificationsRealtime() {
  const queryClient = useQueryClient();
  const { data: currentOrg } = useCurrentOrg();

  useEffect(() => {
    if (!currentOrg?.id) {
      return;
    }

    const socket: Socket = io(appConfig.apiUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join-org", currentOrg.id);
    });

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "recent"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    socket.on("incident.created", refresh);
    socket.on("case.severity_escalated", refresh);
    socket.on("rca.completed", refresh);
    socket.on("rollback.triggered", refresh);
    socket.on("rollback.completed", refresh);
    socket.on("rollback.failed", refresh);
    socket.on("case.resolved", refresh);

    return () => {
      socket.emit("leave-org", currentOrg.id);
      socket.disconnect();
    };
  }, [currentOrg?.id, queryClient]);
}
