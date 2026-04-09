"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Boxes, Clock, Plus, Settings2, Loader2, ChevronRight, MoreVertical } from "lucide-react";
import { useServices, useCreateService, useDeleteService } from "@/lib/hooks";
import type { CreateServiceInput } from "@/lib/types/service";

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

export default function ServicesPage() {
  const { data: services = [], isLoading, error } = useServices();
  const createService = useCreateService();
  const deleteService = useDeleteService();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; serviceId: string | null }>({
    open: false,
    serviceId: null,
  });
  const [newService, setNewService] = useState<CreateServiceInput>({
    name: "",
    env: "DEVELOPMENT",
  });

  const handleCreate = async () => {
    try {
      await createService.mutateAsync(newService);
      setIsCreateOpen(false);
      setNewService({ name: "", env: "DEVELOPMENT" });
    } catch (e) {
      console.error("Failed to create service:", e);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.serviceId) return;
    try {
      await deleteService.mutateAsync(deleteConfirm.serviceId);
      setDeleteConfirm({ open: false, serviceId: null });
    } catch (e) {
      console.error("Failed to delete service:", e);
    }
  };

  const openDeleteConfirm = (serviceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm({ open: true, serviceId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your connected services and integrations
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Failed to load services. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your connected services and integrations
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Connect Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect New Service</DialogTitle>
              <DialogDescription>
                Add a new service to monitor its reliability and performance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., payments-api"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="env">Environment</Label>
                <Select
                  value={newService.env}
                  onValueChange={(value) => setNewService({ ...newService, env: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEVELOPMENT">Development</SelectItem>
                    <SelectItem value="STAGING">Staging</SelectItem>
                    <SelectItem value="PRODUCTION">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!newService.name || createService.isPending}
              >
                {createService.isPending && (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                )}
                Create Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {services?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Boxes className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Connect your first service to start monitoring.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="size-4 mr-2" />
                Connect Service
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services?.map((service) => {
                  const status = (service.status as keyof typeof statusConfig) || "healthy";
                  const statusConfigItem = statusConfig[status] || statusConfig.healthy;
                  const envConfigItem = envConfig[service.env] || envConfig.DEVELOPMENT;
                  
                  return (
                    <TableRow key={service.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link 
                          href={`/app/dashboard/services/${service.id}/overview`}
                          className="flex items-center gap-2 group"
                        >
                          <Boxes className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">
                            {service.name}
                          </span>
                          <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={envConfigItem.variant} className="text-xs font-normal capitalize">
                          {envConfigItem.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${statusConfigItem.dot}`} />
                          <Badge variant={statusConfigItem.variant} className="text-xs capitalize">
                            {statusConfigItem.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="size-3.5" />
                          {service.updatedAt
                            ? new Date(service.updatedAt).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/app/dashboard/services/${service.id}/settings`}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="size-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Settings2 className="size-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-red-500 hover:text-red-600"
                            onClick={(e) => openDeleteConfirm(service.id, e)}
                            disabled={deleteService.isPending}
                          >
                            {deleteService.isPending ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <MoreVertical className="size-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={handleDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone and all associated data will be permanently removed."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
