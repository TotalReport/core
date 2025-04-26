import { tsr } from "@/lib/react-query";
import { format } from "date-fns";
import { useNumericUrlParam } from "@/lib/hooks/useUrlParam";
import { Separator } from "./ui/separator";

export const StandaloneLaunchDetails = () => {
  // Use our custom hook to manage the launchId URL parameter
  const [launchId, setLaunchId] = useNumericUrlParam("launchId");

  const launchQuery = tsr.readLaunch.useQuery({
    queryKey: [`/launches/${launchId}`],
    queryData: {
      params: { id: launchId || 0 },
    },
    enabled: launchId !== null && launchId > 0,
  });

  const launchStatisticsQuery = tsr.launchStatistics.useQuery({
    queryKey: [`/launch-statistics/${launchId}`],
    queryData: {
      params: { id: launchId || 0 },
    },
    enabled: launchId !== null && launchId > 0,
  });

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

  if (launchQuery.isPending) {
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

  if (launchQuery.error || !launchQuery.data?.body) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            Error loading launch details
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {JSON.stringify(launchQuery.error) || "Unable to fetch launch data"}
          </p>
        </div>
      </div>
    );
  }

  const launch = launchQuery.data.body;

  return (
    <div className="flex flex-col h-full p-6">
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

      {launchStatisticsQuery.data?.body && (
        <>
          <Separator className="my-4" />
          <h3 className="text-lg font-semibold mb-2">Test Statistics</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Before Tests
              </h4>
              <ul className="mt-2 space-y-1">
                {launchStatisticsQuery.data.body.beforeTests.map((stat) => (
                  <li key={stat.statusGroupId} className="text-sm">
                    {stat.statusGroupId ? stat.statusGroupId : "No Group"}:{" "}
                    {stat.count}
                  </li>
                ))}
                {launchStatisticsQuery.data.body.beforeTests.length === 0 && (
                  <li className="text-sm text-muted-foreground">No data</li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Tests
              </h4>
              <ul className="mt-2 space-y-1">
                {launchStatisticsQuery.data.body.tests.map((stat) => (
                  <li key={stat.statusGroupId} className="text-sm">
                    {stat.statusGroupId ? stat.statusGroupId : "No Group"}:{" "}
                    {stat.count}
                  </li>
                ))}
                {launchStatisticsQuery.data.body.tests.length === 0 && (
                  <li className="text-sm text-muted-foreground">No data</li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                After Tests
              </h4>
              <ul className="mt-2 space-y-1">
                {launchStatisticsQuery.data.body.afterTests.map((stat) => (
                  <li key={stat.statusGroupId} className="text-sm">
                    {stat.statusGroupId ? stat.statusGroupId : "No Group"}:{" "}
                    {stat.count}
                  </li>
                ))}
                {launchStatisticsQuery.data.body.afterTests.length === 0 && (
                  <li className="text-sm text-muted-foreground">No data</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
