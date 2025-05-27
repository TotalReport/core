'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function PaginationBar({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = Math.min((page - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(page * pageSize, totalItems);
  
  const handlePrevPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      onPageSizeChange(newSize);
      // Adjust current page if needed
      const newTotalPages = Math.ceil(totalItems / newSize);
      if (page > newTotalPages) {
        onPageChange(newTotalPages);
      }
    }
  };

  return (
    <div className="flex items-center justify-between px-2 py-1 border-t">
      <div className="text-xs text-muted-foreground">
        {totalItems > 0 ? `${startItem}-${endItem} of ${totalItems}` : 'No items'}
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center text-xs">
          <span className="mr-2">Rows per page:</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="h-8 w-16 rounded-md border border-input bg-background px-2"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        
        <div className="flex">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={handlePrevPage}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <div className="flex h-8 items-center justify-center border-y px-3 text-xs">
            <span>{page} / {totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={handleNextPage}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}