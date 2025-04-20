"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contract } from "@total-report/core-contract/contract";
import { initQueryClient } from "@ts-rest/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { PaginationBlock } from "@/components/pagination-block";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { totalPagesCount } from "@/lib/pagination-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ClientInferResponseBody } from "@ts-rest/core";

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
  const router = useRouter();

  useEffect(() => {
    router.replace(`?page=${page}&pageSize=${pageSize}`);
  }, [router, page, pageSize]);

  if (page < 1) {
    setPage(1);
  }

  if (pageSize < 1) {
    setPageSize(10);
  }

  const { data, isLoading, error } = client.findReports.useQuery(
    [`reports?page=${page}&pageSize=${pageSize}`],
    {
      query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
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
      <header className="text-black p-4">
        <h1 className="text-2xl font-bold">Reports</h1>
      </header>
      <div className="container mx-auto flex flex-col gap-4 ">
        {data!.body.items.map((report) => (
          <ReportRow key={report.id} report={report} />
        ))}
      </div>

      <Separator />
        <PaginationBlock
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          setPage={setPage}
          setPageSize={setPageSize}
          getHref={(page, pageSize) => `?page=${page}&pageSize=${pageSize}`}
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

type FindReportsResponse = ClientInferResponseBody<
  typeof contract.findReports,
  200
>;
type Report = FindReportsResponse["items"][0];

function ReportRow({ report }: { report: Report }) {
  const { data: launchesCountData } = client.findLaunchesCount.useQuery(
    [`launchesCount?reportId=${report.id}`],
    {
      query: {
        reportId: report.id,
      },
    }
  );

  const launchesCount = launchesCountData?.body.count || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{report.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Link className={buttonVariants({ variant: "ghost" })} href={`/launches?reportId=${report.id}&page=1`}>
          Launches ({launchesCount})
        </Link>
        Created: {new Date(report.createdTimestamp).toString()}
      </CardContent>
    </Card>
  );
}
