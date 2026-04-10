"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateOrg } from "@/lib/hooks";

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

export default function CreateOrgPage() {
  const router = useRouter();
  const [slugAuto, setSlugAuto] = useState(true);
  const createOrg = useCreateOrg();

  const {
    register,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrgInput>({
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

  const onSubmit = async (data: CreateOrgInput) => {
    const result = createOrgSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateOrgInput;
        setError(field, { message: issue.message });
      });
      return;
    }

    try {
      await createOrg.mutateAsync(data);
      router.push("/app/orgs");
    } catch (error) {
      console.error("Failed to create org:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/app/orgs">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Organization</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create a new organization to collaborate with your team
          </p>
        </div>
      </div>

      <Card className="p-6">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Enter the details for your new organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Acme Inc."
                {...register("name")}
                onChange={(e) => handleOrgNameChange(e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Organization URL</Label>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-muted-foreground">
                  app.xecurecode.dev/
                </span>
                <Input
                  id="slug"
                  value={orgSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="flex-1"
                />
              </div>
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                This will be your organization&apos;s unique identifier
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/app/orgs">Cancel</Link>
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
