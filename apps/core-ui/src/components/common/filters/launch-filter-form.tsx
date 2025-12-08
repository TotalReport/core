import { useState } from 'react';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Separator } from '@/components/ui/separator.js';
import { Search, Check, ArrowLeft } from 'lucide-react';
import { useFindLaunches } from '@/hooks/api/launches/use-find-launches.js';
import { FilterFormProps, FilterOption } from './types.js';

export const LaunchFilterForm = ({ 
  onCancel, 
  onApply,
  initialValue,
  entityName = 'items',
  showHeader = true
}: FilterFormProps<FilterOption>) => {
  const [selectedLaunch, setSelectedLaunch] = useState<FilterOption | undefined>(initialValue);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch launches with search functionality
  const launchesQuery = useFindLaunches({
    pagination: { offset: 0, limit: 50 },
    filters: { titleContains: searchTerm || undefined }
  });

  const handleSelectLaunch = (launch: FilterOption) => {
    setSelectedLaunch(launch);
  };

  const handleClearSelection = () => {
    setSelectedLaunch(undefined);
  };

  const handleApply = () => {
    onApply(selectedLaunch);
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
        <h2 className="text-lg font-semibold mb-4">Filter by Launch</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search launches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {selectedLaunch && (
            <div className="p-3 border rounded-md bg-accent/30 border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Selected Launch</p>
                  <p className="text-xs text-muted-foreground">{selectedLaunch.title}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto space-y-2">
            {launchesQuery.isPending && (
              <div className="text-center text-muted-foreground text-sm py-4">
                Loading launches...
              </div>
            )}
            
            {launchesQuery.isError && (
              <div className="text-center text-destructive text-sm py-4">
                Error loading launches
              </div>
            )}

            {launchesQuery.data?.body?.items.map((launch) => (
              <div
                key={launch.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedLaunch?.id === launch.id
                    ? 'border-primary bg-accent/30'
                    : 'hover:bg-accent'
                }`}
                onClick={() => handleSelectLaunch({ id: launch.id, title: launch.title })}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{launch.title}</p>
                  {selectedLaunch?.id === launch.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}

            {launchesQuery.data?.body?.items.length === 0 && !launchesQuery.isPending && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No launches found
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
};
