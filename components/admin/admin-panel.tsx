"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ActivityIcon,
  PlusIcon,
  Trash2Icon,
  Building2Icon,
  FlagIcon,
  LockKeyholeIcon,
  CalendarIcon,
  LogOutIcon,
  MailIcon,
  MegaphoneIcon,
  MenuIcon,
  RocketIcon,
  SendIcon,
  ShieldIcon,
  SlidersHorizontalIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { adminApi, authApi, type EmailSubscriber, type MasterAdminRole, type PlatformSettings } from "@/lib/api";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview", icon: ShieldIcon },
  { id: "platform-settings", label: "Platform Settings", icon: SlidersHorizontalIcon },
  { id: "feature-flags", label: "Feature Flags", icon: FlagIcon },
  { id: "marketing-controls", label: "Marketing Controls", icon: MegaphoneIcon },
  { id: "maintenance", label: "Maintenance Mode", icon: SlidersHorizontalIcon },
  { id: "signup", label: "Signup Controls", icon: UsersIcon },
  { id: "pricing", label: "Pricing Controls", icon: SlidersHorizontalIcon },
  { id: "beta", label: "Beta Mode", icon: FlagIcon },
  { id: "announcements", label: "Announcements", icon: MegaphoneIcon },
  { id: "email-broadcasts", label: "Email Broadcasts", icon: MailIcon },
  { id: "launches", label: "Launches", icon: RocketIcon },
  { id: "organizations", label: "Organizations", icon: Building2Icon },
  { id: "users", label: "Users", icon: UsersIcon },
  { id: "members", label: "Master Admin Members", icon: UserCogIcon },
  { id: "activity-logs", label: "Activity Logs", icon: ActivityIcon },
];

