"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationSettings {
  emailAlerts: boolean;
  slackAlerts: boolean;
  autoRollbackAlerts: boolean;
  incidentCreated: boolean;
  incidentResolved: boolean;
  rcaGenerated: boolean;
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailAlerts: true,
    slackAlerts: false,
    autoRollbackAlerts: true,
    incidentCreated: true,
    incidentResolved: true,
    rcaGenerated: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Configure how you receive notifications
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notification Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailAlerts">Email Alerts</Label>
              <Switch
                id="emailAlerts"
                checked={settings.emailAlerts}
                onCheckedChange={() => handleToggle("emailAlerts")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="slackAlerts">Slack Alerts</Label>
              <Switch
                id="slackAlerts"
                checked={settings.slackAlerts}
                onCheckedChange={() => handleToggle("slackAlerts")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoRollbackAlerts">Auto-Rollback Alerts</Label>
              <Switch
                id="autoRollbackAlerts"
                checked={settings.autoRollbackAlerts}
                onCheckedChange={() => handleToggle("autoRollbackAlerts")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="incidentCreated">Incident Created</Label>
              <Switch
                id="incidentCreated"
                checked={settings.incidentCreated}
                onCheckedChange={() => handleToggle("incidentCreated")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="incidentResolved">Incident Resolved</Label>
              <Switch
                id="incidentResolved"
                checked={settings.incidentResolved}
                onCheckedChange={() => handleToggle("incidentResolved")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rcaGenerated">RCA Report Generated</Label>
              <Switch
                id="rcaGenerated"
                checked={settings.rcaGenerated}
                onCheckedChange={() => handleToggle("rcaGenerated")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}