import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonGroupOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ButtonGroup({
  options,
  value,
  onChange,
  className
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg border border-border bg-muted p-1 shadow-sm',
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            value === option.value
              ? 'bg-background text-foreground shadow-sm scale-105'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
