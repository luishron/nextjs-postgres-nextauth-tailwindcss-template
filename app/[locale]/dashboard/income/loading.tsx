import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function IncomeLoading() {
  return (
    <div className="flex flex-col gap-4 max-w-full">
      {/* Header skeleton */}
      <div className="flex items-center justify-between max-w-full">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between max-w-full">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-11 w-44" />
          <Skeleton className="h-11 w-44" />
        </div>
      </div>

      {/* Income list skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
