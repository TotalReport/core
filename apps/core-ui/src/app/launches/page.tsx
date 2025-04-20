"use client";

import { PaginationBlock } from "@/components/pagination-block";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { totalPagesCount } from "@/lib/pagination-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";
import { initQueryClient } from "@ts-rest/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const reportId = searchParams.get("reportId") ? Number(searchParams.get("reportId")) : undefined;
  const router = useRouter();

  useEffect(() => {
    router.replace(`?page=${page}&pageSize=${pageSize}${reportId ? `&reportId=${reportId}` : ''}`);
  }, [router, page, pageSize, reportId]);

  if (page < 1) {
    setPage(1);
  }

  if (pageSize < 1) {
    setPageSize(10);
  }

  const { data, isLoading, error } = client.findLaunches.useQuery(
    [`launches?page=${page}&pageSize=${pageSize}${reportId ? `&reportId=${reportId}` : ''}`],
    {
      query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        reportId,
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
    <div className="min-h-screen bg-gray-50">
      <div className="container bg-white max-w-7xl mx-auto flex flex-col gap-4 ">
        {getTableBody(data!.body.items)}
        <Separator />
        <PaginationBlock
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          setPage={setPage}
          setPageSize={setPageSize}
          getHref={(page, pageSize) => `?page=${page}&pageSize=${pageSize}${reportId ? `&reportId=${reportId}` : ''}`}
        />
      </div>
    </div>
  );
}

function getTableBody(launches: Launch[]) {
  if (launches == null || launches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg font-semibold text-gray-700">No data available</p>
        <p className="text-gray-500">
          Please adjust your filters or try again later.
        </p>
      </div>
    );
  }
  return launches.map((report) => {
    return (
      <Card key={report.id}>
        <CardHeader>
          <CardTitle>{report.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href={`/launches/${report.id}/overview`}
          >
            Overview
          </Link>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href={`/tests?launchId=${report.id}&page=1`}
          >
            Tests
          </Link>
          Created: {new Date(report.createdTimestamp).toString()}
        </CardContent>
      </Card>
    );
  });
}

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <Internal />
    </QueryClientProvider>
  );
}

type FindLaunchesResponse = ClientInferResponseBody<
  typeof contract.findLaunches,
  200
>;
type Launch = FindLaunchesResponse["items"][0];
