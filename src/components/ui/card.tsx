import { type ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string;
  footer?: ReactNode;
  className?: string;
}

export function Card({
  children,
  title,
  footer,
  className = '',
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm ${className}`}
    >
      {title && (
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}
