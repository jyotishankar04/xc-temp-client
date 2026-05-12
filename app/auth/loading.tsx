import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
