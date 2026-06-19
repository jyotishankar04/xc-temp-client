"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  useApiKeys,
  useApiUsage,
  useCreateApiKey,
  useDeleteApiKey,
} from "@/lib/hooks";
import { Loader2, Plus, Trash2, Copy, Key, Check, Activity } from "lucide-react";

export default function ServiceApiKeysPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;

  const { data: apiKeys = [], isLoading } = useApiKeys(serviceId);
  const { data: apiUsage } = useApiUsage(serviceId);
  const createApiKey = useCreateApiKey();
  const deleteApiKey = useDeleteApiKey();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; keyId: string | null }>({
    open: false,
    keyId: null,
  });
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      const result = await createApiKey.mutateAsync({ serviceId, data: { name: newKeyName } });
      setNewlyCreatedKey(result?.key || null);
      setNewKeyName("");
    } catch (e) {
      console.error("Failed to create API key:", e);
    }
  };

  const handleCopy = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteConfirm.keyId) return;
    try {
      await deleteApiKey.mutateAsync({ serviceId, apiKeyId: deleteConfirm.keyId });
      setDeleteConfirm({ open: false, keyId: null });
    } catch (e) {
      console.error("Failed to delete API key:", e);
    }
  };

  const openDeleteConfirm = (keyId: string) => {
    setDeleteConfirm({ open: true, keyId });
  };

  const closeCreateDialog = () => {
    setIsCreateOpen(false);
    setNewlyCreatedKey(null);
    setNewKeyName("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-pretty text-muted-foreground text-sm mt-1">
            Manage API keys for programmatic access
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for programmatic access to this service.
              </DialogDescription>
            </DialogHeader>
            {newlyCreatedKey ? (
              <div className="grid gap-4 py-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Your new API key:</p>
                  <code className="text-sm font-mono break-all">{newlyCreatedKey}</code>
                </div>
                <p className="text-pretty text-sm text-severity-medium">
                  Make sure to copy your API key now. You won&apos;t be able to see it again!
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(newlyCreatedKey)}
                  >
                    {copiedKey ? "Copied!" : <Copy className="size-4 mr-2" />}
                    Copy
                  </Button>
                  <Button onClick={closeCreateDialog}>Done</Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!newKeyName || createApiKey.isPending}
                  >
                    {createApiKey.isPending && (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    )}
                    Create Key
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total requests</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">
                {apiUsage?.totalRequests ?? 0}
              </p>
            </div>
            <Activity className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">API keys</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">
                {apiKeys.length}
              </p>
            </div>
            <Key className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Last request</p>
            <p className="mt-1 text-sm font-medium">
              {apiUsage?.lastSeenAt
                ? new Date(apiUsage.lastSeenAt).toLocaleString()
                : "No traffic yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {apiKeys?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Key className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-balance text-lg font-semibold mb-2">No API keys yet</h3>
              <p className="text-pretty text-muted-foreground text-sm mb-4">
                Create your first API key to start using programmatic access.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="size-4 mr-2" />
                Create API Key
              </Button>
            </div>
          ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Last seen</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {apiKeys?.map((apiKey) => {
                  const usage = apiUsage?.keys.find((item) => item.id === apiKey.id);
                  return (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {apiKey.prefix || "••••••••••••••••"}
                      </code>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {usage?.totalRequests ?? 0}
                      <span className="ml-2 text-xs text-muted-foreground">
                        requests
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {usage?.lastSeenAt
                        ? new Date(usage.lastSeenAt).toLocaleString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      {apiKey.createdAt
                        ? new Date(apiKey.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {apiKey.key && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(apiKey.key!)}
                            aria-label="Copy API key"
                          >
                            {copiedKey === apiKey.key ? (
                              <span className="text-xs text-success">Copied</span>
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => openDeleteConfirm(apiKey.id)}
                          disabled={deleteApiKey.isPending}
                          aria-label="Delete API key"
                        >
                          <Trash2 className="size-4" />
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

      {apiUsage && apiUsage.recentRequests.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Recent usage</h3>
                <p className="text-sm text-muted-foreground">
                  Requests across this service for the last 7 days
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-7">
              {apiUsage.recentRequests.map((point) => (
                <div key={point.date} className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">{point.date}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">{point.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={handleDelete}
        title="Delete API Key"
        description="Are you sure you want to delete this API key? This action cannot be undone and any applications using this key will stop working."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
