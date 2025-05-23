import React, { useEffect, useState } from "react";
import { Input } from "./input";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useDebounce } from "@/lib/hooks/useDebounce";

export interface FilterInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  debounceMs?: number;
}

export function FilterInput({
  placeholder = "Filter by title...",
  value: externalValue = "",
  onChange,
  className,
  debounceMs = 300,
}: FilterInputProps) {
  const [value, setValue] = useState(externalValue);
  const debouncedValue = useDebounce(value, debounceMs);
  
  useEffect(() => {
    setValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const handleClear = () => {
    setValue("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full rounded-l-none p-0 px-2.5"
          onClick={handleClear}
        >
          <X className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </div>
  );
}