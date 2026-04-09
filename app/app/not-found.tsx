"use client";

import { FolderCheck, FolderX, Home, Import, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Page Not Found</h1>
        <p className="text-muted-foreground text-sm mt-1">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <Empty className="py-16">
        <EmptyHeader>
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-2">
            <FolderX className="size-8 text-muted-foreground" />
          </div>
          <EmptyTitle>No Data Found</EmptyTitle>
          <EmptyDescription>
            This section is empty or the resource you&apos;re looking for doesn&apos;t exist yet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button asChild>
              <Link href={ROUTES.DASHBOARD}>
                <Home className="size-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.DASHBOARD_SERVICES}>
                <Plus className="size-4 mr-2" />
                Connect a Service
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
