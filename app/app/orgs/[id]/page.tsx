"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus, Search, ShieldCheck, Pencil, Eye, Settings, Server, Users, CheckCircle, XCircle, AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useOrgById,
  useInviteMember,
} from "@/lib/hooks";
import { useAuth } from "@/lib/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";

const roleIcons = {
  OWNER: ShieldCheck,
  ADMIN: ShieldCheck,
  MEMBER: Pencil,
  BILLING: Eye,
};

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "BILLING"], {
    message: "Please select a role",
  }),
});

type InviteInput = z.infer<typeof inviteSchema>;

const serviceStatusConfig = {
  HEALTHY: { icon: CheckCircle, color: "text-green-500" },
  DEGRADED: { icon: AlertCircle, color: "text-yellow-500" },
  DOWN: { icon: XCircle, color: "text-red-500" },
};

export default function OrgDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.id as string;
  const { user } = useAuth();

  const { data: org, isLoading } = useOrgById(orgId);
  const inviteMember = useInviteMember();

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register: registerInvite,
    handleSubmit: handleSubmitInvite,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm<InviteInput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  const onSubmitInvite = async (data: InviteInput) => {
    try {
      await inviteMember.mutateAsync({ orgId, data });
      resetInvite();
      setShowInviteDialog(false);
    } catch (error) {
      console.error("Failed to invite member:", error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isCurrentUser = (memberEmail: string) => {
    return user?.email === memberEmail;
  };

  const filteredMembers = (org?.members || []).filter(
    (member) =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Organization not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/app/orgs")}
          className="gap-1"
        >
          <ChevronLeft className="size-4" />
          All Organizations
        </Button>
      </div>

      {/* Twitter-style Header with Banner */}
      <div className="max-w-6xl mx-auto w-full">
        {/* Banner */}
        <div className="relative h-32 sm:h-40 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-primary/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Profile Section - positioned to overlap banner */}
        <div className="relative -mt-12 px-6">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="size-24 border-4 border-background rounded-full bg-primary/10">
                  <AvatarFallback className="text-2xl font-bold">
                    {org.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold border-2 border-background">
                  {org.plan?.charAt(0) || "F"}
                </div>
              </div>

              {/* Name & Handle */}
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{org.name}</h1>
                  {org.plan && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {org.plan}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">@{org.slug}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>{org._count?.memberships || org.members?.length || 0} members</span>
            <span>•</span>
            <span>{org.services?.length || 0} services</span>
            <span>•</span>
            <span>Team size: {org.teamSize || "1-5"}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="max-w-6xl mx-auto w-full">
        <TabsList>
          <TabsTrigger value="overview">
            <Settings className="size-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="services">
            <Server className="size-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="size-4 mr-2" />
            Members
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>
                Your organization&apos;s basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <div className="p-3 rounded-md bg-muted/50 text-sm font-medium">
                    {org.name}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Organization URL</Label>
                  <div className="p-3 rounded-md bg-muted/50 text-sm">
                    <span className="text-muted-foreground">app.xecurecode.dev/</span>
                    <span className="font-medium">{org.slug}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Updating organization details is not currently supported. Please contact support if you need to make changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="mt-6">
          <div className="rounded-lg border bg-card overflow-hidden">
            {(org.services || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Server className="size-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No services yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Connect your first service to start monitoring
                </p>
                <Button>Add Service</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Ping</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {org.services?.map((service) => {
                    const statusConfig = serviceStatusConfig[service.status as keyof typeof serviceStatusConfig] || serviceStatusConfig.DEGRADED;
                    const StatusIcon = statusConfig.icon;
                    return (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded bg-muted">
                              <Server className="size-4" />
                            </div>
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-xs text-muted-foreground">{service.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1.5 ${statusConfig.color}`}>
                            <StatusIcon className="size-4" />
                            <span className="text-sm capitalize">{service.status.toLowerCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {service.lastPing ? formatDate(service.lastPing) : "Never"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-6">
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Button onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="size-4 mr-2" />
                Invite
              </Button>
            </div>

            {(org.members || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Users className="size-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No members yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Invite your team members to collaborate
                </p>
                <Button onClick={() => setShowInviteDialog(true)}>
                  <UserPlus className="size-4 mr-2" />
                  Invite Members
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => {
                    const RoleIcon = roleIcons[member.role as keyof typeof roleIcons] || Pencil;
                    const isCurrent = isCurrentUser(member.email);
                    return (
                      <TableRow key={member.email} className={isCurrent ? "bg-primary/5" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              {member.avatarUrl ? (
                                <AvatarImage src={member.avatarUrl} />
                              ) : (
                                <AvatarFallback className="text-xs">
                                  {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{member.name || "Unnamed"}</span>
                                {isCurrent && (
                                  <span className="text-xs text-primary">(You)</span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">{member.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <RoleIcon className="size-4 text-muted-foreground" />
                            <span className="text-sm capitalize">{member.role.toLowerCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`size-2 rounded-full ${member.status === "ACTIVE" ? "bg-green-500" : "bg-yellow-500"
                                }`}
                            />
                            <span className="text-sm text-muted-foreground capitalize">
                              {member.status.toLowerCase()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {member.joinedAt ? formatDate(member.joinedAt) : "Pending"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join this organization
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitInvite(onSubmitInvite)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                {...registerInvite("email")}
              />
              {inviteErrors.email && (
                <p className="text-sm text-destructive">{inviteErrors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                {...registerInvite("role")}
              >
                <SelectTrigger
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"

                >
                  Select role
                </SelectTrigger>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="BILLING">Billing</SelectItem>
              </Select>
              {inviteErrors.role && (
                <p className="text-sm text-destructive">{inviteErrors.role.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowInviteDialog(false);
                  resetInvite();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={inviteMember.isPending}>
                {inviteMember.isPending ? "Inviting..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
