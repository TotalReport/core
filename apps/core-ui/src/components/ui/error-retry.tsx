import React from "react";
import { cn } from "@/lib/utils.js";

type ErrorRetryProps = {
  onRetry: () => void;
  title?: string;
  label?: React.ReactNode;
  className?: string;
};

export const ErrorRetry = ({ onRetry, title = "Error. Click to retry.", label = "Error", className = ""}: ErrorRetryProps) => {
  const baseClassName = "text-sm flex items-center gap-1 text-error-foreground hover:brightness-200 focus:outline-none focus:ring-2 focus:ring-error-foreground focus:ring-offset-1 rounded transition-colors";
  return (
    <button onClick={onRetry} title={title} className={cn(baseClassName, className)}>
      {label}
      <span className="inline-block">↻</span>
    </button>
  );
};

export default ErrorRetry;

