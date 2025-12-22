import { Skeleton } from "@/components/ui/skeleton";

export function ProductsTableSkeleton() {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex flex-col divide-y">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center px-6 py-4 gap-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <div className="flex flex-col items-end">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-6 w-14 rounded-full" />
            <div className="flex gap-1">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="w-6 h-6 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
