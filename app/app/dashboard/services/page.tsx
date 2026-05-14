"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Boxes, Clock, Plus, Settings2, Loader2, ChevronRight, Github, GitBranch, ArrowRight, Check } from "lucide-react";
import { useServices, useCreateService, useDeleteService, useGitHubStatus, useGitHubRepos } from "@/lib/hooks";
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

type Step = 'repo' | 'details';

export default function ServicesPage() {
  const router = useRouter();
  const { data: services = [], isLoading, error } = useServices();
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const { data: gitHubStatus } = useGitHubStatus();
  const { data: gitHubRepos = [], isLoading: reposLoading } = useGitHubRepos();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [step, setStep] = useState<Step>('repo');
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [newService, setNewService] = useState<CreateServiceInput>({
    name: "",
    env: "DEVELOPMENT",
  });

  const isGitHubConnected = gitHubStatus?.connected || false;

  const resetWizard = () => {
    setStep('repo');
    setSelectedRepo("");
    setSelectedBranch("main");
    setNewService({ name: "", env: "DEVELOPMENT" });
  };

  const handleContinueToDetails = () => {
    if (!selectedRepo) return;
    setStep('details');
  };

  const handleCreate = async () => {
    try {
      const result = await createService.mutateAsync(newService);
      setIsCreateOpen(false);
      resetWizard();
    } catch (e) {
      console.error("Failed to create service:", e);
    }
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService.mutateAsync(serviceId);
    } catch (e) {
      console.error("Failed to delete service:", e);
    }
  };

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
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetWizard(); }}>
          <DialogTrigger asChild>
            <Button className="bg-sky-500 hover:bg-sky-600">
              <Plus className="size-4 mr-2" />
              Connect Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Connect New Service</DialogTitle>
              <DialogDescription>
                {step === 'repo' ? 'Select a GitHub repository to connect' : 'Configure your service details'}
              </DialogDescription>
            </DialogHeader>

            {step === 'repo' ? (
              <div className="space-y-4">
                {!isGitHubConnected ? (
                  <div className="text-center py-8">
                    <Github className="size-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Connect your GitHub account first</p>
                    <Button asChild variant="outline">
                      <Link href="/dashboard/settings">Go to Settings</Link>
                    </Button>
                  </div>
                ) : reposLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="size-8 animate-spin mx-auto mb-4 text-sky-500" />
                    <p className="text-muted-foreground">Loading repositories...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Select Repository</Label>
                    <div className="max-h-64 overflow-y-auto border rounded-md">
                      {gitHubRepos.map((repo) => (
                        <div
                          key={repo.id}
                          onClick={() => setSelectedRepo(repo.fullName)}
                          className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 border-b last:border-b-0 ${
                            selectedRepo === repo.fullName ? 'bg-sky-50 border-sky-500' : ''
                          }`}
                        >
                          <Github className="size-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium">{repo.name}</div>
                            <div className="text-xs text-muted-foreground">{repo.fullName}</div>
                          </div>
                          {repo.private && <Badge variant="secondary" className="text-xs">Private</Badge>}
                          {selectedRepo === repo.fullName && <Check className="size-4 text-sky-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedRepo && (
                  <div className="flex justify-end">
                    <Button onClick={handleContinueToDetails} className="bg-sky-500 hover:bg-sky-600">
                      Continue <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                  <Github className="size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{selectedRepo}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep('repo')}>
                    Change
                  </Button>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., payments-api"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll use the repository name as default
                  </p>
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

                <DialogFooter>
                  <Button variant="outline" onClick={() => setStep('repo')}>
                    Back
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!newService.name || createService.isPending}
                    className="bg-sky-500 hover:bg-sky-600"
                  >
                    {createService.isPending && (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    )}
                    Create Service
                  </Button>
                </DialogFooter>
              </div>
            )}
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
              <Button onClick={() => setIsCreateOpen(true)} className="bg-sky-500 hover:bg-sky-600">
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
                  const status = service.status || "healthy";
                  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.healthy;
                  const env = envConfig[service.env] || envConfig.DEVELOPMENT;

                  return (
                    <TableRow key={service.id} className="cursor-pointer" onClick={() => router.push(`/dashboard/services/${service.id}`)}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <Badge variant={env.variant}>{env.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                          {config.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {service.updatedAt ? new Date(service.updatedAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/services/${service.id}/settings`); }}>
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