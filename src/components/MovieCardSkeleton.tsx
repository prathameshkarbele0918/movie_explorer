import { Skeleton } from "@/components/ui/skeleton";

const MovieCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-card border border-border">
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
