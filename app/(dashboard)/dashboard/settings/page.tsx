"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings,
  Key,
  Bell,
  Users,
  Shield,
  GitBranch,
  Zap,
  Save,
  Plus,
  Trash2,
  Copy,
  Check
} from "lucide-react";

export default function SettingsPage() {
  const [autoRollbackEnabled, setAutoRollbackEnabled] = useState(true);
  const [rollbackThreshold, setRollbackThreshold] = useState(80);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [incidentAlerts, setIncidentAlerts] = useState(true);
  const [rcaAlerts, setRcaAlerts] = useState(true);
  const [rollbackAlerts, setRollbackAlerts] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyApiKey = (key: string) => {
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your organization and service settings</p>
      </div>

      <Tabs defaultValue="service" className="space-y-6">
        <TabsList>
          <TabsTrigger value="service">Service Config</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        {/* Service Configuration */}
        <TabsContent value="service" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Auto-Rollback Configuration
              </CardTitle>
              <CardDescription>
                Configure automatic rollback when incidents reach critical threshold
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable Auto-Rollback */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Auto-Rollback</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically rollback to stable commit when confidence score exceeds threshold
                  </p>
                </div>
                <Switch 
                  checked={autoRollbackEnabled} 
                  onCheckedChange={setAutoRollbackEnabled}
                />
              </div>

              <Separator />

              {/* Threshold */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Confidence Threshold</Label>
                  <span className="text-sm font-medium">{rollbackThreshold}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <Input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={rollbackThreshold}
                    onChange={(e) => setRollbackThreshold(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={rollbackThreshold}
                    onChange={(e) => setRollbackThreshold(parseInt(e.target.value))}
                    className="w-16 text-center"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Rollback will trigger when AI confidence score is {rollbackThreshold}% or higher
                </p>
              </div>

              <Separator />

              {/* GitHub Integration */}
              <div className="space-y-4">
                <div>
                  <Label>GitHub Repository</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">acme/payment-service</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      Change
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  The workflow will merge stable commit to main branch on rollback
                </p>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              {/* Alert Types */}
              <div className="space-y-4">
                <Label>Alert Types</Label>
                
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <p className="text-sm">Incident Alerts</p>
                    <p className="text-xs text-muted-foreground">New incidents and severity changes</p>
                  </div>
                  <Switch 
                    checked={incidentAlerts} 
                    onCheckedChange={setIncidentAlerts}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <p className="text-sm">RCA Reports</p>
                    <p className="text-xs text-muted-foreground">When AI analysis is complete</p>
                  </div>
                  <Switch 
                    checked={rcaAlerts} 
                    onCheckedChange={setRcaAlerts}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <p className="text-sm">Rollback Alerts</p>
                    <p className="text-xs text-muted-foreground">Auto-rollback triggered or completed</p>
                  </div>
                  <Switch 
                    checked={rollbackAlerts} 
                    onCheckedChange={setRollbackAlerts}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage who has access to your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "John Doe", email: "john@acme.com", role: "Owner" },
                  { name: "Jane Smith", email: "jane@acme.com", role: "Admin" },
                  { name: "Bob Wilson", email: "bob@acme.com", role: "Member" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{member.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <Plus className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage API keys for your services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {[
                  { name: "Production Key", key: "xc_live_k4j8s9d7f6h5g4j3", env: "production" },
                  { name: "Staging Key", key: "xc_test_h3g2f1d9s8k7j6h5", env: "staging" },
                ].map((apiKey, i) => (
                <div key={i} className="p-4 rounded-md border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{apiKey.name}</p>
                      <Badge variant="outline" className="mt-1">{apiKey.env}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => copyApiKey(apiKey.key)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded block">
                    {apiKey.key}
                  </code>
                </div>
              ))}
              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Generate New Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}