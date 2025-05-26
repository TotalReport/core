import React, { useEffect, useState } from "react";
import { Input } from "./input";

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

  useEffect(() => {
    if (min !== undefined && value < min) {
      setValue(min);
    }
    if (max !== undefined && value > max) {
      setValue(max);
    }
  }, [min, max, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      if (min !== undefined && value < min) {
        setValue(min);
        onSubmit(min);
      } else if (max !== undefined && value > max) {
        setValue(max);
        onSubmit(max);
      } else {
        onSubmit(value);
      }
    }
  };

  const isDisabled = min !== undefined && max !== undefined && min === max;

  return (
    <div className="text-nowrap content-center">
      {isEditing && !isDisabled ? (
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setIsEditing(false);
            if (min !== undefined && value < min) {
              setValue(min);
              onSubmit(min);
            } else if (max !== undefined && value > max) {
              setValue(max);
              onSubmit(max);
            } else {
              onSubmit(value);
            }
          }}
          autoFocus
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
