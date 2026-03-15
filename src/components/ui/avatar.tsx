import React, { type HTMLAttributes } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getGitHubAvatarUrl(username: string): string {
  return `https://github.com/${username}.png`;
}

export function Avatar({
  src,
  alt,
  size = 'md',
  className = '',
  ...rest
}: AvatarProps) {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [src]);

  return (
    <div className={`relative inline-block ${sizeClasses[size]}`}>
      {imageError ? (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium ${className}`}
          title={alt}
        >
          {getInitials(alt)}
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
          onError={() => setImageError(true)}
          {...rest}
        />
      )}
    </div>
  );
}
