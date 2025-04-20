"use client";

import { contract } from "@total-report/core-contract/contract";
import { initQueryClient } from "@ts-rest/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { FindLaunch } from "@/components/find-launch";
import { PaginationBlock } from "@/components/pagination-block";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { totalPagesCount } from "@/lib/pagination-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
// import Link from "next/link";
// import { buttonVariants } from "@/components/ui/button"

const client = initQueryClient(contract, {
  baseUrl: "http://localhost:3030",
  baseHeaders: {},
});

function Internal() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")));
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("pageSize"))
  );
  const [launchId, setLaunchId] = useState(
    Number(searchParams.get("launchId"))
  );
  const [isFindLaunchOpen, setIsFindLaunchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const launchIdQueryParam = launchId ? `&launchId=${launchId}` : "";
    router.replace(`?page=${page}&pageSize=${pageSize}${launchIdQueryParam}`);
  }, [router, page, pageSize, launchId]);

  if (page < 1) {
    setPage(1);
  }

  if (pageSize < 1) {
    setPageSize(10);
  }

  const launchIdQueryParam = launchId ? `&launchId=${launchId}` : "";
  const { data, isLoading, error } = client.findTestEntities.useQuery(
    [`tests?page=${page}&pageSize=${pageSize}${launchIdQueryParam}`],
    {
      query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        ...(launchId && { launchId }),
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data!.status !== 200 || error) {
    return <div>Error</div>;
  }

  const pagination = data!.body.pagination;
  const totalItems = pagination.total;
  const totalPages = totalPagesCount(totalItems, pageSize);
  if (page > totalPages) {
    setPage(totalPages);
  }

  return (
    <div>
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Test Entities</h1>
        </div>
        <div>
        Launch: <Button variant={"link"} className="text-blue-700" onClick={() => setIsFindLaunchOpen(!isFindLaunchOpen)}>Not set</Button>
        </div>
        {isFindLaunchOpen && (
            <FindLaunch
              onSelect={(launch) => setLaunchId(launch.id)}
              onClose={() => setIsFindLaunchOpen(false)}
            />
          )}
        {data!.body.items.length === 0 ? (
          <div>No tests found.</div>
        ) : (
          data!.body.items.map((report) => {
            return (
              <div className="" key={report.id}>
                <div>
                  <h4>{report.title}</h4>
                </div>
                <div>
                  {/* <Link className={buttonVariants({variant: "ghost"})} href={`/launches?reportId=${report.id}&page=1`}>Launches</Link> */}
                  Created: {new Date(report.createdTimestamp).toString()}
                  &nbsp;|&nbsp; Status: {report.statusId}
                </div>
                <Separator />
              </div>
              
            );
          })
        )}
      </div>

      <Separator />
      <PaginationBlock
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        setPage={setPage}
        setPageSize={setPageSize}
        getHref={(page, pageSize) =>
          `?page=${page}&pageSize=${pageSize}${launchId ? `&launchId=${launchId}` : ""}`
        }
      />
    </div>
  );
}

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <Internal />
    </QueryClientProvider>
  );
}
