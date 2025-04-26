import { tsr } from "@/lib/react-query";
import { totalPagesCount } from "@/lib/pagination-utils";
import { getUrlParamNumber } from "@/lib/url-utils";
import { useEffect, useState } from "react";
import { PaginationBlock } from "./pagination-block";
import { RestAPIProvider } from "./RestAPIProvider";
import { LaunchListItem, type LaunchEntity } from "./launches-list-item";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { StandaloneLaunchDetails } from "./StandaloneLaunchDetails";

const Internal = () => {
  const [page, setPage] = useState(() => Math.max(1, getUrlParamNumber("page", 1)));
  const [pageSize, setPageSize] = useState(() => Math.max(1, getUrlParamNumber("pageSize", 10)));
  
  // Track selected launch ID
  const [selectedLaunchId, setSelectedLaunchId] = useState<number | null>(() => {
    const launchId = getUrlParamNumber("launchId", -1);
    return launchId > 0 ? launchId : null;
  });

  const launchesQuery = tsr.findLaunches.useQuery({
    queryKey: [`launches?page=${page}&pageSize=${pageSize}`],
    queryData: {
      query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    },
  });

  useEffect(() => {
    if (page < 1) setPage(1);
    
    if (pageSize < 1) setPageSize(10);
    
    if (!launchesQuery.isPending) {
      const totalPages = totalPagesCount(
        launchesQuery.data?.body.pagination.total || 0,
        pageSize
      );

      if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
      }
    }
    
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("pageSize", pageSize.toString());
      
      // Update launchId parameter
      if (selectedLaunchId) {
        url.searchParams.set("launchId", selectedLaunchId.toString());
      } else {
        url.searchParams.delete("launchId");
      }
      
      window.history.replaceState({}, "", url.toString());
    }
  }, [page, pageSize, selectedLaunchId, launchesQuery]);

  // Handler for when a launch item is clicked
  const handleLaunchClick = (launch: LaunchEntity) => {
    setSelectedLaunchId(launch.id);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full border items-stretch"
    >
      <ResizablePanel
        autoSave="true"
        defaultValue={20}
        collapsible={false}
        minSize={25}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Launches</h1>
          </div>
          <Separator />
          <ScrollArea className="flex-1 overflow-hidden">
            {launchesQuery.isPending && <p className="p-4">Loading...</p>}
            {!launchesQuery.isPending &&
              launchesQuery.data?.body?.items.length === 0 && (
                <div className="flex items-center justify-center flex-grow">
                  <div className="text-center">
                    <p className="text-lg font-bold text-secondary-foreground">
                      No launches found
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting filters
                    </p>
                  </div>
                </div>
              )}
            {!launchesQuery.isPending &&
              launchesQuery.data?.body?.items != undefined &&
              launchesQuery.data?.body?.items.length > 0 && (
                <div className="flex flex-col gap-2 p-2">
                  {launchesQuery.data.body.items.map((launch) => (
                    <LaunchListItem
                      key={launch.id}
                      launch={launch}
                      selected={launch.id === selectedLaunchId}
                      onClick={() => handleLaunchClick(launch)}
                    />
                  ))}
                </div>
              )}
          </ScrollArea>
          <PaginationBlock
            page={page}
            pageSize={pageSize}
            totalItems={launchesQuery.data?.body.pagination.total!}
            setPage={setPage}
            setPageSize={setPageSize}
          ></PaginationBlock>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <StandaloneLaunchDetails />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export const LaunchesList = () => {
  return (
    <RestAPIProvider>
      <Internal />
    </RestAPIProvider>
  );
};