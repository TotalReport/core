import { tsr } from "@/lib/react-query";
import { getNullableUrlParamNumber } from "@/lib/url-utils";
import { format } from "date-fns";
import { useEffect, useState, useRef, useCallback } from "react";
import { Separator } from "./ui/separator";

export const StandaloneLaunchDetails = () => {
  // Function to get current launch parameters from URL
  const getLaunchParamsFromUrl = useCallback(() => {
    return getNullableUrlParamNumber("launchId");
  }, []);

  const [launchId, setLaunchId] = useState<number | null>(() => {
    return getLaunchParamsFromUrl();
  });

  // Use a callback for checking URL params to avoid recreating it on every render
  const checkUrlParams = useCallback(() => {
    const newLaunchId = getLaunchParamsFromUrl();
    if (newLaunchId !== launchId) {
      setLaunchId(newLaunchId);
    }
  }, [launchId, getLaunchParamsFromUrl]);

  // Listen for URL changes
  useEffect(() => {
    // Check immediately on mount
    checkUrlParams();

    // Function handler for URL changes
    const handleUrlChange = () => {
      checkUrlParams();
    };

    // Listen for both our custom event and popstate
    window.addEventListener("urlchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);

    // Clean up
    return () => {
      window.removeEventListener("urlchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [checkUrlParams]);

  // Skip URL updates from this component to avoid loops
  const isUpdatingUrl = useRef(false);

  // Update URL when launch ID changes
  useEffect(() => {
    if (typeof window !== "undefined" && !isUpdatingUrl.current) {
      isUpdatingUrl.current = true;

      const url = new URL(window.location.href);

      // Keep page and pageSize parameters
      const page = url.searchParams.get("page");
      const pageSize = url.searchParams.get("pageSize");

      // Clear launch ID parameter first
      url.searchParams.delete("launchId");

      // Then set the active one if it exists
      if (launchId !== null) {
        url.searchParams.set("launchId", launchId.toString());
      }

      // Restore page and pageSize if they existed
      if (page) url.searchParams.set("page", page);
      if (pageSize) url.searchParams.set("pageSize", pageSize);

      window.history.replaceState({}, "", url.toString());

      // Reset flag after a small delay to ensure events are processed
      setTimeout(() => {
        isUpdatingUrl.current = false;
      }, 0);
    }
  }, [launchId]);

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
