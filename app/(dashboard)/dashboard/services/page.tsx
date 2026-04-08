"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  GitBranch,
  GitBranchIcon,
  Trash2,
  Loader2,
  Link2,
  X
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  env: string;
  autoRollbackEnabled: boolean;
  repoMapping: { repoFull: string; branch: string } | null;
}

const envColors: Record<string, string> = {
  production: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  staging: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  development: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [envFilter, setEnvFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceEnv, setNewServiceEnv] = useState("production");
  const [creating, setCreating] = useState(false);
  const [linkingRepo, setLinkingRepo] = useState(false);
  const [error, setError] = useState("");

  const [repoUrl, setRepoUrl] = useState("");
  const [repoBranch, setRepoBranch] = useState("main");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/services`,
          { credentials: "include" }
        );
        const data = await response.json();
        
        if (data.success) {
          setServices(data.data || []);
        } else {
          setError(data.message || "Failed to load services");
        }
      } catch (err) {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleCreateService = async () => {
    if (!newServiceName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/services`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: newServiceName, env: newServiceEnv }),
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setServices([...services, data.data]);
        setShowCreateModal(false);
        setNewServiceName("");
        setNewServiceEnv("production");
      } else {
        setError(data.message || "Failed to create service");
      }
    } catch (err) {
      setError("Failed to create service");
    } finally {
      setCreating(false);
    }
  };

  const handleLinkRepo = async () => {
    if (!selectedService || !repoUrl.trim()) return;

    setLinkingRepo(true);
    try {
      const repoFull = repoUrl.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/services/${selectedService.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            repoMapping: {
              repoFull,
              branch: repoBranch,
            },
          }),
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setServices(services.map(s => 
          s.id === selectedService.id ? { ...s, repoMapping: { repoFull, branch: repoBranch } } : s
        ));
        setShowRepoModal(false);
        setSelectedService(null);
        setRepoUrl("");
        setRepoBranch("main");
      } else {
        setError(data.message || "Failed to link repository");
      }
    } catch (err) {
      setError("Failed to link repository");
    } finally {
      setLinkingRepo(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/services/${serviceId}`,
        { method: "DELETE", credentials: "include" }
      );
      setServices(services.filter((s) => s.id !== serviceId));
    } catch (err) {
      setError("Failed to delete service");
    }
  };

  const openRepoModal = (service: Service) => {
    setSelectedService(service);
    setRepoUrl(service.repoMapping?.repoFull ? `https://github.com/${service.repoMapping.repoFull}` : "");
    setRepoBranch(service.repoMapping?.branch || "main");
    setShowRepoModal(true);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv = envFilter === "all" || service.env === envFilter;
    return matchesSearch && matchesEnv;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your monitored services</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={envFilter} onValueChange={setEnvFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environments</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No services found</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              Add a new service to start monitoring errors
            </p>
            <Button className="mt-4 gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Activity className="h-3 w-3" />
                    {service.env}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Healthy</span>
                  </div>
                  <Badge className={envColors[service.env] || envColors.production}>
                    {service.env}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Auto Rollback</p>
                    <p className="font-medium">
                      {service.autoRollbackEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Repository</p>
                    {service.repoMapping ? (
                      <div className="flex items-center gap-1 mt-1">
                        <GitBranchIcon className="h-3 w-3 text-green-500" />
                        <span className="text-xs truncate text-green-600 font-medium">
                          Connected
                        </span>
                      </div>
                    ) : (
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-xs text-muted-foreground"
                        onClick={() => openRepoModal(service)}
                      >
                        <Link2 className="h-3 w-3 mr-1" />
                        Link repo
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={() => openRepoModal(service)}
                  >
                    <GitBranch className="h-3 w-3" />
                    {service.repoMapping ? "Update Repo" : "Link Repo"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Service</CardTitle>
              <CardDescription>
                Add a new service to monitor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Name</label>
                <Input
                  placeholder="My Service"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Environment</label>
                <Select value={newServiceEnv} onValueChange={setNewServiceEnv}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateService} disabled={creating}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showRepoModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Link Git Repository</CardTitle>
              <CardDescription>
                Connect a GitHub repository for rollback functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Repository URL</label>
                <Input
                  placeholder="https://github.com/owner/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full GitHub repository URL
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Input
                  placeholder="main"
                  value={repoBranch}
                  onChange={(e) => setRepoBranch(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowRepoModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLinkRepo} disabled={linkingRepo || !repoUrl.trim()}>
                  {linkingRepo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Link Repository
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}