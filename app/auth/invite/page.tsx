"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  LogIn,
  MailWarning,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GitHubLogo, Logo } from "@/components/shared/branding";
import { authApi } from "@/lib/api/auth";
import { apiClient, handleApiError, type ApiResponse } from "@/lib/api/client";
import { servicesApi } from "@/lib/api/modules/servicesApi";
import { ROUTES } from "@/lib/constants/routes";
import { useAuth } from "@/lib/hooks/use-auth";

type InviteType = "org" | "service";
type InviteStatus =
  | "idle"
  | "auth-required"
  | "accepting"
  | "accepted"
  | "declined"
  | "error"
  | "email-mismatch";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [status, setStatus] = useState<InviteStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [autoTriggered, setAutoTriggered] = useState(false);

  const invite = useMemo(() => {
    const type = searchParams.get("type") === "service" ? "service" : "org";
    return {
      type: type as InviteType,
      orgId: searchParams.get("orgId") ?? "",
      serviceId: searchParams.get("serviceId") ?? "",
      invitationId: searchParams.get("invitationId") ?? "",
      orgName: searchParams.get("orgName") ?? "",
      serviceName: searchParams.get("serviceName") ?? "",
      role: searchParams.get("role") ?? "",
      email: (searchParams.get("email") ?? "").toLowerCase(),
      redirect: searchParams.get("redirect") ?? ROUTES.DASHBOARD,
    };
  }, [searchParams]);

  const inviteTitle =
    invite.type === "service" ? invite.serviceName || "this service" : invite.orgName || "this organization";
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const switchAccount = async () => {
    await authApi.logout().catch(() => undefined);
    authApi.loginWithGitHub(currentUrl);
  };

  const acceptInvite = useCallback(async () => {
    try {
      setStatus("accepting");
      setMessage(null);

      if (invite.type === "org") {
        if (!invite.orgId) {
          throw new Error("Missing organization id in the invitation link.");
        }

        const response = await apiClient.post<ApiResponse<void>>(
          `/api/v1/orgs/${invite.orgId}/accept`,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Unable to accept invitation.");
        }
      } else {
        const resolvedInvitationId =
          invite.invitationId ||
          (await servicesApi.getMyInvitations()).data?.find(
            (item) => item.serviceId === invite.serviceId,
          )?.id;

        if (!invite.serviceId || !resolvedInvitationId) {
          throw new Error("Missing service invitation details.");
        }

        const response = await apiClient.post<ApiResponse<void>>(
          `/api/v1/services/${invite.serviceId}/invitations/${resolvedInvitationId}/accept`,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Unable to accept invitation.");
        }
      }

      setStatus("accepted");
    } catch (error) {
      setStatus("error");
      setMessage(handleApiError(error));
    }
  }, [invite.invitationId, invite.orgId, invite.serviceId, invite.type]);

  const declineInvite = useCallback(async () => {
    try {
      setStatus("accepting");
      setMessage(null);

      if (invite.type === "org") {
        if (!invite.orgId) {
          throw new Error("Missing organization id in the invitation link.");
        }

        const response = await apiClient.post<ApiResponse<void>>(
          `/api/v1/orgs/${invite.orgId}/reject`,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Unable to decline invitation.");
        }
      } else {
        const resolvedInvitationId =
          invite.invitationId ||
          (await servicesApi.getMyInvitations()).data?.find(
            (item) => item.serviceId === invite.serviceId,
          )?.id;

        if (!invite.serviceId || !resolvedInvitationId) {
          throw new Error("Missing service invitation details.");
        }

        const response = await apiClient.post<ApiResponse<void>>(
          `/api/v1/services/${invite.serviceId}/invitations/${resolvedInvitationId}/reject`,
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Unable to decline invitation.");
        }
      }

      setStatus("declined");
      setMessage("Invitation declined.");
    } catch (error) {
      setStatus("error");
      setMessage(handleApiError(error));
    }
  }, [invite.invitationId, invite.orgId, invite.serviceId, invite.type]);

  useEffect(() => {
    if (isLoading || autoTriggered || status === "accepted" || status === "accepting") {
      return;
    }

    if (!user) {
      setStatus("auth-required");
      return;
    }

    if (invite.email && user.email?.toLowerCase() !== invite.email) {
      setStatus("email-mismatch");
      return;
    }

    setAutoTriggered(true);
    void acceptInvite();
  }, [acceptInvite, autoTriggered, invite.email, isLoading, status, user]);

  const canOpenTarget = status === "accepted";
  const dashboardHref = invite.redirect || ROUTES.DASHBOARD;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.35),transparent_40%),radial-gradient(circle_at_70%_20%,rgba(0,183,255,0.24),transparent_32%)]" />

      <Card className="border-border/70 bg-card/95 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                XecureCode invite
              </div>
              <CardTitle className="mt-1 text-balance text-2xl">
                Join {inviteTitle}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-sm leading-6 text-muted-foreground">
            Invitations are tied to the target email address. If you do not
            have an account yet, GitHub sign-in will create one first and then
            return you here to finish joining.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/60 p-4 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Invite type
              </div>
              <div className="font-medium capitalize">{invite.type}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Target email
              </div>
              <div className="font-medium">{invite.email || "Not specified"}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Role
              </div>
              <div className="font-medium">{invite.role || "Member"}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Current account
              </div>
              <div className="font-medium">{user?.email ?? "Not signed in"}</div>
            </div>
          </div>

          {status === "auth-required" ? (
            <Alert className="border-blue-500/30 bg-blue-500/10">
              <LogIn className="h-4 w-4" />
              <AlertTitle>Sign in to accept the invite</AlertTitle>
              <AlertDescription>
                Use the invited GitHub account. If you do not have one yet,
                GitHub sign-up will create the account and return you here
                automatically.
              </AlertDescription>
            </Alert>
          ) : null}

          {status === "email-mismatch" ? (
            <Alert className="border-amber-500/30 bg-amber-500/10">
              <MailWarning className="h-4 w-4" />
              <AlertTitle>Signed in with a different email</AlertTitle>
              <AlertDescription>
                The current GitHub account does not match the email invited to
                this workspace. Switch accounts or ask the inviter to resend
                the invite to the correct address.
              </AlertDescription>
            </Alert>
          ) : null}

          {status === "error" && message ? (
            <Alert variant="destructive">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Invite could not be processed</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          {status === "accepted" ? (
            <Alert className="border-emerald-500/30 bg-emerald-500/10">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Invitation handled successfully</AlertTitle>
              <AlertDescription>
                You can continue into the dashboard now.
              </AlertDescription>
            </Alert>
          ) : null}

          {status === "declined" && message ? (
            <Alert className="border-slate-500/30 bg-slate-500/10">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Invitation declined</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          <Separator />

          <div className="grid gap-3 sm:grid-cols-2">
            {!user ? (
              <Button
                className="w-full gap-2"
                onClick={() => authApi.loginWithGitHub(currentUrl)}
              >
                <GitHubLogo className="size-4" />
                Continue with GitHub
              </Button>
            ) : null}

            {user && status !== "accepted" ? (
              <Button
                className="w-full gap-2"
                onClick={() => void acceptInvite()}
                disabled={status === "accepting"}
              >
                {status === "accepting" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Users className="size-4" />
                )}
                Accept invitation
              </Button>
            ) : null}

            {user ? (
              <Button
                className="w-full gap-2"
                variant="secondary"
                onClick={() => void switchAccount()}
                disabled={status === "accepting"}
              >
                <LogIn className="size-4" />
                Switch GitHub account
              </Button>
            ) : null}

            {user && status !== "accepted" ? (
              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => void declineInvite()}
                disabled={status === "accepting"}
              >
                Decline invitation
              </Button>
            ) : null}
          </div>

          {canOpenTarget ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="size-4 text-emerald-400" />
                Invitation ready
              </div>
              <p className="text-sm text-muted-foreground">
                You are already in the right workspace. Continue to the
                dashboard or open the invited area directly.
              </p>
              <Button asChild className="w-fit gap-2">
                <a href={dashboardHref}>
                  Continue
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          ) : null}

          <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-4 text-sm leading-6 text-muted-foreground">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <Badge variant="secondary" className="rounded-full">
                <ShieldCheck className="mr-1 size-3.5" />
                Secure flow
              </Badge>
            </div>
            {invite.type === "service" ? (
              <p>
                Service invites require a matching GitHub email. If you do not
                have a XecureCode account yet, GitHub sign-up will create it
                and the invite will be claimed automatically.
              </p>
            ) : (
              <p>
                Organization invites follow the same flow. After GitHub sign-in
                or sign-up, the invite is accepted automatically for the
                matching email.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
