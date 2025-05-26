import { getStatusBackground } from "@/lib/test-statistics-utils";

export type StatusDotProps = {
  color?: string | null;
  size?: string;
  title?: string;
};

export const StatusDot = ({
  color,
  size = "w-3 h-3",
  title,
}: StatusDotProps) => (
  <div
    className={`rounded-full mr-1 ${size}`}
    style={getStatusBackground(color)}
    title={title}
  ></div>
);
