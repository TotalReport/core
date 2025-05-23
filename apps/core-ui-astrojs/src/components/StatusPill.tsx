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

// Helper function to create checkerboard pattern for undefined colors
const getColorBackground = (color?: string | null) => {
  if (!color) {
    return {
      backgroundImage: `
        linear-gradient(45deg, #ccc 25%, transparent 26%), 
        linear-gradient(-45deg, #ccc 25%, transparent 26%),
        linear-gradient(45deg, transparent 74%, #ccc 75%),
        linear-gradient(-45deg, transparent 74%, #ccc 75%)
      `,
      backgroundSize: '8px 8px',
      backgroundPosition: '1px 1px, 1px 5px, 5px -3px, -3px 0px',
      backgroundColor: '#e9e9e9'
    };
  }
  return { backgroundColor: color };
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

  // If either color is undefined, use the checkerboard pattern for both segments
  const useCheckerboard = !groupColor || !statusColor;
  const checkerboardStyle = getColorBackground(null);

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
        style={useCheckerboard ? checkerboardStyle : getColorBackground(groupColor)}
      ></div>
      {/* Right side (status color) */}
      <div 
        className={cn("h-full", sizeClasses[size].segment)}
        style={useCheckerboard ? checkerboardStyle : getColorBackground(statusColor)}
      ></div>
    </div>
  );
};