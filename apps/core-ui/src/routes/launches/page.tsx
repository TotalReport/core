import React, { useState } from "react";
import { RestAPIProvider } from "@/components/providers/rest-api-provider.jsx";
import LaunchDetails from "@/containers/launch-details/launch-details.jsx";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.jsx";
import LaunchesList from "@/components/launches/launches-list.jsx";
import { useUrlParams } from "@/hooks/url/use-url-params.jsx";

export const title = "Launches - Total Report";

function LaunchesPageContent() {
  const { getNumericParam, updateParams } = useUrlParams();
  const [selectedLaunchId, setSelectedLaunchId] = useState<number | undefined>(
    () => {
      return getNumericParam("launchId") || undefined;
    }
  );

  const handleLaunchSelect = (launchId: number) => {
    setSelectedLaunchId(launchId);
    updateParams({ launchId: launchId.toString() });
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full border rounded-md"
        >
          <ResizablePanel
            defaultSize={30}
            minSize={20}
            maxSize={50}
            collapsible={false}
          >
            <LaunchesList
              selectedLaunchId={selectedLaunchId}
              onLaunchSelect={handleLaunchSelect}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            {selectedLaunchId === undefined && (
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
            )}
            {selectedLaunchId !== undefined && (
              <LaunchDetails launchId={selectedLaunchId} />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default function LaunchesPage() {
  return (
    <RestAPIProvider>
      <LaunchesPageContent />
    </RestAPIProvider>
  );
}
