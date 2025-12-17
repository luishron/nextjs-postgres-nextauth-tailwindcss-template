import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ label, selected = false, icon, color, className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
          'border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          selected
            ? 'border-primary bg-primary text-primary-foreground shadow-md scale-105'
            : 'border-border bg-card text-card-foreground hover:border-primary/50 hover:bg-accent hover:scale-105',
          className
        )}
        style={
          selected && color
            ? {
                backgroundColor: color,
                borderColor: color,
                color: 'hsl(var(--primary-foreground))'
              }
            : {}
        }
        {...props}
      >
        {icon && <span className="text-base">{icon}</span>}
        {label}
      </button>
    );
  }
);

Chip.displayName = 'Chip';
