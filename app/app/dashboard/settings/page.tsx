"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Github,
  Loader2,
  Check,
  Save,
} from "lucide-react";
import { useCurrentOrg, useUpdateOrg, useGitHubStatus, useConnectGitHub, useDisconnectGitHub } from "@/lib/hooks";

const TEAM_SIZES = ["1-10", "11-50", "51-200", "200+"];

export default function SettingsPage() {
  const { data: currentOrg, isLoading: orgLoading } = useCurrentOrg();
  const updateOrg = useUpdateOrg();

  const [draftOrg, setDraftOrg] = useState<{
    name?: string;
    slug?: string;
    teamSize?: string;
  }>({});

  const orgName = draftOrg.name ?? currentOrg?.name ?? "";
  const orgSlug = draftOrg.slug ?? currentOrg?.slug ?? "";
  const teamSize = draftOrg.teamSize ?? currentOrg?.teamSize ?? "1-10";

  const handleSave = async () => {
    if (!currentOrg?.id) return;
    try {
      await updateOrg.mutateAsync({ id: currentOrg.id, name: orgName, slug: orgSlug });
      setDraftOrg({});
    } catch (e) {
      console.error("Failed to update org:", e);
    }
  };

  const hasChanges =
    orgName !== (currentOrg?.name ?? "") ||
    orgSlug !== (currentOrg?.slug ?? "");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-pretty text-muted-foreground text-sm mt-1">
          Manage your organization settings and integrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
          <CardDescription>Organization name and basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orgLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={orgName}
                    onChange={(e) => setDraftOrg((current) => ({ ...current, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-slug">Slug</Label>
                  <Input
                    id="org-slug"
                    value={orgSlug}
                    onChange={(e) => setDraftOrg((current) => ({ ...current, slug: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-size">Team Size</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button id="team-size" variant="outline" className="w-48 justify-start">
                      {teamSize} members
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {TEAM_SIZES.map((size) => (
                      <DropdownMenuItem
                        key={size}
                        onClick={() => setDraftOrg((current) => ({ ...current, teamSize: size }))}
                        className="cursor-pointer"
                      >
                        {size} members
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={!hasChanges || updateOrg.isPending}>
                  {updateOrg.isPending ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Email notifications", desc: "Receive email alerts for new failures" },
            { label: "Slack integration", desc: "Send alerts to your Slack channel" },
            { label: "Auto-resolve low severity", desc: "Automatically resolve low severity cases after 24h" },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <Button variant="outline" size="sm" disabled>Coming soon</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">GitHub Integration</CardTitle>
          <CardDescription>Connect your GitHub repositories to enable service creation</CardDescription>
        </CardHeader>
        <CardContent>
          <GitHubConnection />
        </CardContent>
      </Card>
    </div>
  );
}

function GitHubConnection() {
  const { data: gitHubStatus, isLoading } = useGitHubStatus();
  const connectGitHub = useConnectGitHub();
  const disconnectGitHub = useDisconnectGitHub();

  const isConnected = gitHubStatus?.connected || false;

  const handleConnect = async () => {
    try {
      const result = await connectGitHub.mutateAsync(undefined);
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Failed to connect GitHub:", error);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your GitHub account?")) return;
    try {
      await disconnectGitHub.mutateAsync();
    } catch (error) {
      console.error("Failed to disconnect GitHub:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-success/30 bg-success/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/20">
            <Check className="size-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium">Connected to GitHub</p>
            <p className="text-xs text-muted-foreground">
              {gitHubStatus?.org ? `Organization: ${gitHubStatus.org}` : "Successfully connected"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          disabled={disconnectGitHub.isPending}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          {disconnectGitHub.isPending ? <Loader2 className="size-4 animate-spin" /> : "Disconnect"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
          <Github className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Connect GitHub</p>
          <p className="text-pretty text-xs text-muted-foreground">Authorize access to your repositories</p>
        </div>
      </div>
      <Button
        onClick={handleConnect}
        disabled={connectGitHub.isPending}
        className="bg-primary hover:bg-primary/90"
      >
        {connectGitHub.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Github className="size-4 mr-2" />}
        Connect
      </Button>
    </div>
  );
}
