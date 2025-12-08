import { useFindLaunch } from "@/hooks/api/launches/use-find-launch.js";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { TestsStatistics } from "../test-statistics/tests-statistics.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import ErrorRetry from "@/components/ui/error-retry.js";

interface LaunchDetailsProps {
  launchId: number;
}

export default function LaunchDetails({ launchId }: LaunchDetailsProps) {
  const launchQuery = useFindLaunch({
    filters: { id: launchId }
  });

  const launch = launchQuery.data;
  const launchLoading = launchQuery.isPending;
  const launchError = launchQuery.isError;

  if (launchLoading) {
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className="h-8 w-48" />
            <div className="mt-2">
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Launch ID</p>
              <Skeleton className="h-4 w-20 mt-1" />
            </div>
            <div>
              <p className="text-muted-foreground">Report ID</p>
              <Skeleton className="h-4 w-24 mt-1" />
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <Skeleton className="h-4 w-40 mt-1" />
            </div>
            <div>
              <p className="text-muted-foreground">Started</p>
              <Skeleton className="h-4 w-40 mt-1" />
            </div>
            <div>
              <p className="text-muted-foreground">Finished</p>
              <Skeleton className="h-4 w-40 mt-1" />
            </div>
          </div>

          <div>
            <p className="text-muted-foreground">Arguments</p>
            <Skeleton className="h-6 w-full mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (launchError || !launch) {
    const handleRetry = () => {
      launchQuery.refetch();
    };

    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mt-3">
            <ErrorRetry onRetry={handleRetry} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between p-2 border-b">
        <h2 className="text-xl font-bold">Launch details</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" aria-label="Edit launch">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Delete launch">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col h-full p-4 overflow-auto">
        <h1 className="text-xl font-bold pb-2">{launch.body.title}</h1>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Launch ID
            </h3>
            <p>{launch.body.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Report ID
            </h3>
            <p>{launch.body.reportId}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Created
            </h3>
            <p>{format(new Date(launch.body.createdTimestamp), "PPpp")}</p>
          </div>
          {launch.body.startedTimestamp && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Started
              </h3>
              <p>{format(new Date(launch.body.startedTimestamp), "PPpp")}</p>
            </div>
          )}
          {launch.body.finishedTimestamp && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Finished
              </h3>
              <p>{format(new Date(launch.body.finishedTimestamp), "PPpp")}</p>
            </div>
          )}
          {launch.body.arguments && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Arguments
              </h3>
              <pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-auto">
                {launch.body.arguments}
              </pre>
            </div>
          )}

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground pb-2">
              Statistics
            </h3>
            <TestsStatistics launchId={launch.body.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
