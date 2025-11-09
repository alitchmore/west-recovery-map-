import { Skeleton } from "@/components/ui/skeleton";

export const MapSkeleton = () => {
  return (
    <div className="w-full h-[60vh] md:h-[70vh] rounded-lg border border-border bg-muted/20 overflow-hidden">
      <div className="relative w-full h-full">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
            </div>
            <p className="text-sm text-muted-foreground">Loading map data...</p>
          </div>
        </div>
        {/* Simulated marker positions */}
        <div className="absolute top-1/4 left-1/3">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="absolute top-1/2 right-1/3">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="absolute bottom-1/3 left-1/2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};
