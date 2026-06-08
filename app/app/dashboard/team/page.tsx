"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Mail,
  MoreHorizontal,
  Shield,
  UserCog,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { useCurrentOrg, useOrgMembers, useInviteMember } from "@/lib/hooks";

type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

const roleColors: Record<string, "default" | "secondary" | "outline"> = {
  OWNER: "default",
  ADMIN: "secondary",
  MEMBER: "outline",
  VIEWER: "outline",
};

export default function TeamPage() {
  const { data: currentOrg } = useCurrentOrg();
  const { data: members = [], isLoading } = useOrgMembers(currentOrg?.id);
  const inviteMember = useInviteMember();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("MEMBER");

  const handleSendInvite = async () => {
    if (!inviteEmail || !currentOrg?.id) return;
    try {
      await inviteMember.mutateAsync({
        orgId: currentOrg.id,
        data: { email: inviteEmail, role: inviteRole },
      });
      setInviteEmail("");
    } catch (e) {
      console.error("Failed to invite member:", e);
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return email?.[0]?.toUpperCase() || "?";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your team members and roles
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter email address"
              type="email"
              className="max-w-sm"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-36">
                  <UserPlus className="size-4 mr-2" />
                  {inviteRole.charAt(0) + inviteRole.slice(1).toLowerCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(["ADMIN", "MEMBER", "VIEWER"] as Role[]).map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setInviteRole(role)}
                    className="cursor-pointer"
                  >
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={handleSendInvite}
              disabled={!inviteEmail || !currentOrg?.id || inviteMember.isPending}
            >
              {inviteMember.isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Mail className="size-4 mr-2" />
              )}
              Send Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.userId ?? member.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {getInitials(member.name, member.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name || member.email}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleColors[member.role] ?? "outline"} className="text-xs capitalize">
                          {member.role.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        {member.role !== "OWNER" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8" aria-label="More actions">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer" disabled>
                                <UserCog className="size-4 mr-2" />
                                Change role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-destructive" disabled>
                                <UserMinus className="size-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { role: "Owner", desc: "Full access including billing and team management" },
            { role: "Admin", desc: "Manage services, settings, and team members" },
            { role: "Member", desc: "View and manage failures and actions" },
            { role: "Viewer", desc: "Read-only access to all features" },
          ].map((item) => (
            <div key={item.role} className="flex items-center gap-3 rounded-lg border p-3">
              <Shield className="size-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.role}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
