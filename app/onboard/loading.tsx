import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-lg flex-col gap-5">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
