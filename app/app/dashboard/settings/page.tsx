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
  Copy,
  Eye,
  EyeOff,
  Key,
  Plus,
  Trash2,
} from "lucide-react";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
};

const apiKeys: ApiKey[] = [
  { id: "1", name: "Production Key", key: "sk_live_xxxx", created: "Jan 15, 2025", lastUsed: "2 min ago" },
  { id: "2", name: "Staging Key", key: "sk_test_xxxx", created: "Feb 1, 2025", lastUsed: "3 hrs ago" },
  { id: "3", name: "Development Key", key: "sk_dev_xxxx", created: "Mar 10, 2025", lastUsed: "1 day ago" },
];

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("Acme Inc.");
  const [orgSlug, setOrgSlug] = useState("acme");
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your organization settings and API keys
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
          <CardDescription>Organization name and basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-slug">Slug</Label>
              <Input
                id="org-slug"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-size">Team Size</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-48 justify-start">
                  1-10 members
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["1-10", "11-50", "51-200", "200+"].map((size) => (
                  <DropdownMenuItem key={size} className="cursor-pointer">
                    {size} members
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">API Keys</CardTitle>
              <CardDescription>Manage your API keys for service integration</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="size-3.5 mr-1.5" />
              Create Key
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Key className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{apiKey.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {visibleKeys[apiKey.id] ? apiKey.key : "sk_••••••••••••"}
                  </code>
                  <span className="text-xs text-muted-foreground">
                    Created {apiKey.created}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Last used {apiKey.lastUsed}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                >
                  {visibleKeys[apiKey.id] ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => navigator.clipboard.writeText(apiKey.key)}
                >
                  <Copy className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
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
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
