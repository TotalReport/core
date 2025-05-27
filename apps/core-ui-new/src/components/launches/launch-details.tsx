'use client';

import { format } from 'date-fns';
import { useFindLaunch } from '@/hooks/launches/use-find-launch';
import { useLaunchStatistics } from '@/hooks/launches/use-launch-statistics';
import { Separator } from '@/components/ui/separator';

interface LaunchDetailsProps {
  launchId: number | null;
}

export default function LaunchDetails({ launchId }: LaunchDetailsProps) {  // Fetch launch details using the new hook
  const launchQuery = useFindLaunch({
    filter: { id: launchId }
  });
  
  // Fetch launch statistics using the new hook
  const statisticsQuery = useLaunchStatistics({
    filter: { id: launchId }
  });

  // Derived states for easier use in the component
  const launch = launchQuery.data;
  const launchLoading = launchQuery.isLoading;
  const launchError = launchQuery.isError;
  const statistics = statisticsQuery.data?.body;

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
    <div className="flex flex-col h-full p-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{launch.title}</h2>
        <div className="text-sm text-muted-foreground">Launch #{launch.id}</div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Report ID
          </h3>
          <p>{launch.reportId}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Correlation ID
          </h3>
          <p className="text-sm break-all">{launch.correlationId}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
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
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Arguments Hash
          </h3>
          <p className="text-sm break-all">{launch.argumentsHash}</p>
        </div>
      </div>

      {statistics && (
        <>
          <Separator className="my-4" />
          <h3 className="text-lg font-semibold mb-2">Test Statistics</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Before Tests
              </h4>
              <ul className="mt-2 space-y-1">
                {statistics.beforeTests.map((stat, index) => (
                  <li key={`before-${index}-${stat.statusGroupId}`} className="text-sm">
                    {stat.statusGroupId ? stat.statusGroupId : "No Group"}:{" "}
                    {stat.count}
                  </li>
                ))}
                {statistics.beforeTests.length === 0 && (
                  <li className="text-sm text-muted-foreground">No data</li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Tests
              </h4>
              <ul className="mt-2 space-y-1">
                {statistics.tests.map((stat, index) => (
                  <li key={`test-${index}-${stat.statusGroupId}`} className="text-sm">
                    {stat.statusGroupId ? stat.statusGroupId : "No Group"}:{" "}
                    {stat.count}
                  </li>
                ))}
                {statistics.tests.length === 0 && (
                  <li className="text-sm text-muted-foreground">No data</li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                After Tests
              </h4>
              <ul className="mt-2 space-y-1">
                {statistics.afterTests.map((stat, index) => (
                  <li key={`after-${index}-${stat.statusGroupId}`} className="text-sm">
                    {stat.statusGroupId ? stat.statusGroupId : "No Group"}:{" "}
                    {stat.count}
                  </li>
                ))}
                {statistics.afterTests.length === 0 && (
                  <li className="text-sm text-muted-foreground">No data</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}