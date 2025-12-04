import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { cn } from '../utils/cn';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actionButtons?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionButtons,
  rightContent,
  className,
}) => {
  return (
    <Card className={cn('mb-3 sm:mb-4', className)}>
      <div className="row align-items-center">
        <div className="col-12 col-md-8 mb-2 mb-md-0">
          <h1 className="h4 sm:h3 fw-bold text-dark mb-1 sm:mb-2">{title}</h1>
          {subtitle && <p className="text-secondary mb-0 text-sm sm:text-base">{subtitle}</p>}
        </div>
        {(actionButtons || rightContent) && (
          <div className="col-12 col-md-4 text-start text-md-end mt-2 mt-md-0">
            {actionButtons && (
              <div className="d-flex flex-column sm:flex-row gap-2 justify-content-md-end flex-wrap">
                {actionButtons}
              </div>
            )}
            {rightContent && <div className="mt-2 sm:mt-0">{rightContent}</div>}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PageHeader;

