import { useState } from 'react';
import { Input } from '@/components/ui/input.js';
import { Button } from '@/components/ui/button.js';
import { Search } from 'lucide-react';

export type TestFilters = {
  titleFilter: string;
};

type TestFilterProps = {
  onFilterChange: (filters: TestFilters) => void;
  initialFilters?: TestFilters;
};

export const TestFilter = ({ onFilterChange, initialFilters }: TestFilterProps) => {
  const [titleFilter, setTitleFilter] = useState(initialFilters?.titleFilter || '');

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ titleFilter });
  };

  const handleClearFilters = () => {
    setTitleFilter('');
    onFilterChange({ titleFilter: '' });
  };

  return (
    <form onSubmit={handleFilterSubmit} className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tests..."
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Search
        </Button>
        {titleFilter && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        )}
      </div>
    </form>
  );
};
