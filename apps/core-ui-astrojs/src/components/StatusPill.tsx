import { cn } from "@/lib/utils";

export type StatusEntity = {
  id: string;
  name: string;
  color: string;
  createdTimestamp: String;
  group: {
    id: string;
    name: string;
    color: string;
    createdTimestamp: String;
  };
}

export type StatusPillProps = {
  status: StatusEntity;
  size?: 'sm' | 'md';
  className?: string;
};

export const StatusPill = ({
  status: { group: { color: groupColor }, color: statusColor },
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