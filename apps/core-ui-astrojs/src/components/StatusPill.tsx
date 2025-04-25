import { cn } from "@/lib/utils";

export type StatusPillProps = {
  groupColor: string;
  statusColor: string;
  size?: 'sm' | 'md';
  className?: string;
};

export const StatusPill = ({
  groupColor,
  statusColor,
  size = 'sm',
  className
}: StatusPillProps) => {
  const sizeClasses = {
    sm: {
      container: "h-2",
      segment: "w-2"
    },
    md: {
      container: "h-3",
      segment: "w-3"
    }
  };

  return (
    <div 
      className={cn(
        "flex overflow-hidden rounded-full border border-muted-foreground",
        sizeClasses[size].container,
        className
      )}
    >
      {/* Left side (group color) */}
      <div 
        className={cn("h-full", sizeClasses[size].segment)}
        style={{ backgroundColor: groupColor }}
      ></div>
      {/* Right side (status color) */}
      <div 
        className={cn("h-full", sizeClasses[size].segment)}
        style={{ backgroundColor: statusColor }}
      ></div>
    </div>
  );
};