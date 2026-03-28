"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BadgeCheck, Boxes, Clock, Plus, Settings2 } from "lucide-react";

type Service = {
  id: string;
  name: string;
  environment: string;
  status: "healthy" | "degraded" | "down";
  lastEvent: string;
  failures: number;
  apiKey?: string;
};

const services: Service[] = [
  {
    id: "1",
    name: "payments-api",
    environment: "production",
    status: "degraded",
    lastEvent: "2 min ago",
    failures: 37,
    apiKey: "sk_live_payments_xxxx",
  },
  {
    id: "2",
    name: "api-gateway",
    environment: "production",
    status: "healthy",
    lastEvent: "5 min ago",
    failures: 0,
    apiKey: "sk_live_gateway_xxxx",
  },
  {
    id: "3",
    name: "auth-service",
    environment: "production",
    status: "healthy",
    lastEvent: "1 hr ago",
    failures: 2,
    apiKey: "sk_live_auth_xxxx",
  },
  {
    id: "4",
    name: "notification-service",
    environment: "production",
    status: "healthy",
    lastEvent: "3 hrs ago",
    failures: 0,
    apiKey: "sk_live_notify_xxxx",
  },
  {
    id: "5",
    name: "orders-service",
    environment: "staging",
    status: "healthy",
    lastEvent: "3 hrs ago",
    failures: 8,
    apiKey: "sk_test_orders_xxxx",
  },
];

const statusConfig = {
  healthy: { variant: "outline" as const, label: "Healthy", dot: "bg-green-500" },
  degraded: { variant: "secondary" as const, label: "Degraded", dot: "bg-amber-500" },
  down: { variant: "destructive" as const, label: "Down", dot: "bg-red-500" },
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your connected services and integrations
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Connect Service
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Event</TableHead>
                <TableHead className="text-right">Failures</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => {
                const config = statusConfig[service.status];
                return (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Boxes className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{service.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal capitalize">
                        {service.environment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${config.dot}`} />
                        <Badge variant={config.variant} className="text-xs capitalize">
                          {config.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="size-3.5" />
                        {service.lastEvent}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {service.failures > 0 ? (
                        <span className="text-sm font-medium text-amber-600">
                          {service.failures}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Settings2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
