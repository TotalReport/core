import { useFindAfterTestSteps } from "@/hooks/api/after-test-steps/use-find-after-test-steps.js";
import { useFindBeforeTestSteps } from "@/hooks/api/before-test-steps/use-find-before-test-steps.js";
import { useFindTestSteps } from "@/hooks/api/test-steps/use-find-test-steps.js";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils.js";

type TestsDetailsStepsProps = {
  testId: number | undefined;
  // which set of steps to show: before | test | after
  testType: "before" | "test" | "after";
  className?: string;
};

export const TestDetailsSteps = ({ testId, testType, className }: TestsDetailsStepsProps) => {
  // Only call the hook relevant to the selected testType. The id uniquely identifies an entity in that namespace.
  const beforeQuery =
    testType === "before"
      ? useFindBeforeTestSteps({ enabled: testId != undefined, filters: { beforeTestId: testId ?? 0 } })
      : null;

  const testQuery =
    testType === "test"
      ? useFindTestSteps({ enabled: testId != undefined, filters: { testId: testId ?? 0 } })
      : null;

  const afterQuery =
    testType === "after"
      ? useFindAfterTestSteps({ enabled: testId != undefined, filters: { afterTestId: testId ?? 0 } })
      : null;

  // undefined case: testId not provided
  if (testId == undefined) {
    return (
      <div className={cn("text-muted-foreground text-sm", className)}>
        — / —
      </div>
    );
  }

  const query = testType === "before" ? beforeQuery : testType === "after" ? afterQuery : testQuery;

  const isLoading = Boolean(query?.isPending);
  const isError = Boolean(query?.isError);
  const hasData = Array.isArray(query?.data?.body);
  const count = hasData ? (query as any).data.body.length : 0;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Collapsible>
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-muted-foreground">
            Steps
            {isLoading ? (
              <span className="ml-2 inline-block">
                <Skeleton className="h-3 w-12" />
              </span>
            ) : !isError && hasData ? (
              // Only show count when query has data and is not loading or errored
              <span className="ml-2">({count})</span>
            ) : null}
          </h4>

          {isError ? (
            <div className="ml-3">
              <button
                onClick={() => (query as any)?.refetch()}
                className="text-xs flex items-center gap-1 text-error-foreground hover:brightness-200 focus:outline-none focus:ring-2 focus:ring-error-foreground focus:ring-offset-1 rounded transition-colors"
                title="Error loading steps. Click to retry."
              >
                Err.
                <span className="inline-block">↻</span>
              </button>
            </div>
          ) : (
            <CollapsibleTrigger>
              <Button variant="ghost" className="p-0">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          )}
        </div>

        {!isError && (
          <CollapsibleContent>
            {query == null ? (
              // If the hook was not initialized because id is undefined, show undefined placeholder
              <div className={cn("text-muted-foreground text-sm mt-1")}>— / —</div>
            ) : query.isPending ? (
              <div className="mt-1 flex items-center gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
            <ol className="list-decimal ml-4 mt-1">
                {query.data?.body?.length ? (
                  query.data.body.map((s: any) => (
                    <li key={s.id} className="text-sm mb-2">
                      <Collapsible>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "inline-block h-2 w-2 rounded-full",
                                s.isSuccessful ? "bg-step-successfull" : "bg-step-failed"
                              )}
                              aria-hidden
                            />
                            <CollapsibleTrigger>
                              <Button variant="ghost" className="p-0 text-sm font-medium">
                                {s.title}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <div className="text-xs text-muted-foreground">#{s.id}</div>
                        </div>

                        <CollapsibleContent>
                          <div className="text-xs text-muted-foreground mt-1">
                            <div>Thread: {s.thread ?? "-"}</div>
                            <div>Process: {s.process ?? "-"}</div>
                            <div>
                              Created: {s.createdTimestamp ? new Date(s.createdTimestamp).toLocaleString() : "-"}
                            </div>
                            <div>
                              Started: {s.startedTimestamp ? new Date(s.startedTimestamp).toLocaleString() : "-"}
                            </div>
                            <div>
                              Finished: {s.finishedTimestamp ? new Date(s.finishedTimestamp).toLocaleString() : "-"}
                            </div>
                            {s.errorMessage && (
                              <div className="text-xs text-error-foreground mt-1">Error: {s.errorMessage}</div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">No steps</li>
                )}
            </ol>
          )}
        </CollapsibleContent>
      )}
      </Collapsible>
    </div>
  );
};
