"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { contract } from "@total-report/core-contract/contract";
import { initQueryClient } from "@ts-rest/react-query";
import { useParams } from "next/navigation";

const client = initQueryClient(contract, {
  baseUrl: "http://localhost:3030",
  baseHeaders: {},
});

function Internal() {
  const params = useParams();
  const launchId = params.launchId;

  const { data, isLoading, error } = client.launchStatistics.useQuery(
    [`launches/${launchId}/statistics`],
    {
        params: {
            id: Number(launchId?.toString()),
        },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data!.status !== 200 || error) {
    return <div>Error</div>;
  }


  return (
    <div>
      <div className="container mx-auto flex flex-col gap-4 ">        
            <Card>
              <CardHeader>
                <CardTitle></CardTitle>
              </CardHeader>
              <CardContent>
                Before tests: {
                  drawStatuses(data!.body.beforeTests)
                }
              </CardContent>
              <CardContent>
                Tests: {
                  drawStatuses(data!.body.tests)
                }
              </CardContent>
              <CardContent>
                After tests: {
                  drawStatuses(data!.body.afterTests)
                }
              </CardContent>
            </Card>
          
      </div>
    </div>
  );
}

function drawStatuses(value: {
  statusGroupId: string | null;
  count: number;
}[]){
  return value.map((item) => (
    <div key={item.statusGroupId}>
      <p>{item.statusGroupId}</p>
      <p>{item.count}</p>
    </div>
  ));
}

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <Internal />
    </QueryClientProvider>
  );
}
