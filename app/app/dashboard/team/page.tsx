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
  MoreHorizontal,
  Mail,
  Plus,
  Shield,
  UserCog,
  UserMinus,
  UserPlus,
} from "lucide-react";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  joined: string;
};

const members: Member[] = [
  { id: "1", name: "Rahul Verma", email: "rahul@acme.com", role: "owner", joined: "Jan 15, 2025" },
  { id: "2", name: "Priya Sharma", email: "priya@acme.com", role: "admin", joined: "Feb 1, 2025" },
  { id: "3", name: "Amit Kumar", email: "amit@acme.com", role: "member", joined: "Mar 10, 2025" },
  { id: "4", name: "Sneha Patel", email: "sneha@acme.com", role: "viewer", joined: "Apr 5, 2025" },
];

const roleColors: Record<Member["role"], "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "secondary",
  member: "outline",
  viewer: "outline",
};

export default function TeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Member["role"]>("member");

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
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Invite Member</CardTitle>
          </div>
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
                  {inviteRole.charAt(0).toUpperCase() + inviteRole.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(["admin", "member", "viewer"] as Member["role"][]).map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setInviteRole(role)}
                    className="cursor-pointer"
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Mail className="size-4 mr-2" />
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
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleColors[member.role]} className="text-xs capitalize">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.joined}
                  </TableCell>
                  <TableCell>
                    {member.role !== "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <UserCog className="size-4 mr-2" />
                            Change role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive">
                            <UserMinus className="size-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
