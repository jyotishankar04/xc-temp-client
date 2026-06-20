"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Boxes, Github, Loader2, Plus, Settings2 } from "lucide-react";
import { useServices } from "@/lib/hooks";

const statusConfig = {
  healthy: { variant: "outline" as const, label: "Healthy", dot: "bg-status-healthy" },
  degraded: { variant: "secondary" as const, label: "Degraded", dot: "bg-severity-medium" },
  down: { variant: "destructive" as const, label: "Down", dot: "bg-severity-high" },
};

const envConfig: Record<string, { variant: "outline" | "secondary" | "default"; label: string }> = {
  PRODUCTION: { variant: "default", label: "Production" },
  STAGING: { variant: "secondary", label: "Staging" },
  DEVELOPMENT: { variant: "outline", label: "Development" },
};

export default function ServicesPage() {
  const router = useRouter();
  const { data: services = [], isLoading, error } = useServices();

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-balance text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-pretty mt-1 text-sm text-muted-foreground">
            Manage your connected services and integrations
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-pretty text-destructive">Failed to load services. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-balance text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-pretty mt-1 text-sm text-muted-foreground">
            Manage connected services, SDK keys, and rollback policies
          </p>
        </div>
        <Button asChild>
          <Link href="/app/dashboard/services/new">
            <Plus className="mr-2 size-4" />
            New Service
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Boxes className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-balance mb-2 text-lg font-semibold">No services yet</h3>
              <p className="text-pretty mb-4 text-sm text-muted-foreground">
                Connect your first repository-backed service to start monitoring.
              </p>
              <Button asChild>
                <Link href="/app/dashboard/services/new">
                  <Plus className="mr-2 size-4" />
                  New Service
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Repository</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => {
                  const status = service.status?.toLowerCase() || "healthy";
                  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.healthy;
                  const env = envConfig[service.env] || envConfig.DEVELOPMENT;

                  return (
                    <TableRow
                      key={service.id}
                      className="cursor-pointer"
                      role="link"
                      tabIndex={0}
                      onClick={() => router.push(`/app/dashboard/services/${service.id}/overview`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/app/dashboard/services/${service.id}/overview`);
                        }
                      }}
                    >
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        {service.githubRepoFullName ? (
                          <span className="flex items-center gap-2 text-sm">
                            <Github className="size-4 text-muted-foreground" />
                            {service.githubRepoFullName}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not linked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={env.variant}>{env.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${config.dot}`} />
                          {config.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {service.updatedAt ? new Date(service.updatedAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(`/app/dashboard/services/${service.id}/settings`);
                          }}
                          aria-label="Service settings"
                        >
                          <Settings2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
