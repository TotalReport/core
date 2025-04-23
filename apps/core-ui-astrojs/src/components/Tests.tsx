import { tsr } from "@/lib/react-query";
import { RestAPIProvider } from "./RestAPIProvider";
import { TestListItem } from "./tests-list-item";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { Separator } from "./ui/separator";

const Internal = () => {
  const tsrQueryClient = tsr.useQueryClient();

  const { data, isPending } = tsr.findTestEntities.useQuery({
    queryKey: ["findTestEntities"],
  });
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full border items-stretch"
    >
      <ResizablePanel
        autoSave="true"
        defaultValue={20}
        collapsible={false}
        minSize={15}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Tests</h1>
          </div>
          <Separator />
          {isPending && <p className="p-4">Loading...</p>}
          {!isPending && data?.body?.items.length === 0 && (
            <div className="flex items-center justify-center flex-grow">
              <div className="text-center">
                <p className="text-lg font-bold text-secondary-foreground">
                  No tests found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting filters
                </p>
              </div>
            </div>
          )}
          {!isPending &&
            data?.body?.items != undefined &&
            data?.body?.items.length > 0 && (
              <div className="flex flex-col gap-2 p-2">
                {data.body.items.map((test) => (
                  <TestListItem entity={test} selected={false} />
                ))}
              </div>
            )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel></ResizablePanel>
    </ResizablePanelGroup>
  );
};

export const TestsList = () => {
  return (
    <RestAPIProvider>
      <Internal />
    </RestAPIProvider>
  );
};
