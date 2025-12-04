import React from 'react';
import { getWordTypeColor, getWordTypeColorAlpha } from '../constants/design';
import { cn } from '../utils/cn';

type WordType = 'correct' | 'missed' | 'extra' | 'incorrect';

type ErrorBadgeProps = {
  type: WordType;
  children?: React.ReactNode;
  className?: string;
};

export const ErrorBadge: React.FC<ErrorBadgeProps> = ({
  type,
  children,
  className,
}) => {
  const backgroundColor = getWordTypeColorAlpha(type);
  
  return (
    <span
      className={cn('error-badge', className)}
      style={{
        background: backgroundColor,
        color: '#1d1d1f',
      }}
    >
      {children || type}
    </span>
  );
};

export default ErrorBadge;

