"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  useServiceById,
  useUpdateService,
  useDeleteService,
} from "@/lib/hooks";
import { Loader2, Trash2 } from "lucide-react";

export default function ServiceSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.serviceId as string;

  const { data: service, isLoading: serviceLoading } = useServiceById(serviceId);
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [name, setName] = useState(service?.name || "");
  const [env, setEnv] = useState(service?.env || "DEVELOPMENT");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteName, setDeleteName] = useState("");

  const isLoading = serviceLoading || updateService.isPending || deleteService.isPending;

  const handleSave = async () => {
    try {
      await updateService.mutateAsync({ serviceId, data: { name } });
    } catch (e) {
      console.error("Failed to update service:", e);
    }
  };

  const handleDelete = async () => {
    if (deleteName !== service?.name) return;
    try {
      await deleteService.mutateAsync(serviceId);
      router.push("/app/dashboard/services");
    } catch (e) {
      console.error("Failed to delete service:", e);
    }
  };

  if (serviceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your service configuration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Update your service name and environment</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., payments-api"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="env">Environment</Label>
            <Select value={env} onValueChange={setEnv}>
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

          <Button onClick={handleSave} disabled={isLoading || !name}>
            {updateService.isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete this service and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="size-4 mr-2" />
              Delete Service
            </Button>
          ) : (
            <div className="grid gap-4">
              <p className="text-sm text-destructive">
                Type <strong>{service?.name}</strong> to confirm deletion
              </p>
              <Input
                value={deleteName}
                onChange={(e) => setDeleteName(e.target.value)}
                placeholder="Type service name to confirm"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteName !== service?.name || deleteService.isPending}
                >
                  {deleteService.isPending && (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  )}
                  Delete Service
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
