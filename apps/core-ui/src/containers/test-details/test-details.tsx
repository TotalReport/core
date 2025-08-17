import { Button } from "@/components/ui/button.jsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx";
import { Separator } from "@/components/ui/separator.js";
import { useReadAfterTest } from "@/hooks/api/after-tests/use-read-after-test.js";
import { useReadBeforeTest } from "@/hooks/api/before-tests/use-read-before-test.js";
import { useReadTest } from "@/hooks/api/tests/use-read-test.js";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import { TestDetailsStatus } from "./test-details-status.jsx";

type TestDetailsProps = {
  entityType: "beforeTest" | "test" | "afterTest";
  entityId: number;
};

export const TestDetails = ({ entityType, entityId }: TestDetailsProps) => {
  const testQuery = useReadTest({
    enabled: entityType == "test",
    testId: entityId,
  });

  const beforeTestQuery = useReadBeforeTest({
    enabled: entityType == "beforeTest",
    beforeTestId: entityId,
  });

  const afterTestQuery = useReadAfterTest({
    enabled: entityType == "afterTest",
    afterTestId: entityId,
  });

  // Determine current query and data
  const getCurrentQuery = () => {
    switch (entityType) {
      case "test":
        return testQuery;
      case "beforeTest":
        return beforeTestQuery;
      case "afterTest":
        return afterTestQuery;
    }
  };

  const currentQuery = getCurrentQuery();

  if (currentQuery.isPending) {
    return <Skeleton></Skeleton>;
  }

  if (currentQuery.isError) {
    return <div>Error while loading data</div>;
  }

  const test = currentQuery.data;

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold">{test.title}</h2>
          <TestDetailsStatus statusId={test.statusId} />
        </div>

        <Separator />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">ID</p>
            <p className="font-medium">{test.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{entityTypeToText(entityType)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">
              {format(new Date(test.createdTimestamp), "PPpp")}
            </p>
          </div>
          {test.startedTimestamp && (
            <div>
              <p className="text-muted-foreground">Started</p>
              <p className="font-medium">
                {format(new Date(test.startedTimestamp), "PPpp")}
              </p>
            </div>
          )}
          {test.finishedTimestamp && (
            <div>
              <p className="text-muted-foreground">Finished</p>
              <p className="font-medium">
                {format(new Date(test.finishedTimestamp), "PPpp")}
              </p>
            </div>
          )}
          {test.correlationId && (
            <div>
              <p className="text-muted-foreground">Correlation ID</p>
              <p className="font-medium">{test.correlationId}</p>
            </div>
          )}
        </div>

        {test.argumentsHash && (
          <div>
            <p className="text-muted-foreground">Arguments Hash</p>
            <p className="font-mono text-xs bg-muted p-2 rounded mt-1 overflow-auto">
              {test.argumentsHash}
            </p>
          </div>
        )}
        {renderArguments(test?.arguments || [])}
      </div>
    </div>
  );
};

const entityTypeToText = (entityType: "beforeTest" | "test" | "afterTest") => {
  switch (entityType) {
    case "beforeTest":
      return "Before Test";
    case "test":
      return "Test";
    case "afterTest":
      return "After Test";
  }
};

const renderArguments = (testArguments: TestArgument[]) => {
  return (
    <Collapsible>
      <p className="text-muted-foreground">
        Arguments ({renderArgumentsCount(testArguments?.length)})
        <CollapsibleTrigger>
          <Button variant="ghost" className="w-full justify-start">
            <ChevronDown className="mr-2 h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </p>

      <CollapsibleContent>
        <p className="font-mono text-xs bg-muted p-2 rounded mt-1 overflow-auto">
          {testArguments.map((argument) => {
            return (
              <div key={argument.id} className="mb-2">
                <p>
                  <span className="text-muted-foreground">Argument </span>
                  <span className="text-foreground">{argument.name}</span>{" "}
                  <span className="text-muted-foreground">of type</span>{" "}
                  <span className="text-foreground">{argument.type}</span>
                  <span className="text-muted-foreground"> has value </span>
                  <span className="text-foreground">{argument.value}</span>
                </p>
              </div>
            );
          })}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};

const renderArgumentsCount = (count: number | undefined) => {
  if (count === undefined || count === 0) return "No Arguments";
  return `${count}`;
};

type TestArgument = {
  id: number;
  name: string;
  type: string;
  value: string | null;
};
