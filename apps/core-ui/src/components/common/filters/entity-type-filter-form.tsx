import { useState } from 'react';
import { Button } from '@/components/ui/button.js';
import { FilterFormProps } from './types.js';
import { cn } from '@/lib/utils.js';

// Entity type definitions for test entities
export const ENTITY_TYPES = [
  { value: 'beforeTest', label: 'Before Tests', description: 'Setup/preparation steps before test execution' },
  { value: 'test', label: 'Tests', description: 'Main test execution steps' },
  { value: 'afterTest', label: 'After Tests', description: 'Cleanup/teardown steps after test execution' },
] as const;

interface EntityTypeFilterFormProps extends FilterFormProps<string[]> {
  // Additional props specific to entity type filter if needed
}

export function EntityTypeFilterForm({
  onCancel,
  onApply,
  initialValue = [],
  entityName = 'tests',
  showHeader = true,
}: EntityTypeFilterFormProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialValue);

  const handleTypeToggle = (entityType: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(entityType)) {
        return prev.filter(type => type !== entityType);
      } else {
        return [...prev, entityType];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedTypes(ENTITY_TYPES.map(type => type.value));
  };

  const handleClearAll = () => {
    setSelectedTypes([]);
  };

  const handleApply = () => {
    onApply(selectedTypes.length > 0 ? selectedTypes : undefined);
  };

  const allSelected = selectedTypes.length === ENTITY_TYPES.length;
  const noneSelected = selectedTypes.length === 0;

  return (
    <div className="space-y-6">
      {showHeader && (
        <div>
          <h3 className="text-lg font-semibold">Filter {entityName} by entity type</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select the types of test entities to display
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Select All / Clear All controls */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={allSelected}
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={noneSelected}
          >
            Clear All
          </Button>
        </div>

        {/* Entity type toggle buttons */}
        <div className="space-y-3">
          {ENTITY_TYPES.map((entityType) => (
            <div
              key={entityType.value}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-colors",
                selectedTypes.includes(entityType.value)
                  ? "bg-primary/10 border-primary"
                  : "bg-background border-border hover:bg-muted/50"
              )}
              onClick={() => handleTypeToggle(entityType.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{entityType.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {entityType.description}
                  </div>
                </div>
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center",
                  selectedTypes.includes(entityType.value)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground"
                )}>
                  {selectedTypes.includes(entityType.value) && (
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected count */}
        <div className="text-sm text-muted-foreground">
          {selectedTypes.length === 0 
            ? 'No entity types selected (all will be shown)'
            : `${selectedTypes.length} of ${ENTITY_TYPES.length} entity types selected`
          }
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleApply}>
          Apply Filter
        </Button>
      </div>
    </div>
  );
}
