"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus,  Users, Settings, CheckCircle, Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useOrgs, useCurrentOrg, useSwitchOrg, useCreateOrg } from "@/lib/hooks";

const createOrgSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

type CreateOrgInput = z.infer<typeof createOrgSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function OrgsPage() {
  const router = useRouter();
  const { data: orgs = [], isLoading } = useOrgs();
  const { data: currentOrg } = useCurrentOrg();
  const switchOrg = useSwitchOrg();
  const createOrg = useCreateOrg();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [slugAuto, setSlugAuto] = useState(true);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrgInput>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const orgName = watch("name");
  const orgSlug = watch("slug");

  const handleOrgNameChange = (value: string) => {
    setValue("name", value);
    if (slugAuto) {
      setValue("slug", slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugAuto(false);
    setValue("slug", value);
  };

  const handleSwitchOrg = async (orgId: string) => {
    if (orgId === currentOrg?.id) return;
    try {
      await switchOrg.mutateAsync(orgId);
      router.push("/app/dashboard");
    } catch (error) {
      console.error("Failed to switch org:", error);
    }
  };

  const onSubmit = async (data: CreateOrgInput) => {
    try {
      await createOrg.mutateAsync(data);
      reset();
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Failed to create org:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setSlugAuto(true);
    }
    setShowCreateDialog(open);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading organizations...</div>
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
          onClick={() => router.push("/app/dashboard")}
          className="gap-1"
        >
          <ChevronLeft className="size-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Header - Wider bar */}
      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-6 py-4 max-w-6xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your organizations and switch between them
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="size-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {orgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 border rounded-xl bg-card max-w-md mx-auto">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
            <Building2 className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No organizations yet</h3>
          <p className="text-muted-foreground text-sm mb-6 text-center max-w-sm">
            Create your first organization to collaborate with your team and manage your projects
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="size-4 mr-2" />
            Create Organization
          </Button>
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-5">Organization</div>
            <div className="col-span-2">Plan</div>
            <div className="col-span-2">Members</div>
            <div className="col-span-3"></div>
          </div>

          <div className="divide-y">
            {orgs.map((org) => {
              const isCurrent = org.id === currentOrg?.id;
              return (
                <div
                  key={org.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors"
                >
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Building2 className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{org.name}</span>
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-xs text-primary shrink-0">
                            <CheckCircle className="size-3" />
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground truncate">
                        {org.slug}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 text-sm text-muted-foreground">
                    {org.plan || "Free"}
                  </div>

                  <div className="col-span-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="size-4" />
                      <span>{org._count?.memberships || (org.members?.length ?? 1)}</span>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/app/orgs/${org.id}`)}
                    >
                      <Settings className="size-4 mr-1" />
                      Manage
                    </Button>
                    {!isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSwitchOrg(org.id)}
                      >
                        <CheckCircle className="size-4 mr-1" />
                        Switch
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Org Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to collaborate with your team
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Organization Name</Label>
              <Input
                id="create-name"
                placeholder="Acme Inc."
                {...register("name")}
                onChange={(e) => handleOrgNameChange(e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-slug">Organization URL</Label>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-muted-foreground">
                  app.xecurecode.dev/
                </span>
                <Input
                  id="create-slug"
                  value={orgSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                />
              </div>
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                This will be your organization&apos;s unique identifier
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createOrg.isPending}>
                {createOrg.isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Organization"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
