'use client';

import { Input } from '@/components/ui/input';
import { X, Search } from 'lucide-react';
import { Button } from './button';

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export function FilterInput({
  value,
  onChange,
  onClear,
  className,
  placeholder,
  ...props
}: FilterInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        className={`pl-9 pr-9 ${className}`}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        {...props}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-7 w-7 p-0"
          onClick={handleClear}
          type="button"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </div>
  );
}