import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";
import { EditableNumber } from "./ui/editable-number";
import { cn } from "@/lib/utils";
import { totalPagesCount } from "@/lib/pagination-utils";

export interface PaginationBlockProps {
  getHref?: (page: number, pageSize: number) => string;
  page: number;
  pageSize: number;
  totalItems: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export function PaginationBlock({
  page,
  pageSize,
  totalItems,
  setPage,
  setPageSize,
  getHref,
}: PaginationBlockProps) {
  const totalPages = totalPagesCount(totalItems, pageSize);
  const startItem = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-row justify-between items-center m-2 mx-4">
      {totalItems > 0 && (
        <div className="flex flex-row">
          <span className="text-gray-500">
            {startItem} - {endItem} of {totalItems}
          </span>
        </div>
      )}

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {getHref ? (
                <PaginationLink
                  href={getHref(page - 1, pageSize)}
                  className={cn({
                    "pointer-events-none text-gray-400": page <= 1,
                  })}
                >
                  <ChevronLeft className="h-4 w-4" />
                </PaginationLink>
              ) : (
                <PaginationLink
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={cn({
                    "pointer-events-none text-gray-400": page <= 1,
                  })}
                >
                  <ChevronLeft className="h-4 w-4" />
                </PaginationLink>
              )}
            </PaginationItem>

            <EditableNumber
              value={page}
              min={1}
              max={totalPages}
              onSubmit={(value) => {
                setPage(Number(value));
              }}
            />

            <PaginationItem>
              {getHref ? (
                <PaginationLink
                  href={getHref(page + 1, pageSize)}
                  className={cn({
                    "pointer-events-none text-gray-400": page >= totalPages,
                  })}
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationLink>
              ) : (
                <PaginationLink
                  onClick={() => page < totalPages && setPage(page + 1)}
                  className={cn({
                    "pointer-events-none text-gray-400": page >= totalPages,
                  })}
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationLink>
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="flex flex-row ml-auto">
        <EditableNumber
          min={1}
          max={100}
          value={pageSize}
          onSubmit={(value) => {
            setPageSize(Number(value));
          }}
        />
        <span className="text-nowrap content-center text-gray-500">
          &nbsp;per page
        </span>
      </div>
    </div>
  );
}
