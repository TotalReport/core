import React, { useEffect, useState } from "react";
import { Input } from "./input.js";

export interface EditableNumberProps {
  value: number;
  onSubmit: (newValue: number) => void;
  min?: number;
  max?: number;
}

export function EditableNumber({
  value: initialValue,
  onSubmit,
  min,
  max,
}: EditableNumberProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(Math.round(newValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSubmit(value);
    }
  };

  const isDisabled = min !== undefined && max !== undefined && min === max;

  return (
    <div className="text-nowrap content-center">
      {isEditing && !isDisabled ? (
        <Input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setIsEditing(false);
            onSubmit(value);
          }}
          
          autoFocus
          step={1}
          pattern="[0-9]*"
          className="w-24 p-2 border border-foreground rounded-md"
        />
      ) : (
        <span
          onClick={() => !isDisabled && setIsEditing(true)}
          className={
            isDisabled
              ? "text-muted-foreground"
              : "text-accent-foreground cursor-pointer"
          }
        >
          {value}
        </span>
      )}
    </div>
  );
}
