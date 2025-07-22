import { useFindLaunch } from "@/hooks/api/launches/use-find-launch.js";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { TestsStatisticsContainer } from "../test-statistics/test-statistics-container.jsx";
import { Button } from "../ui/button.jsx";

interface LaunchDetailsProps {
  launchId: number | null;
}

export default function LaunchDetails({ launchId }: LaunchDetailsProps) {
  // Fetch launch details using the hook
  const launchQuery = useFindLaunch({
    filters: { id: launchId || 0 },
    enabled: launchId !== null && launchId > 0,
  });

  // Derived states for easier use in the component
  const launch = launchQuery.data;
  const launchLoading = launchQuery.isPending;
  const launchError = launchQuery.isError;

  if (!launchId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            No launch selected
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Select a launch from the list to view details
          </p>
        </div>
      </div>
    );
  }

  if (launchLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            Loading launch details...
          </p>
        </div>
      </div>
    );
  }

  if (launchError || !launch) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            Error loading launch details
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Unable to fetch launch data
          </p>
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
        <h1 className="text-xl font-bold pb-2">{launch.title}</h1>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Launch ID
            </h3>
            <p>{launch.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Report ID
            </h3>
            <p>{launch.reportId}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Created
            </h3>
            <p>{format(new Date(launch.createdTimestamp), "PPpp")}</p>
          </div>
          {launch.startedTimestamp && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Started
              </h3>
              <p>{format(new Date(launch.startedTimestamp), "PPpp")}</p>
            </div>
          )}
          {launch.finishedTimestamp && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Finished
              </h3>
              <p>{format(new Date(launch.finishedTimestamp), "PPpp")}</p>
            </div>
          )}
          {launch.arguments && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Arguments
              </h3>
              <pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-auto">
                {launch.arguments}
              </pre>
            </div>
          )}

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground pb-2">
              Statistics
            </h3>
            <TestsStatisticsContainer launchId={launch.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
