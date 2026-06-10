"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUser, useUpdateProfile, useUserSettings, useUpdateSettings } from "@/lib/hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Save,
  User,
  Mail,
  Calendar,
  AtSign,
} from "lucide-react";

function getInitials(name?: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const THEME_OPTIONS = ["system", "light", "dark"] as const;
const LANGUAGE_OPTIONS = ["en", "es", "fr", "de", "pt", "ja"] as const;
const TIMEZONE_OPTIONS = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Australia/Sydney",
] as const;

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useUser();
  const { data: userSettings, isLoading: settingsLoading } = useUserSettings();
  const updateProfile = useUpdateProfile();
  const updateSettings = useUpdateSettings();

  const user = userProfile ?? authUser;

  const [draftName, setDraftName] = useState("");
  const [draftAvatarUrl, setDraftAvatarUrl] = useState("");
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  useEffect(() => {
    if (user) {
      setDraftName(user.name ?? "");
      setDraftAvatarUrl(user.avatarUrl ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (userSettings) {
      setTheme(userSettings.theme ?? "system");
      setLanguage(userSettings.language ?? "en");
      setTimezone(userSettings.timezone ?? "UTC");
      setEmailNotifications(userSettings.emailNotifications ?? true);
      setPushNotifications(userSettings.pushNotifications ?? true);
    }
  }, [userSettings]);

  const hasProfileChanges =
    draftName !== (user?.name ?? "") ||
    draftAvatarUrl !== (user?.avatarUrl ?? "");

  const hasSettingsChanges =
    theme !== (userSettings?.theme ?? "system") ||
    language !== (userSettings?.language ?? "en") ||
    timezone !== (userSettings?.timezone ?? "UTC") ||
    emailNotifications !== (userSettings?.emailNotifications ?? true) ||
    pushNotifications !== (userSettings?.pushNotifications ?? true);

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        name: draftName || undefined,
        avatarUrl: draftAvatarUrl || undefined,
      });
    } catch (e) {
      console.error("Failed to update profile:", e);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync({
        theme,
        language,
        timezone,
        emailNotifications,
        pushNotifications,
      });
    } catch (e) {
      console.error("Failed to update settings:", e);
    }
  };

  const isLoading = profileLoading || settingsLoading;
  const displayName = user?.name ?? user?.username ?? "User";
  const initials = getInitials(user?.name);

  const avatarFromAuth = user && "avatar" in user ? (user as { avatar?: string }).avatar : undefined;
  const avatarSrc = user?.avatarUrl ?? avatarFromAuth;

  const fallbackInitial =
    user?.email?.[0]?.toUpperCase() ||
    user?.name?.[0]?.toUpperCase() ||
    "U";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-balance text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-pretty text-muted-foreground text-sm mt-1">
          Manage your personal information and preferences
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Avatar className="size-20 shrink-0">
              <AvatarImage
                src={avatarSrc}
                alt={displayName}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {initials || fallbackInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
              <h2 className="text-balance text-xl font-semibold">{displayName}</h2>
              <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {user?.email ?? "No email"}
                </span>
                {user?.username && (
                  <span className="inline-flex items-center gap-1.5">
                    <AtSign className="size-3.5" />
                    {user.username}
                  </span>
                )}
                {"createdAt" in (user ?? {}) && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    Member since{" "}
                    {new Date(
                      (user as { createdAt: string }).createdAt
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Profile</CardTitle>
          <CardDescription>
            Update your display name and avatar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Display Name</Label>
            <Input
              id="profile-name"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-avatar">Avatar URL</Label>
            <Input
              id="profile-avatar"
              value={draftAvatarUrl}
              onChange={(e) => setDraftAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={!hasProfileChanges || updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
          <CardDescription>
            Customize your experience across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="theme-select">Theme</Label>
              <Select
                value={theme}
                onValueChange={(v) => setTheme(v)}
              >
                <SelectTrigger id="theme-select" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {THEME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t} className="cursor-pointer">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language-select">Language</Label>
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v)}
              >
                <SelectTrigger id="language-select" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((l) => (
                    <SelectItem key={l} value={l} className="cursor-pointer">
                      {new Intl.DisplayNames([l], { type: "language" }).of(l) ??
                        l.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone-select">Timezone</Label>
              <Select
                value={timezone}
                onValueChange={(v) => setTimezone(v)}
              >
                <SelectTrigger id="timezone-select" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <SelectItem key={tz} value={tz} className="cursor-pointer">
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Email notifications</p>
                <p className="text-pretty text-xs text-muted-foreground">
                  Receive alerts and updates via email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                aria-label="Email notifications"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Push notifications</p>
                <p className="text-pretty text-xs text-muted-foreground">
                  Receive real-time alerts in your browser
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                aria-label="Push notifications"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={!hasSettingsChanges || updateSettings.isPending}
            >
              {updateSettings.isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
