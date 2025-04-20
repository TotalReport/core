import React, { useState, useEffect } from "react";
import { PaginationBlock } from "./pagination-block";
import { Input } from "./ui/input";
import { contract } from "@total-report/core-contract/contract";
import { initQueryClient } from "@ts-rest/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClientInferResponseBody } from "@ts-rest/core";

const client = initQueryClient(contract, {
  baseUrl: "http://localhost:3030",
  baseHeaders: {},
});

interface FindLaunchProps {
  onSelect: (launch: Launch) => void;
  onClose: () => void;
}

const InternalFindLaunch: React.FC<FindLaunchProps> = ({ onSelect, onClose }) => {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = client.findLaunches.useQuery(
    [`launches?page=${page}&pageSize=${pageSize}&filter=${filter}`],
    {
      query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        "title~cnt": filter,
      },
    }
  );

  useEffect(() => {
    if (page < 1) setPage(1);
    if (pageSize < 1) setPageSize(10);
  }, [page, pageSize]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data!.status !== 200 || error) {
    return <div>Error</div>;
  }

  const pagination = data!.body.pagination;
  const totalItems = pagination.total;
  const launches = data!.body.items;

  return (
    <div>
      <button onClick={onClose}>Close</button>
      <Input
        type="text"
        placeholder="Filter by title"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {launches.map((launch) => (
          <li key={launch.id} onClick={() => { onSelect(launch); onClose(); }}>
            {launch.title}
          </li>
        ))}
      </ul>
      <PaginationBlock
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        setPage={setPage}
        setPageSize={setPageSize}
      />
    </div>
  );
};

const queryClient = new QueryClient();

export const FindLaunch: React.FC<FindLaunchProps> = (props) => (
  <QueryClientProvider client={queryClient}>
    <InternalFindLaunch {...props} />
  </QueryClientProvider>
);

type FindLaunchesResponse = ClientInferResponseBody<
  typeof contract.findLaunches,
  200
>;
type Launch = FindLaunchesResponse["items"][0];
