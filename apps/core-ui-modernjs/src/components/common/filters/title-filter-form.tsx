import { useState } from 'react';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Separator } from '@/components/ui/separator.js';
import { Search, ArrowLeft } from 'lucide-react';
import { FilterFormProps } from './types.js';

export const TitleFilterForm = ({ 
  onCancel, 
  onApply,
  initialValue,
  entityName = 'items',
  showHeader = true
}: FilterFormProps<string>) => {
  const [titleFilter, setTitleFilter] = useState<string>(initialValue || '');

  const handleApply = () => {
    onApply(titleFilter);
  };

  const handleClear = () => {
    setTitleFilter('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with entity name and back button - conditionally rendered */}
      {showHeader && (
        <>
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-xl font-bold capitalize">{entityName}</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator />
        </>
      )}
      
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filter by Title</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {titleFilter && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="w-full"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
};
