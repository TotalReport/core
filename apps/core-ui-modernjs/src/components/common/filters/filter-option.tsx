
interface FilterOptionProps {
  title: string;
  description: string;
  onClick: () => void;
}

export const FilterOption = ({ title, description, onClick }: FilterOptionProps) => {
  return (
    <div 
      className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
};
