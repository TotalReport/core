import { useState } from 'react';
import { useUrlParams } from '@/hooks/url/use-url-params.jsx';
import LaunchesList from '@/components/launches/launches-list.js';
import LaunchDetails from '@/containers/launches/launch-details.jsx';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable.js';

function LaunchesContainer() {
  // Track selected launch ID from URL params
  const { getNumericParam, updateParams } = useUrlParams();
  const [selectedLaunchId, setSelectedLaunchId] = useState<number | null>(
    () => {
      return getNumericParam('launchId') || null;
    }
  );

  // Handle launch selection
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
            <LaunchDetails launchId={selectedLaunchId} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default LaunchesContainer;
