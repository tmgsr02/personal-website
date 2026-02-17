import React from 'react';

interface RedDotIndicatorProps {
  mode?: 'inline' | 'nav' | 'hover';
  className?: string;
}

export default function RedDotIndicator({
  mode = 'inline',
  className = ''
}: RedDotIndicatorProps) {
  const baseStyles = 'rounded-full bg-[var(--signal-red)]';

  const sizeStyles = {
    inline: 'w-1.5 h-1.5',
    nav: 'w-2 h-2',
    hover: 'w-1.5 h-1.5',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[mode]} ${className}`}
      aria-hidden="true"
    />
  );
}
