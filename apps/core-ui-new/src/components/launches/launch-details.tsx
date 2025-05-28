'use client';

import { format } from 'date-fns';
import { useFindLaunch } from '@/hooks/launches/use-find-launch';
import { useFindTestEntitiesStatusesCounts } from '@/hooks/test-statistics/use-find-test-entities-statuses-counts';
import { Separator } from '@/components/ui/separator';
import { TestStatisticsList } from '@/components/test-statistics/test-statistics-list';
import { tsr } from "@/lib/react-query";

interface LaunchDetailsProps {
  launchId: number | null;
}

export default function LaunchDetails({ launchId }: LaunchDetailsProps) {  // Fetch launch details using the new hook
  const launchQuery = useFindLaunch({
    filter: { id: launchId }
  });
  
  // We need to fetch the data for the TestStatisticsList component
  const testEntitiesStatsQuery = useFindTestEntitiesStatusesCounts({
    filters: {
      launchId: launchId || undefined,
      distinct: false,
    },
    enabled: launchId !== null && launchId > 0,
  });
  
  const statusesQuery = tsr.findTestStatuses.useQuery({
    queryKey: ["testStatuses"],
    enabled: launchId !== null && launchId > 0,
  });
  
  const statusGroupsQuery = tsr.findTestStatusGroups.useQuery({
    queryKey: ["testStatusGroups"],
    enabled: launchId !== null && launchId > 0,
  });

  // Derived states for easier use in the component
  const launch = launchQuery.data;
  const launchLoading = launchQuery.isLoading;
  const launchError = launchQuery.isError;
  
  const testEntityStats = testEntitiesStatsQuery.data || [];
  const statuses = statusesQuery.data?.body?.items || [];
  const statusGroups = statusGroupsQuery.data?.body?.items || [];

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

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Test Statistics</h3>
        {testEntityStats.length > 0 && !testEntitiesStatsQuery.isPending && !statusesQuery.isPending && !statusGroupsQuery.isPending ? (
          <TestStatisticsList 
            testEntityStats={testEntityStats}
            statuses={statuses}
            statusGroups={statusGroups}
          />
        ) : testEntitiesStatsQuery.isPending || statusesQuery.isPending || statusGroupsQuery.isPending ? (
          <p className="text-muted-foreground">Loading test statistics...</p>
        ) : (
          <p className="text-muted-foreground">No test data available</p>
        )}
      </div>
    </div>
  );
}
