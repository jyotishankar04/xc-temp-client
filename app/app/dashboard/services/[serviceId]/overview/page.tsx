"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useServiceById, useServiceMembers, useApiKeys } from "@/lib/hooks";
import { Loader2, Users, Key, Clock, Settings2 } from "lucide-react";
import Link from "next/link";

const statusConfig = {
  healthy: { variant: "outline" as const, label: "Healthy", dot: "bg-green-500" },
  degraded: { variant: "secondary" as const, label: "Degraded", dot: "bg-amber-500" },
  down: { variant: "destructive" as const, label: "Down", dot: "bg-red-500" },
};

const envConfig: Record<string, { variant: "outline" | "secondary" | "default"; label: string }> = {
  PRODUCTION: { variant: "default" as const, label: "Production" },
  STAGING: { variant: "secondary" as const, label: "Staging" },
  DEVELOPMENT: { variant: "outline" as const, label: "Development" },
};

export default function ServiceOverviewPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;

  const { data: service, isLoading: serviceLoading } = useServiceById(serviceId);
  const { data: members = [] } = useServiceMembers(serviceId);
  const { data: apiKeys = [] } = useApiKeys(serviceId);

  if (serviceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const status = (service?.status as keyof typeof statusConfig) || "healthy";
  const statusConfigItem = statusConfig[status] || statusConfig.healthy;
  const envConfigItem = envConfig[service?.env || "DEVELOPMENT"] || envConfig.DEVELOPMENT;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{service?.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Service overview and quick stats
          </p>
        </div>
        <Link href={`/app/dashboard/services/${serviceId}/settings`}>
          <Button variant="outline" size="sm">
            <Settings2 className="size-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <span className={`size-2 rounded-full ${statusConfigItem.dot}`} />
          </CardHeader>
          <CardContent>
            <Badge variant={statusConfigItem.variant}>{statusConfigItem.label}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={envConfigItem.variant}>{envConfigItem.label}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                href={`/app/dashboard/services/${serviceId}/members`}
                className="hover:underline"
              >
                Manage members
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
            <Key className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.length}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                href={`/app/dashboard/services/${serviceId}/api-keys`}
                className="hover:underline"
              >
                Manage keys
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Service ID</p>
              <p className="text-sm font-mono mt-1">{service?.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Environment</p>
              <p className="text-sm font-medium mt-1">{service?.env}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm font-medium mt-1">
                {service?.createdAt
                  ? new Date(service.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium mt-1">
                {service?.updatedAt
                  ? new Date(service.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
