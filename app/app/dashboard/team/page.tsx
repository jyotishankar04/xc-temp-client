"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/hooks";
import {
  useCurrentOrg,
  useInviteMember,
  useOrgMembers,
  useRemoveOrgMember,
  useUpdateOrgMemberRole,
} from "@/lib/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, Shield, UserPlus, UserX } from "lucide-react";

type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

const inviteRoleOptions: Array<{ value: Exclude<Role, "OWNER">; label: string }> = [
  { value: "ADMIN", label: "Admin" },
  { value: "MEMBER", label: "Member" },
  { value: "VIEWER", label: "Viewer" },
];

const manageRoleOptions = [
  { value: "OWNER", label: "Owner" },
  ...inviteRoleOptions,
] as Array<{ value: Role; label: string }>;

const roleBadges: Record<Role, "default" | "secondary" | "outline"> = {
  OWNER: "default",
  ADMIN: "secondary",
  MEMBER: "outline",
  VIEWER: "outline",
};

const roleDescriptions: Record<Role, string> = {
  OWNER: "Full access, including billing, ownership, and team management.",
  ADMIN: "Manage services, settings, invitations, and most team actions.",
  MEMBER: "Work on services and view the team, but cannot manage ownership.",
  VIEWER: "Read-only access across the workspace.",
};

const roleLabel = (role: string) =>
  role.charAt(0) + role.slice(1).toLowerCase();

export default function TeamPage() {
  const { user } = useAuth();
  const { data: currentOrg, isLoading: orgLoading } = useCurrentOrg();
  const { data: members = [], isLoading: membersLoading } = useOrgMembers(currentOrg?.id);
  const inviteMember = useInviteMember();
  const updateMemberRole = useUpdateOrgMemberRole();
  const removeMember = useRemoveOrgMember();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("MEMBER");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<{
    userId: string;
    name: string;
    email: string;
  } | null>(null);

  const currentMember = useMemo(
    () =>
      currentOrg?.members?.find((member) => member.userId && member.userId === user?.id) ??
      members.find((member) => member.userId && member.userId === user?.id),
    [currentOrg?.members, members, user?.id],
  );

  const canManageTeam = currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";
  const memberCount = members.length;

  const clearAlerts = () => setAlertMessage(null);

  const handleInvite = async () => {
    if (!currentOrg?.id || !inviteEmail) return;

    clearAlerts();

    try {
      await inviteMember.mutateAsync({
        orgId: currentOrg.id,
        data: {
          email: inviteEmail,
          role: inviteRole,
        },
      });

      setInviteEmail("");
      setInviteRole("MEMBER");
      setInviteOpen(false);
    } catch (error) {
      setAlertMessage(error instanceof Error ? error.message : "Failed to invite member");
    }
  };

  const handleRoleChange = async (userId: string, role: Role) => {
    if (!currentOrg?.id) return;

    clearAlerts();

    try {
      await updateMemberRole.mutateAsync({
        orgId: currentOrg.id,
        userId,
        role,
      });
    } catch (error) {
      setAlertMessage(error instanceof Error ? error.message : "Failed to update member role");
    }
  };

  const handleRemoveMember = async () => {
    if (!currentOrg?.id || !pendingRemoval) return;

    clearAlerts();

    try {
      await removeMember.mutateAsync({
        orgId: currentOrg.id,
        userId: pendingRemoval.userId,
      });
      setPendingRemoval(null);
    } catch (error) {
      setAlertMessage(error instanceof Error ? error.message : "Failed to remove member");
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    return email?.slice(0, 2).toUpperCase() || "?";
  };

  const currentPlanLabel = currentOrg?.plan
    ? currentOrg.plan.charAt(0).toUpperCase() + currentOrg.plan.slice(1).toLowerCase()
    : "Free";

  if (orgLoading || membersLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-balance text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-pretty text-sm text-muted-foreground">
            Manage organization members, roles, invitations, and access.
          </p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canManageTeam || !currentOrg?.id}>
              <UserPlus className="mr-2 size-4" />
              Invite member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite member</DialogTitle>
              <DialogDescription>
                Send an invitation to join {currentOrg?.name ?? "your organization"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="teammate@example.com"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as Role)}>
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {inviteRoleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={
                  !inviteEmail ||
                  !canManageTeam ||
                  inviteMember.isPending
                }
              >
                {inviteMember.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 size-4" />
                )}
                Send invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {alertMessage && (
        <Alert variant="destructive">
          <AlertTitle>Update failed</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="space-y-1">
            <CardDescription>Organization</CardDescription>
            <CardTitle className="text-lg">{currentOrg?.name ?? "Organization"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Badge variant="outline">{currentPlanLabel} plan</Badge>
            {currentOrg?.slug ? (
              <span className="text-sm text-muted-foreground">/{currentOrg.slug}</span>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardDescription>Team usage</CardDescription>
            <CardTitle className="text-lg">
              <span className="tabular-nums">{memberCount}</span> members
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Active members and pending invitations share the same workspace seat pool.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardDescription>Your access</CardDescription>
            <CardTitle className="text-lg">
              {currentMember ? roleLabel(currentMember.role) : "Member"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {currentMember?.role
              ? roleDescriptions[currentMember.role as Role]
              : "You do not currently have a visible organization membership."}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Members</CardTitle>
          <CardDescription>
            Change roles, review pending invitations, or remove access when needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Shield className="size-10 text-muted-foreground" />
              <div>
                <p className="font-medium">No members yet</p>
                <p className="text-sm text-muted-foreground">
                  Invite the first teammate to start collaborating.
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const isOwner = member.role === "OWNER";
                  const isCurrentUser = member.userId === user?.id;
                  const canEditRow = canManageTeam && !isOwner && !isCurrentUser;
                  const rowLabel = member.name || member.email;

                  return (
                    <TableRow key={member.userId ?? member.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {getInitials(member.name, member.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">{rowLabel}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === "INVITED" ? "secondary" : "outline"}>
                          {member.status?.toLowerCase() === "invited" ? "Pending invite" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isOwner ? (
                          <Badge variant={roleBadges.OWNER}>Owner</Badge>
                        ) : canEditRow ? (
                          <Select
                            value={member.role}
                            onValueChange={(value) => handleRoleChange(member.userId!, value as Role)}
                            disabled={updateMemberRole.isPending || !member.userId}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(currentMember?.role === "OWNER" ? manageRoleOptions : inviteRoleOptions).map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant={roleBadges[member.role as Role] ?? "outline"}>
                            {roleLabel(member.role)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "Pending"}
                      </TableCell>
                      <TableCell className="text-right">
                        {canEditRow ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              setPendingRemoval({
                                userId: member.userId!,
                                name: rowLabel,
                                email: member.email,
                              })
                            }
                            disabled={!member.userId}
                            aria-label={`Remove ${rowLabel}`}
                          >
                            <UserX className="size-4" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {isOwner ? "Protected" : isCurrentUser ? "You" : "Read only"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Role permissions</CardTitle>
          <CardDescription>Keep these permissions narrow to preserve the MVP workflow.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {(Object.keys(roleDescriptions) as Role[]).map((role) => (
            <div key={role} className="rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <Badge variant={roleBadges[role]}>{roleLabel(role)}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{roleDescriptions[role]}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!pendingRemoval}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRemoval(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRemoval
                ? `Remove ${pendingRemoval.name} (${pendingRemoval.email}) from this organization? They will lose access immediately.`
                : "Remove this member from the organization?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleRemoveMember();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeMember.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