export function AdminPanel({ section }: { section: string }) {
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const activeSection = sections.some((item) => item.id === section) ? section : "overview";
  const logoutMutation = useMutation({
    mutationFn: authApi.logoutAdmin,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["admin"] });
      window.location.assign("/admin/login");
    },
  });

  const meQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: adminApi.me,
    retry: false,
  });

  if (meQuery.isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Checking Master Admin access...</div>;
  }

  if (meQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Master Admin access required</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Your account is authenticated, but it is not authorized for the Master Admin Panel.
            </p>
            <Button asChild variant="outline">
              <Link href="/app/dashboard">Return to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-72 border-r bg-card p-4 transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">XecureCode</p>
            <h1 className="text-xl font-semibold">Master Admin</h1>
          </div>
          <Badge>{meQuery.data?.role}</Badge>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {sections.map((item) => (
            <Button
              key={item.id}
              asChild
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setSidebarOpen(false)}
            >
              <Link href={item.id === "overview" ? "/admin" : `/admin/${item.id}`}>
                <item.icon data-icon="inline-start" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <MenuIcon />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground">Signed in as {meQuery.data?.email}</p>
            <h2 className="text-lg font-semibold">{sections.find((item) => item.id === activeSection)?.label}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/app/dashboard">Product dashboard</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              aria-label="Sign out of admin"
            >
              <LogOutIcon />
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          <AdminSection
            section={activeSection}
            role={meQuery.data!.role}
            refresh={() => queryClient.invalidateQueries({ queryKey: ["admin"] })}
          />
        </div>
      </main>
    </div>
  );
}

function AdminSection({
  section,
  role,
  refresh,
}: {
  section: string;
  role: MasterAdminRole;
  refresh: () => void;
}) {
  if (section === "platform-settings") return <PlatformSettingsSection />;
  if (section === "feature-flags") return <JsonSection title="Feature Flags" apiSection="feature-flags" field="featureFlags" />;
  if (section === "marketing-controls") return <JsonSection title="Marketing Controls" apiSection="marketing-controls" field="marketingControls" />;
  if (section === "maintenance") return <SingleToggleSection title="Maintenance Mode" field="maintenanceMode" apiSection="maintenance" />;
  if (section === "signup") return <SingleToggleSection title="Signup Controls" field="signupEnabled" apiSection="signup" />;
  if (section === "pricing") return <SingleToggleSection title="Pricing Controls" field="pricingVisible" apiSection="pricing" />;
  if (section === "beta") return <SingleToggleSection title="Beta Mode" field="betaMode" apiSection="beta" />;
  if (section === "announcements") return <AnnouncementsSection />;
  if (section === "email-broadcasts") return <EmailBroadcastsSection />;
  if (section === "launches") return <LaunchesSection />;
  if (section === "organizations") return <OrganizationsSection />;
  if (section === "users") return <UsersSection />;
  if (section === "members") return <MembersSection role={role} refresh={refresh} />;
  if (section === "activity-logs") return <ActivityLogsSection />;
  return <OverviewSection />;
}

function OverviewSection() {
  const settingsQuery = useQuery({ queryKey: ["admin", "settings"], queryFn: adminApi.getSettings });
  const orgsQuery = useQuery({ queryKey: ["admin", "organizations"], queryFn: () => adminApi.listOrganizations() });
  const usersQuery = useQuery({ queryKey: ["admin", "users"], queryFn: () => adminApi.listUsers() });
  const logsQuery = useQuery({ queryKey: ["admin", "logs"], queryFn: () => adminApi.listActivityLogs() });

  const metrics = [
    { label: "Organizations", value: orgsQuery.data?.pagination.total ?? 0 },
    { label: "Users", value: usersQuery.data?.pagination.total ?? 0 },
    { label: "Admin actions", value: logsQuery.data?.pagination.total ?? 0 },
    { label: "Signup", value: settingsQuery.data?.signupEnabled ? "Open" : "Closed" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{metric.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PlatformSettingsSection() {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({ queryKey: ["admin", "settings"], queryFn: adminApi.getSettings });
  const mutation = useMutation({
    mutationFn: (data: Partial<PlatformSettings>) => adminApi.updateSettings(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });

  const settings = settingsQuery.data;
  if (!settings) return <LoadingState />;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ToggleCard title="Maintenance Mode" checked={settings.maintenanceMode} onChange={(maintenanceMode) => mutation.mutate({ maintenanceMode })} />
      <ToggleCard title="Beta Mode" checked={settings.betaMode} onChange={(betaMode) => mutation.mutate({ betaMode })} />
      <ToggleCard title="Signup Controls" checked={settings.signupEnabled} onChange={(signupEnabled) => mutation.mutate({ signupEnabled })} />
      <ToggleCard title="Pricing Visibility" checked={settings.pricingVisible} onChange={(pricingVisible) => mutation.mutate({ pricingVisible })} />
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Maintenance Message</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea
            defaultValue={settings.maintenanceMessage ?? ""}
            onBlur={(event) => mutation.mutate({ maintenanceMessage: event.currentTarget.value || null })}
          />
          <p className="text-xs text-muted-foreground">Changes save when the field loses focus.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleCard({ title, checked, onChange }: { title: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{checked ? "Enabled" : "Disabled"}</span>
        <Switch checked={checked} onCheckedChange={onChange} />
      </CardContent>
    </Card>
  );
}

function SingleToggleSection({
  title,
  field,
  apiSection,
}: {
  title: string;
  field: "maintenanceMode" | "signupEnabled" | "pricingVisible" | "betaMode";
  apiSection: string;
}) {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({ queryKey: ["admin", "settings"], queryFn: adminApi.getSettings });
  const mutation = useMutation({
    mutationFn: (checked: boolean) => adminApi.updateSection(apiSection, { [field]: checked }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });

  if (!settingsQuery.data) return <LoadingState />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{settingsQuery.data[field] ? "Enabled" : "Disabled"}</p>
          <p className="text-sm text-muted-foreground">This setting is stored in the backend and audited on update.</p>
        </div>
        <Switch checked={settingsQuery.data[field]} onCheckedChange={(checked) => mutation.mutate(checked)} />
      </CardContent>
    </Card>
  );
}

function JsonSection({ title, apiSection, field }: { title: string; apiSection: string; field: "featureFlags" | "marketingControls" }) {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({ queryKey: ["admin", "settings"], queryFn: adminApi.getSettings });
  const [rows, setRows] = React.useState<Array<{ key: string; value: string; type: "text" | "boolean" }>>([]);
  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => adminApi.updateSection(apiSection, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });

  React.useEffect(() => {
    if (!settingsQuery.data) return;
    setRows(
      Object.entries(settingsQuery.data[field] ?? {}).map(([key, value]) => ({
        key,
        value: typeof value === "boolean" ? String(value) : String(value ?? ""),
        type: typeof value === "boolean" ? "boolean" : "text",
      })),
    );
  }, [field, settingsQuery.data]);

  const save = () => {
    const data = rows.reduce<Record<string, unknown>>((acc, row) => {
      const key = row.key.trim();
      if (!key) return acc;
      acc[key] = row.type === "boolean" ? row.value === "true" : row.value;
      return acc;
    }, {});
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Add simple keys and values. Boolean rows render as switches and text rows render as text values.
        </p>
        <div className="grid gap-2">
          {rows.map((row, index) => (
            <div key={index} className="grid gap-2 rounded-lg border bg-card p-3 md:grid-cols-[minmax(0,1fr)_160px_minmax(0,1fr)_auto]">
              <Input
                placeholder="settingKey"
                value={row.key}
                onChange={(event) =>
                  setRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, key: event.target.value } : item,
                    ),
                  )
                }
              />
              <select
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={row.type}
                onChange={(event) =>
                  setRows((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, type: event.target.value as "text" | "boolean", value: event.target.value === "boolean" ? "false" : "" }
                        : item,
                    ),
                  )
                }
              >
                <option value="text">Text</option>
                <option value="boolean">On / Off</option>
              </select>
              {row.type === "boolean" ? (
                <div className="flex h-9 items-center justify-between rounded-lg border px-3">
                  <span className="text-sm text-muted-foreground">{row.value === "true" ? "Enabled" : "Disabled"}</span>
                  <Switch
                    checked={row.value === "true"}
                    onCheckedChange={(checked) =>
                      setRows((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, value: String(checked) } : item,
                        ),
                      )
                    }
                  />
                </div>
              ) : (
                <Input
                  placeholder="Value"
                  value={row.value}
                  onChange={(event) =>
                    setRows((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, value: event.target.value } : item,
                      ),
                    )
                  }
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRows((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                aria-label="Remove setting"
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setRows((current) => [...current, { key: "", value: "", type: "text" }])}
          >
            <PlusIcon />
            Add setting
          </Button>
          <Button onClick={save} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AnnouncementsSection() {
  const queryClient = useQueryClient();
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const query = useQuery({ queryKey: ["admin", "announcements"], queryFn: () => adminApi.listAnnouncements() });
  const createMutation = useMutation({
    mutationFn: () => adminApi.createAnnouncement({ title, message, audience: "all", active: true }),
    onSuccess: () => {
      setTitle("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader><CardTitle>Create Announcement</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Textarea placeholder="Message" value={message} onChange={(event) => setMessage(event.target.value)} />
          <Button className="justify-self-start" onClick={() => createMutation.mutate()} disabled={!title || !message}>Publish</Button>
        </CardContent>
      </Card>
      <DataTable
        headers={["Title", "Audience", "Status", "Created"]}
        rows={(query.data?.items ?? []).map((item) => [
          item.title,
          item.audience,
          <Badge key={item.id} variant={item.active ? "default" : "secondary"}>{item.active ? "Active" : "Inactive"}</Badge>,
          formatDate(item.createdAt),
        ])}
      />
    </div>
  );
}

function EmailBroadcastsSection() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [audience, setAudience] = React.useState<"ALL" | "SELECTED">("ALL");
  const [subscriberSearch, setSubscriberSearch] = React.useState("");
  const [manualEmails, setManualEmails] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const subscribersQuery = useQuery({
    queryKey: ["admin", "subscribers", subscriberSearch],
    queryFn: () => adminApi.listSubscribers(subscriberSearch, "ACTIVE"),
  });
  const broadcastsQuery = useQuery({
    queryKey: ["admin", "email-broadcasts"],
    queryFn: () => adminApi.listEmailBroadcasts(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      adminApi.createEmailBroadcast({
        subject,
        bodyHtml: buildBroadcastHtml(message),
        audience,
        subscriberIds: audience === "SELECTED" ? selectedIds : [],
        emails:
          audience === "SELECTED"
            ? manualEmails
                .split(/[,\n]/)
                .map((email) => email.trim())
                .filter(Boolean)
            : [],
      }),
    onSuccess: () => {
      setSubject("");
      setMessage("");
      setManualEmails("");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "email-broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "subscribers"] });
    },
  });

  const subscribers = subscribersQuery.data?.items ?? [];
  const canSend =
    subject.trim() &&
    message.trim() &&
    (audience === "ALL" || selectedIds.length > 0 || manualEmails.trim());

  const toggleSelected = (subscriber: EmailSubscriber, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? Array.from(new Set([...current, subscriber.id]))
        : current.filter((id) => id !== subscriber.id),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Send Update Email</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={audience}
              onChange={(event) => setAudience(event.target.value as "ALL" | "SELECTED")}
            >
              <option value="ALL">All active subscribers</option>
              <option value="SELECTED">Selected subscribers</option>
            </select>
          </div>
          <Textarea
            placeholder="Write the update email. Line breaks become paragraphs."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-44"
          />

          {audience === "SELECTED" ? (
            <div className="grid gap-3 rounded-lg border p-3">
              <div className="grid gap-2 lg:grid-cols-2">
                <Input
                  placeholder="Search active subscribers"
                  value={subscriberSearch}
                  onChange={(event) => setSubscriberSearch(event.target.value)}
                />
                <Input
                  placeholder="Specific emails, comma separated"
                  value={manualEmails}
                  onChange={(event) => setManualEmails(event.target.value)}
                />
              </div>
              <div className="max-h-64 overflow-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Send</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Subscribed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.length > 0 ? subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(subscriber.id)}
                            onChange={(event) => toggleSelected(subscriber, event.currentTarget.checked)}
                            aria-label={`Select ${subscriber.email}`}
                          />
                        </TableCell>
                        <TableCell>{subscriber.email}</TableCell>
                        <TableCell>{subscriber.source ?? "-"}</TableCell>
                        <TableCell>{formatDate(subscriber.subscribedAt)}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                          No active subscribers found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {audience === "ALL"
                ? `${subscribersQuery.data?.pagination.total ?? 0} active subscribers will be queued.`
                : `${selectedIds.length} selected plus any valid typed emails will be queued.`}
            </p>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!canSend || createMutation.isPending}
            >
              <SendIcon />
              {createMutation.isPending ? "Queueing..." : "Queue broadcast"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <DataTable
        headers={["Subject", "Audience", "Status", "Sent", "Failed", "Created"]}
        rows={(broadcastsQuery.data?.items ?? []).map((broadcast) => [
          broadcast.subject,
          broadcast.audience,
          <Badge key={`${broadcast.id}-status`} variant={broadcast.status === "FAILED" ? "destructive" : "secondary"}>
            {broadcast.status}
          </Badge>,
          broadcast.sentCount,
          broadcast.failedCount,
          formatDate(broadcast.createdAt),
        ])}
      />
    </div>
  );
}

function LaunchesSection() {
  const queryClient = useQueryClient();
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [features, setFeatures] = React.useState<string[]>([""]);
  const [targetDate, setTargetDate] = React.useState<Date | undefined>(undefined);
  const [targetTime, setTargetTime] = React.useState("12:00");
  const [type, setType] = React.useState<"MAJOR" | "MINOR">("MINOR");

  const getTargetDateString = () => {
    if (!targetDate) return "";
    const [hours, minutes] = targetTime.split(":").map(Number);
    const combined = new Date(targetDate);
    combined.setHours(hours, minutes, 0, 0);
    return combined.toISOString();
  };

  const query = useQuery({ queryKey: ["admin", "launches"], queryFn: () => adminApi.listLaunches() });

  const createMutation = useMutation({
    mutationFn: () =>
      adminApi.createLaunch({
        title,
        subtitle: subtitle || null,
        features: features.filter((f) => f.trim() !== ""),
        targetDate: getTargetDateString(),
        type,
        active: true,
      }),
    onSuccess: () => {
      setTitle("");
      setSubtitle("");
      setFeatures([""]);
      setTargetDate(undefined);
      setTargetTime("12:00");
      setType("MINOR");
      queryClient.invalidateQueries({ queryKey: ["admin", "launches"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      adminApi.updateLaunch(id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "launches"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteLaunch(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "launches"] }),
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Launch</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Input placeholder="Subtitle (optional)" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} />

          <div className="grid gap-2">
            <p className="text-sm font-medium">Features</p>
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Feature bullet point"
                  value={feature}
                  onChange={(event) =>
                    setFeatures((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFeatures((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  disabled={features.length <= 1}
                  aria-label="Delete feature"
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setFeatures((current) => [...current, ""])}
              className="justify-self-start"
            >
              <PlusIcon />
              Add feature
            </Button>
          </div>

          <div className="grid gap-2">
            <p className="text-sm font-medium">Target Date & Time</p>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!targetDate}
                    className="w-[240px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    <CalendarIcon />
                    {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={setTargetDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                className="w-[120px]"
                value={targetTime}
                onChange={(event) => setTargetTime(event.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Launch Type</p>
              <p className="text-xs text-muted-foreground">
                Major locks the app. Minor shows a timer in the announcement bar.
              </p>
            </div>
            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={type}
              onChange={(event) => setType(event.target.value as "MAJOR" | "MINOR")}
            >
              <option value="MINOR">Minor (Banner)</option>
              <option value="MAJOR">Major (Lock)</option>
            </select>
          </div>

          <Button
            onClick={() => createMutation.mutate()}
            disabled={!title || !targetDate || !targetTime || createMutation.isPending}
            className="justify-self-start"
          >
            {createMutation.isPending ? "Creating..." : "Create Launch"}
          </Button>
        </CardContent>
      </Card>

      <DataTable
        headers={["Title", "Type", "Target", "Status", "Actions"]}
        rows={(query.data?.items ?? []).map((item) => [
          <div key={`${item.id}-title`}>
            <p className="font-medium">{item.title}</p>
            {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
          </div>,
          <Badge key={`${item.id}-type`} variant={item.type === "MAJOR" ? "destructive" : "default"}>
            {item.type}
          </Badge>,
          new Date(item.targetDate).toLocaleString(),
          <Switch
            key={`${item.id}-active`}
            checked={item.active}
            onCheckedChange={(checked) => toggleMutation.mutate({ id: item.id, active: checked })}
          />,
          <Button
            key={`${item.id}-delete`}
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate(item.id)}
            disabled={deleteMutation.isPending}
            aria-label="Delete row"
          >
            <Trash2Icon />
          </Button>,
        ])}
      />
    </div>
  );
}

function OrganizationsSection() {
  const query = useQuery({ queryKey: ["admin", "organizations"], queryFn: () => adminApi.listOrganizations() });
  return (
    <DataTable
      headers={["Name", "Plan", "Status", "Members", "Services"]}
      rows={(query.data?.items ?? []).map((org) => [
        org.name,
        org.plan,
        <Badge key={org.id} variant="secondary">{org.status}</Badge>,
        org._count?.memberships ?? 0,
        org._count?.services ?? 0,
      ])}
    />
  );
}

function UsersSection() {
  const query = useQuery({ queryKey: ["admin", "users"], queryFn: () => adminApi.listUsers() });
  return (
    <DataTable
      headers={["Name", "Email", "Status", "Organizations", "Created"]}
      rows={(query.data?.items ?? []).map((user) => [
        user.name ?? user.username ?? "Unnamed",
        user.email,
        <Badge key={user.id} variant="secondary">{user.status}</Badge>,
        user._count?.memberships ?? 0,
        formatDate(user.createdAt),
      ])}
    />
  );
}

function MembersSection({ role }: { role: MasterAdminRole; refresh: () => void }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const query = useQuery({ queryKey: ["admin", "members"], queryFn: () => adminApi.listMembers() });
  const createMutation = useMutation({
    mutationFn: () =>
      adminApi.createMember({
        email,
        password: password || undefined,
        role: "MEMBER",
      }),
    onSuccess: () => {
      setEmail("");
      setPassword("");
      queryClient.invalidateQueries({ queryKey: ["admin", "members"] });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {role === "OWNER" && (
        <Card>
          <CardHeader>
            <CardTitle>Add Master Admin Member</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <Input
              placeholder="name@xecurecode.in"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <div className="relative">
              <LockKeyholeIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Temporary password"
                className="pl-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!email || createMutation.isPending}
            >
              {createMutation.isPending ? "Adding..." : "Add member"}
            </Button>
          </CardContent>
        </Card>
      )}
      <DataTable
        headers={["Email", "Role", "Status", "Linked User", "Created"]}
        rows={(query.data?.items ?? []).map((member) => [
          member.email,
          member.role,
          <Badge key={member.id} variant={member.status === "ACTIVE" ? "default" : "secondary"}>{member.status}</Badge>,
          member.user?.name ?? member.userId ?? "Pending login",
          formatDate(member.createdAt),
        ])}
      />
    </div>
  );
}

function ActivityLogsSection() {
  const query = useQuery({ queryKey: ["admin", "activity-logs"], queryFn: () => adminApi.listActivityLogs() });
  return (
    <DataTable
      headers={["Actor", "Action", "Target", "IP", "Timestamp"]}
      rows={(query.data?.items ?? []).map((log) => [
        log.actorEmail,
        log.actionType,
        log.targetResource,
        log.ipAddress ?? "-",
        formatDate(log.createdAt),
      ])}
    />
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => <TableHead key={header}>{header}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? rows.map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, cellIndex) => <TableCell key={cellIndex}>{cell}</TableCell>)}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={headers.length} className="py-8 text-center text-muted-foreground">No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return <div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

function buildBroadcastHtml(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
