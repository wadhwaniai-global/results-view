import React from 'react';
import { cn } from '../utils/cn';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
};

const paddingClasses = {
  sm: 'p-2 sm:p-3',
  md: 'p-3 sm:p-4',
  lg: 'p-4 sm:p-6',
};

export const Card: React.FC<CardProps> = ({ children, className, padding = 'md' }) => {
  return (
    <div className={cn('glass-card', paddingClasses[padding], className)}>
      {children}
    </div>
  );
};

export default Card;

