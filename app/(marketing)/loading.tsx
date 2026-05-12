import { Skeleton } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  return (
    <div className="flex flex-col gap-8 px-4 py-16 max-w-6xl mx-auto">
      <Skeleton className="h-16 w-3/4 mx-auto" />
      <Skeleton className="h-8 w-1/2 mx-auto" />
      <div className="flex gap-4 justify-center">
        <Skeleton className="h-11 w-32 rounded-full" />
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>
    </div>
  );
}
