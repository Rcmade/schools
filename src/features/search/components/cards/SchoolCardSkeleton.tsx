import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SchoolCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0 pb-2">
      <CardHeader className="p-2">
        {/* Image placeholder */}
        <div className="m-auto rounded-2xl overflow-hidden">
          <Skeleton className="w-full max-w-[320px] h-80 aspect-square" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="w-full space-y-1">
            {/* Title line */}
            <Skeleton className="h-5 w-3/4" />
            {/* Address line */}
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        {/* Fees line */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Fees:</span>
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export default SchoolCardSkeleton;
