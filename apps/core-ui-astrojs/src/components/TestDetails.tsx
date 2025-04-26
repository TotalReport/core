import { StatusPill } from "./StatusPill";
import { type Entity } from "./tests-list-item";

interface TestDetailsProps {
  test: Entity | null;
}

export const TestDetails = ({ test }: TestDetailsProps) => {
  if (!test) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            Select a test to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold">{test.title}</h2>
          {test.status && (
            <div className="mt-2 flex items-center">
              <StatusPill 
                status={test.status}
                size="md"
              />
              <span className="ml-2 text-sm font-medium">
                {test.status.name} ({test.status.group.name})
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">ID</p>
            <p className="font-medium">{test.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{test.entityType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">
              {new Date(test.createdTimestamp).toLocaleString()}
            </p>
          </div>
          {test.startedTimestamp && (
            <div>
              <p className="text-muted-foreground">Started</p>
              <p className="font-medium">
                {new Date(test.startedTimestamp).toLocaleString()}
              </p>
            </div>
          )}
          {test.finishedTimestamp && (
            <div>
              <p className="text-muted-foreground">Finished</p>
              <p className="font-medium">
                {new Date(test.finishedTimestamp).toLocaleString()}
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
      </div>
    </div>
  );
};
