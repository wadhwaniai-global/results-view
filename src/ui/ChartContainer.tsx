import React from 'react';
import { Card } from './Card';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '../utils/cn';

type ChartContainerProps = {
  title?: string;
  height?: string | number;
  children: React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  headerActions?: React.ReactNode;
  className?: string;
};

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  height = '300px',
  children,
  loading = false,
  emptyMessage = 'No data available',
  headerActions,
  className,
}) => {
  const heightValue = typeof height === 'number' ? height : parseInt(height);
  const mobileHeight = Math.min(heightValue, 250);
  const desktopHeight = heightValue;

  return (
    <Card className={cn(className)}>
      {title && (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 sm:mb-4 gap-2">
          <h2 className="h5 sm:h4 fw-bold text-dark mb-0">{title}</h2>
          {headerActions && <div className="w-100 w-sm-auto">{headerActions}</div>}
        </div>
      )}
      <div style={{ height: `clamp(${mobileHeight}px, 30vh, ${desktopHeight}px)` }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          children || <div className="text-center py-3 sm:py-4 text-secondary text-sm sm:text-base">{emptyMessage}</div>
        )}
      </div>
    </Card>
  );
};

export default ChartContainer;

