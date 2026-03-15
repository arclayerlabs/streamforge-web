import { type ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'gold' | 'silver' | 'bronze';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-semibold';

  const variantClasses = {
    default:
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    success:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    gold:
      'bg-yellow-400 text-yellow-900 dark:bg-yellow-500 dark:text-yellow-100',
    silver:
      'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200',
    bronze:
      'bg-orange-300 text-orange-900 dark:bg-orange-700 dark:text-orange-100',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
