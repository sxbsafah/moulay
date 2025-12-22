import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatisticsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="w-full">
          <CardHeader className="flex flex-row items-center gap-4 border-b pb-4">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="flex flex-col gap-2 w-full">
              <CardTitle>
                <Skeleton className="h-5 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-20" />
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 py-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Skeleton className="h-8 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
