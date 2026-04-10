"use client";

import { useEffect, useState } from "react";
import { Key, Loader2, Plus, Trash2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  expiresAt: string | null;
}

interface Service {
  id: string;
  name: string;
}

export default function APIKeysPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyExpiry, setNewKeyExpiry] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");

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
          if (data.data?.length > 0) {
            setSelectedService(data.data[0].id);
          }
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

  useEffect(() => {
    if (!selectedService) return;

    const fetchApiKeys = async () => {
      setLoadingKeys(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/services/${selectedService}/apikeys`,
          { credentials: "include" }
        );
        const data = await response.json();
        
        if (data.success) {
          setApiKeys(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load API keys");
      } finally {
        setLoadingKeys(false);
      }
    };

    fetchApiKeys();
  }, [selectedService]);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/services/${selectedService}/apikeys`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ 
            name: newKeyName,
            expiresAt: newKeyExpiry || undefined 
          }),
        }
      );
      const data = await response.json();
      
      if (data.success && data.data?.key) {
        setApiKeys([...apiKeys, data.data]);
        setShowCreateModal(false);
        setNewKeyName("");
        setNewKeyExpiry("");
      } else {
        setError(data.message || "Failed to create API key");
      }
    } catch (err) {
      setError("Failed to create API key");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/services/${selectedService}/apikeys/${keyId}`,
        { method: "DELETE", credentials: "include" }
      );
      setApiKeys(apiKeys.filter((k) => k.id !== keyId));
    } catch (err) {
      setError("Failed to delete API key");
    }
  };

  const copyToClipboard = (key: string) => {
    if (typeof window !== "undefined" && window.navigator?.clipboard) {
      window.navigator.clipboard.writeText(key);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = key;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground mt-1">
          Manage API keys for your services
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="w-64">
          <select
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={() => setShowCreateModal(true)} disabled={!selectedService}>
          <Plus className="mr-2 h-4 w-4" />
          Create Key
        </Button>
      </div>

      {loadingKeys ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No API keys for this service</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create an API key to start ingesting errors
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{key.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {key.key.slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {key.expiresAt && (
                      <Badge variant="secondary">
                        Expires: {new Date(key.expiresAt).toLocaleDateString()}
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => copyToClipboard(key.key)}
                    >
                      {copiedKey === key.key ? (
                        <span className="text-xs text-green-500">Copied!</span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
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
              <CardTitle>Create API Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Name</label>
                <Input
                  placeholder="Production Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date (optional)</label>
                <Input
                  type="date"
                  value={newKeyExpiry}
                  onChange={(e) => setNewKeyExpiry(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateKey} disabled={creating}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}