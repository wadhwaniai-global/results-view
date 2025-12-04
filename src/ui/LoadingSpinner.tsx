import React from 'react';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
};

const sizeClasses = {
  sm: 'spinner-border-sm',
  md: '',
  lg: 'spinner-border-lg',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text,
}) => {
  return (
    <div className={`text-center py-5 ${className}`}>
      <div className={`spinner-border text-secondary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <div className="mt-3 text-secondary">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;

