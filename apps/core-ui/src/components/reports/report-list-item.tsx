/**
 * Component that displays a single report item in the list
 */

import { format } from 'date-fns';
import { cn } from '@/lib/utils.js';
import { ReportEntity } from '@/hooks/api/reports/use-find-reports.js';

interface ReportListItemProps {
  report: ReportEntity;
  isSelected: boolean;
  onClick: () => void;
}

export const ReportListItem: React.FC<ReportListItemProps> = ({
  report,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors',
        isSelected ? 'bg-muted' : ''
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium truncate">{report.title}</h3>
      </div>
      
      <div className="mt-1 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>
            {report.createdTimestamp
              ? format(new Date(report.createdTimestamp), 'MMM dd, yyyy')
              : 'Unknown date'}
          </span>
        </div>
      </div>
    </div>
  );
};
