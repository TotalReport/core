import React from "react";
import { RestAPIProvider } from "@/components/providers/rest-api-provider.jsx";
import { TestsListBlock } from "@/containers/tests-list/tests-list-block.jsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.jsx";
import { TestDetails } from "@/containers/test-details/test-details.jsx";
import { useUrlParams } from "@/hooks/url/use-url-params.jsx";
import TestsUrlParams from "@/types/tests-url-params.js";

export const title = "Tests - Total Report";

function TestsPageContent() {
  const { useParams } = useUrlParams();

  const { urlParams, setUrlParams } = useParams<TestsUrlParams>({
    page: { defaultValue: 1, constraintFn: (v) => Math.max(1, v) },
    pageSize: { defaultValue: 10, constraintFn: (v) => Math.max(1, v) },
    "title~cnt": { defaultValue: undefined },
    launchId: { defaultValue: undefined },
    entityTypes: { defaultValue: undefined },
    testId: { defaultValue: undefined },
    beforeTestId: { defaultValue: undefined },
    afterTestId: { defaultValue: undefined },
  });

  const { page, pageSize } = urlParams;

  // Build filters object expected by TestsListBlock
  const filters = {
    "title~cnt": urlParams["title~cnt"],
    launchId: urlParams.launchId,
    entityTypes: urlParams.entityTypes
      ? (urlParams.entityTypes.split(",") as (
          | "beforeTest"
          | "test"
          | "afterTest"
        )[])
      : undefined,
  };

  // Resolve selected test from URL params
  const selectedTest = urlParams.testId
    ? { id: urlParams.testId, type: "test" as const }
    : urlParams.beforeTestId
      ? { id: urlParams.beforeTestId, type: "beforeTest" as const }
      : urlParams.afterTestId
        ? { id: urlParams.afterTestId, type: "afterTest" as const }
        : undefined;

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
            <TestsListBlock
              pagination={{
                page,
                pageSize,
                setPage: (p) => setUrlParams({ page: p }),
                setPageSize: (s) => setUrlParams({ pageSize: s }),
              }}
              filters={filters}
              onFiltersChange={(v) => {
                const next: Record<string, any> = { ...v };
                if (v.entityTypes) next.entityTypes = v.entityTypes.join(",");
                setUrlParams(next);
              }}
              selection={{
                selectedId: selectedTest ? selectedTest.id : null,
                onSelect: (sel) => {
                  if (sel.type === "test")
                    setUrlParams({
                      testId: sel.id,
                      beforeTestId: undefined,
                      afterTestId: undefined,
                    });
                  if (sel.type === "beforeTest")
                    setUrlParams({
                      beforeTestId: sel.id,
                      testId: undefined,
                      afterTestId: undefined,
                    });
                  if (sel.type === "afterTest")
                    setUrlParams({
                      afterTestId: sel.id,
                      testId: undefined,
                      beforeTestId: undefined,
                    });
                },
              }}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            {selectedTest === undefined && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold text-secondary-foreground">
                    No test selected
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a test from the list to view details
                  </p>
                </div>
              </div>
            )}

            {selectedTest !== undefined && (
              <TestDetails entityId={selectedTest.id} />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default function TestsPage() {
  return (
    <RestAPIProvider>
      <TestsPageContent />
    </RestAPIProvider>
  );
}
