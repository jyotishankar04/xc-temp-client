"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import {
  useServiceMembers,
  useServiceInvitations,
  useCreateServiceInvitation,
  useCancelServiceInvitation,
  useUpdateServiceMember,
  useRemoveServiceMember,
} from "@/lib/hooks";
import { Loader2, Trash2, UserPlus, Mail, Users } from "lucide-react";

const roleConfig: Record<string, { variant: "outline" | "secondary" | "default"; label: string }> = {
  OWNER: { variant: "default" as const, label: "Owner" },
  ADMIN: { variant: "secondary" as const, label: "Admin" },
  MEMBER: { variant: "outline" as const, label: "Member" },
  VIEWER: { variant: "outline" as const, label: "Viewer" },
};

export default function ServiceMembersPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;

  const { data: members = [], isLoading: membersLoading } = useServiceMembers(serviceId);
  const { data: invitations = [], isLoading: invitationsLoading } = useServiceInvitations(serviceId);
  const createInvitation = useCreateServiceInvitation();
  const cancelInvitation = useCancelServiceInvitation();
  const updateMember = useUpdateServiceMember();
  const removeMember = useRemoveServiceMember();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "member" | "invitation" | null;
    id: string | null;
  }>({ open: false, type: null, id: null });

  const handleInvite = async () => {
    try {
      await createInvitation.mutateAsync({
        serviceId,
        data: { email: inviteEmail, role: inviteRole },
      });
      setIsInviteOpen(false);
      setInviteEmail("");
      setInviteRole("MEMBER");
    } catch (e) {
      console.error("Failed to create invitation:", e);
    }
  };

  const handleCancelInvite = async () => {
    if (!deleteConfirm.id || deleteConfirm.type !== "invitation") return;
    try {
      await cancelInvitation.mutateAsync({ serviceId, invitationId: deleteConfirm.id });
      setDeleteConfirm({ open: false, type: null, id: null });
    } catch (e) {
      console.error("Failed to cancel invitation:", e);
    }
  };

  const handleRemoveMember = async () => {
    if (!deleteConfirm.id || deleteConfirm.type !== "member") return;
    try {
      await removeMember.mutateAsync({ serviceId, userId: deleteConfirm.id });
      setDeleteConfirm({ open: false, type: null, id: null });
    } catch (e) {
      console.error("Failed to remove member:", e);
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await updateMember.mutateAsync({
        serviceId,
        userId,
        data: { role },
      });
    } catch (e) {
      console.error("Failed to update member role:", e);
    }
  };

  const openDeleteConfirm = (type: "member" | "invitation", id: string) => {
    setDeleteConfirm({ open: true, type, id });
  };

  const isLoading = membersLoading || invitationsLoading;

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
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage service members and invitations
          </p>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full" orientation="horizontal">
        <TabsList variant="line" className="h-auto p-0 border-b bg-transparent gap-1">
          <TabsTrigger value="members" className="px-3 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-2">
            <Users className="size-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="invitations" className="px-3 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-2">
            <Mail className="size-4" />
            Invitations ({invitations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="size-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No members yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Invite members to collaborate on this service.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.userId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl}
                                  alt={member.name || member.email}
                                  className="size-8 rounded-full"
                                />
                              ) : (
                                <span className="text-sm font-medium">
                                  {(member.name || member.email || "?").charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {member.name || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={member.role}
                            onValueChange={(value) =>
                              handleUpdateRole(member.userId, value)
                            }
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OWNER">Owner</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MEMBER">Member</SelectItem>
                              <SelectItem value="VIEWER">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {member.joinedAt
                            ? new Date(member.joinedAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => openDeleteConfirm("member", member.userId)}
                            disabled={
                              removeMember.isPending ||
                              member.role === "OWNER"
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invitations</CardTitle>
                <CardDescription>
                  Manage pending invitations to this service
                </CardDescription>
              </div>
              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="size-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to collaborate on this service.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleInvite}
                      disabled={!inviteEmail || createInvitation.isPending}
                    >
                      {createInvitation.isPending && (
                        <Loader2 className="size-4 mr-2 animate-spin" />
                      )}
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              {invitations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Mail className="size-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending invitations</h3>
                  <p className="text-muted-foreground text-sm">
                    All team members have been invited.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">{invitation.email}</TableCell>
                        <TableCell>
                          <Badge variant={roleConfig[invitation.role]?.variant || "outline"}>
                            {roleConfig[invitation.role]?.label || invitation.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {invitation.status || "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => openDeleteConfirm("invitation", invitation.id)}
                            disabled={cancelInvitation.isPending}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={deleteConfirm.type === "invitation" ? handleCancelInvite : handleRemoveMember}
        title={deleteConfirm.type === "invitation" ? "Cancel Invitation" : "Remove Member"}
        description={
          deleteConfirm.type === "invitation"
            ? "Are you sure you want to cancel this invitation? The user will need to be invited again to access this service."
            : "Are you sure you want to remove this member? They will lose access to this service."
        }
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
