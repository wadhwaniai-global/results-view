import React from 'react';
import { cn } from '../utils/cn';

type ButtonVariant = 'glass' | 'primary' | 'secondary' | 'success' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
};

const variantClasses = {
  glass: 'btn-glass',
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  success: 'btn btn-success',
  danger: 'btn btn-danger',
};

const sizeClasses = {
  sm: 'px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm',
  md: 'px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base',
  lg: 'px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'glass',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="me-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ms-2">{icon}</span>}
    </button>
  );
};

export default Button;

